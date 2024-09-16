import * as core from '@actions/core';
import * as InputService from '../inputs';
import { RepoLine, readCsv } from './read-csv';
import { Octokit } from '@octokit/rest';
import * as utils from '../utils/utils';

export async function triggerService(inputs: InputService.Inputs): Promise<void> {
  const repository_csv_name = inputs.repository_csv_name;
  const batch_number = inputs.batch_number;
  const repositories: RepoLine[] = await readCsv(repository_csv_name);

  let reposToScan = repositories;
  if (batch_number)
    reposToScan = repositories.filter((repo) => repo.batch_number.trim() === batch_number);

  const octokit = new Octokit({
    auth: inputs.github_token,
  });

  let count = 0;

  for (const repo of reposToScan) {
    if (count > 5) {
      core.info('Sleeping for 5 seconds');
      await utils.sleep(5000);
      count = 0;
    }
    count++;
    core.info(`Triggering scan for ${repo.repository_name}`);
    try {
      await octokit.repos.createDispatchEvent({
        owner: inputs.owner,
        repo: inputs.repo,
        event_type: inputs.action === 'triggerPolicyScan' ? repo.scan_event.trim(): 'generate_tree',
        client_payload: {
          repository_full_name: repo.repository_name.trim(),
          image: repo.image.trim(),
          policy: repo.policy.trim(),
        },
      });
    } catch (error) {
      console.error(`Error triggering scan for ${repo.repository_name}`, error);
    }
  }
}
