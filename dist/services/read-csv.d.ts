export type RepoLine = {
    repository_name: string;
    batch_number: string;
    scan_event: string;
    image: string;
    policy: string;
};
export declare function readCsv(csvName: string): Promise<RepoLine[]>;
