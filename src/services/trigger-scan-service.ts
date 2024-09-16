import * as InputService from '../inputs';
import * as fs from 'fs';
import { parse, Options } from 'csv-parse';
import { Octokit } from '@octokit/rest'; // Import Octokit

type RepoLine = {
  repository_name: string;
  batch_number: string;
  language: string;
};

async function readCsv(csvName: string): Promise<RepoLine[]> {
  const headers = ['repository_name', 'batch_number', 'language'];
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
  // const github_token = inputs.github_token;
  // const repository_full_name = inputs.repository_full_name;
  const repositories = await readCsv(repository_csv_name);

  const reposToScan = repositories.filter((repo) => repo.batch_number.trim() === batch_number);
  console.log('Repos to scan', reposToScan);

  const octokit = new Octokit({
    auth: inputs.github_token,
  });

  for (const repo of reposToScan) {
    console.log(`Triggering scan for ${repo.repository_name}`);
    try {
      await octokit.repos.createDispatchEvent({
        owner: inputs.owner,
        repo: inputs.repo,
        event_type: 'veracode-policy-scan',
        client_payload: {
          repository_full_name: repo.repository_name,
        },
      });
      // await octokit.actions.createWorkflowDispatch({
      //   owner: inputs.owner,
      //   repo: inputs.repo,
      //   workflow_id: 'scan.yml',
      //   ref: 'main',
      //   inputs: {
      //     repository_name: repo.repository_name,
      //   },
      // });
    } catch (error) {
      console.error(`Error triggering scan for ${repo.repository_name}`, error);
    }
  }
}
