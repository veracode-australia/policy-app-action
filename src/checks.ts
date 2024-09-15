import { Octokit } from '@octokit/rest';
import * as Checks from './namespaces/Checks';

export async function updateChecks(
  octokit: Octokit,
  checksStatic: Checks.ChecksStatic,
  conclusion: Checks.Conclusion,
  annotations: Checks.Annotation[],
  summary: string,
): Promise<void> {
  const data = {
    owner: checksStatic.owner,
    repo: checksStatic.repo,
    check_run_id: checksStatic.check_run_id,
    status: checksStatic.status,
    conclusion: conclusion,
    output: {
      annotations: annotations as [],
      title: 'Veracode Static Code Analysis',
      summary: summary,
    },
  };
  await octokit.checks.update(data);
}
