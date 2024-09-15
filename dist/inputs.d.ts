import { InputOptions } from '@actions/core';
type GetInput = (name: string, options?: InputOptions | undefined) => string;
export type Inputs = {
    action: string;
    repository_full_name: string;
    batch_number: string;
    github_token: string;
    repository_csv_name: string;
};
export declare const parseInputs: (getInput: GetInput) => Inputs;
export {};
