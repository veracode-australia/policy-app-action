import { InputOptions } from '@actions/core';

type GetInput = (name: string, options?: InputOptions | undefined) => string;

export type Inputs = {
  action: string;
  repository_full_name: string;
  batch_number: string;
  github_token: string;
  repository_csv_name: string;
};

export const parseInputs = (getInput: GetInput): Inputs => {
  const action = getInput('action', { required: true });
  const repository_full_name = getInput('repository_full_name', { required: false });
  const batch_number = getInput('batch_number', { required: false });
  const github_token = getInput('github_token', { required: false });
  const repository_csv_name = getInput('repository_csv_name', { required: false });

  if (action == 'triggerPolicyScan') {
    if (!batch_number) {
      throw new Error('batch_number is required for triggerPolicyScan action');
    } else if (!github_token) {
      throw new Error('github_token is required for triggerPolicyScan action');
    } else if (!repository_csv_name) {
      throw new Error('repository_csv_name is required for triggerPolicyScan action');
    } else if (!repository_full_name) {
      throw new Error('repository_full_name is required for triggerPolicyScan action');
    } else if (repository_full_name.split('/').length !== 2) {
      throw new Error('repository_full_name must be in the format owner/repo');
    }
  }

  return {
    action,
    batch_number,
    github_token,
    repository_csv_name,
    repository_full_name,
  };
};
