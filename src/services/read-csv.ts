import * as fs from 'fs';
import { parse, Options } from 'csv-parse';

export type RepoLine = {
  repository_name: string;
  batch_number: string;
  scan_event: string;
  image: string;
  policy: string;
};

export async function readCsv(csvName: string): Promise<RepoLine[]> {
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