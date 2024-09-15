import { InputOptions } from '@actions/core';
type GetInput = (name: string, options?: InputOptions | undefined) => string;
export type Inputs = {
    action: string;
    batch_number: number;
    github_token: string;
    repository_csv_name: string;
};
export declare const parseInputs: (getInput: GetInput) => Inputs;
export {};
