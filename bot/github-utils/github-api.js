"use strict";

const tokens = require('./tokens.json')
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: tokens.GITHUB_API_TOKEN });

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