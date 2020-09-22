const core = require('@actions/core');
const github = require('@actions/github');
const validateTitle = require('./validateTitle');

async function run() {
    try {
        const contextPullRequest = github.context.payload.pull_request;

        if (!contextPullRequest) {
            throw new Error(
                "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
            );
        }

        const title = contextPullRequest.title;

        let error = null;
        try {
            await validateTitle(title);
        } catch (err) {
            error = err;
        }

        core.setOutput('success', Boolean(error).toString());

        let state = 'success';
        description = `"${title}" follows conventional git spec.`;

        if (error) {
            state = 'failure';
            description = `"${title}" does not follow conventional git spec.`;
            throw error;
        }

    } catch (error) {
        core.setFailed(error.message);
    }
};

run().catch(console.error);