const core = require('@actions/core');
const parser = require('conventional-commits-parser').sync;
const conventionalCommitTypes = require('conventional-commit-types');

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

module.exports = async function validateTitle(title) {
    let conventionalChangelogConfig = require("conventional-changelog-angular");

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

    if (getCommitTypes().includes(result.type)) {
        let match = title.match(/.* (\(\#\d*\))\s?$/);

        if (!match) {
            throw new Error(
                `Commit ID is required for pull requests of type: "${result.type}".`
            );
        }
    }

    if (getJiraTypes().includes(result.type)) {
        let match = title.match(/^.* (\[.*?\]).*?/);

        if (!match) {
            throw new Error(
                `Jira ID is required for pull requests of type: "${result.type}".`
            );
        }
    }

    function getJiraTypes()
    {
        return getTrimmedArray(core.getInput('jira_ids'));
    }

    function getCommitTypes()
    {
        return getTrimmedArray(core.getInput('commit_ids'));
    }

    function getTrimmedArray(data)
    {
        return data.split(',').map(Function.prototype.call, String.prototype.trim);
    }
};