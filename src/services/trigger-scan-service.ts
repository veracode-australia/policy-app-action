import * as core from '@actions/core';
import * as InputService from '../inputs';
import * as fs from 'fs';
import { parse, Options } from 'csv-parse';
import { Octokit } from '@octokit/rest';
import * as utils from '../utils/utils';

type RepoLine = {
  repository_name: string;
  batch_number: string;
  scan_event: string;
  image: string;
  policy: string;
};

async function readCsv(csvName: string): Promise<RepoLine[]> {
  const headers = ['repository_name', 'batch_number', 'scan_event', 'image', 'policy'];
  const options: Options = {
    delimiter: ',',
    columns: headers,
  };

  const fileContent = fs.readFileSync(csvName, { encoding: 'utf-8' });

  return new Promise((resolve, reject) => {
    parse(fileContent, options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as RepoLine[]);
      }
    });
  });
}

export async function triggerScanService(inputs: InputService.Inputs): Promise<void> {
  const repository_csv_name = inputs.repository_csv_name;
  const batch_number = inputs.batch_number;
  const repositories = await readCsv(repository_csv_name);

  const reposToScan = repositories.filter((repo) => repo.batch_number.trim() === batch_number);
  core.info(`Repos to scan: ${JSON.stringify(reposToScan)}`);

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
        event_type: repo.scan_event.trim(),
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
