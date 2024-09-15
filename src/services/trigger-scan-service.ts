import * as InputService from '../inputs';
import * as fs from 'fs';
import { parse, Options } from 'csv-parse';

type RepoLine = {
  repository_name: string;
  batch_number: number;
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
  // const batch_number = inputs.batch_number;
  // const github_token = inputs.github_token;
  // const repository_full_name = inputs.repository_full_name;
  const repositories = await readCsv(repository_csv_name);
  console.log('Repositories', repositories);

  // try {
  //   const application = await ApplicationService.getApplicationByName(appname, vid, vkey);
  //   core.setOutput('policy_name', application.profile.policies[0].name);
  // } catch (error) {
  //   core.info(`No application found with name ${appname}`);
  //   core.setOutput('policy_name', '');
  // }
}
