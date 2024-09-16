import * as core from '@actions/core';
import * as InputService from '../inputs';
import { RepoLine, readCsv } from './read-csv';
import { Octokit } from '@octokit/rest';
import * as utils from '../utils/utils';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

export async function triggerService(inputs: InputService.Inputs): Promise<void> {
  const repository_csv_name = inputs.repository_csv_name;
  const batch_number = inputs.batch_number;
  const repositories: RepoLine[] = await readCsv(repository_csv_name);

  let reposToScan = repositories.slice(1); // Start slicing from index 
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

export async function retrieveLogs(inputs: InputService.Inputs): Promise<void> {
  const octokit = new Octokit({
    auth: inputs.github_token,
  });

  const owner = inputs.owner; 
  const repo = inputs.repo;

  try {
    // List all workflow runs for the repository
    const workflowRunsResponse = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
    });

    console.log(workflowRunsResponse.data);

    const targetWorkflowRun = workflowRunsResponse.data.workflow_runs[19]; // Get the first run for demonstration

    if (!targetWorkflowRun) {
      core.setFailed(`No workflow runs found for ${repo}`);
      return;
    }

    core.info(`Retrieving logs for workflow run ${targetWorkflowRun.id} in ${repo}`);

    // Get the logs for the target workflow run
    const logsResponse = await octokit.actions.downloadWorkflowRunLogs({
      owner,
      repo,
      run_id: targetWorkflowRun.id,
    });

    const githubWorkspace = process.env.GITHUB_WORKSPACE || '';
    const logsFolderPath = path.join(githubWorkspace, 'workflow-logs');

    const response = await fetch(logsResponse.url);
    const arrayBuffer = await response.arrayBuffer(); // Get the response as a buffer

    const filePath = path.join(logsFolderPath, 'workflow_run_logs.zip');
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    console.log('Logs zip downloaded successfully!');
    
  } catch (error) {
    console.error(`Error retrieving logs for ${repo}`, error);
  }
}
