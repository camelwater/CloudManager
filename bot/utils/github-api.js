"use strict";

const { Octokit } = require("@octokit/core");
// const octokit = new Octokit({ auth: `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` });
const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });

module.exports.runWorkflow = async(workflow_file, inputs) => {
    const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: 'LZ-Azure904',
        repo: 'Azure3.0',
        workflow_id: workflow_file+'.yaml',
        ref: 'main',
        inputs: inputs
    });
    return response;
};