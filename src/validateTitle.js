const core = require('@actions/core');
const parser = require('conventional-commits-parser').sync;
const conventionalCommitTypes = require('conventional-commit-types');

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

module.exports = async function validateTitle(title) {
    let conventionalChangelogConfig = require("conventional-changelog-angular");
    let requiresCommitIds = core.getInput('commit_ids');
    let requiresJiraIds = core.getInput('jira_ids');

    if (isFunction(conventionalChangelogConfig)) {
        conventionalChangelogConfig = await conventionalChangelogConfig();
    }
    const { parserOpts } = conventionalChangelogConfig;
    let clean_title = title.replace("!:", ":");
    clean_title = clean_title.replace("BREAKING CHANGE", "feat");
    const result = parser(clean_title, parserOpts);

    if (!result.type) {
        throw new Error(
            `No release type found in pull request title "${title}".` +
            '\n\nAdd a prefix like "fix: ", "feat: " or "feat!: " to indicate what kind of release this pull request corresponds to. The title should match the commit mesage format as specified by https://www.conventionalcommits.org/.'
        );
    }

    const allowedTypes = Object.keys(conventionalCommitTypes.types);
    if (!allowedTypes.includes(result.type)) {
        throw new Error(
            `Unknown release type "${result.type}" found in pull request title "${title}".` +
            `\n\nPlease use one of these recognized types: ${allowedTypes.join(
                ', '
            )}.`
        );
    }

    if (requiresCommitIds.includes(result.type)) {
        let match = title.match(/.* (\(\#\d*\))\s?$/);

        if (!match) {
            throw new Error(
                `No commit id is present in message.`
            );
        }
    }

    if (requiresJiraIds.includes(result.type)) {
        let match = title.match(/^.* (\[.*?\]).*?/);

        if (!match) {
            throw new Error(
                `Jira ID is required for pull requests of type "feat".`
            );
        }
    }
};