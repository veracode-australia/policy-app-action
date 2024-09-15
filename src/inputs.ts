import { InputOptions } from '@actions/core';

type GetInput = (name: string, options?: InputOptions | undefined) => string;

export type Inputs = {
  action:string;
  batch_number: number;
  github_token: string;
  repository_csv_name: string;
};

export const parseInputs = (getInput: GetInput): Inputs => {
  const action = getInput('action', { required: true });

  const batch_number = +getInput('batch_number', { required: false});
  const github_token = getInput('github_token');
  const repository_csv_name = getInput('repository_csv_name');

  if (action == 'triggerPolicyScan' && !(batch_number && github_token)) {
    throw new Error('Invalid inputs for triggerPolicyScan action');
  }
  return {
    action,
    batch_number,
    github_token,
    repository_csv_name,
  };
};
