const validateTitle = require('../validateTitle');

jest.setTimeout(1000);

beforeEach(() => {
    setInput('commit_ids', 'feat, fix');
    setInput('jira_ids', 'feat');
});

const setInput = (name,value)=>
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`]=value

it('detects valid PR titles', async () => {
    const inputs = [
        "feat: check order of resources in behat tests [MIM-1409] (#123)",
        "perf: check order of resources in behat tests [MIM-1409] (#123)",
        "ci: check order of resources in behat tests [MIM-1409] (#123)",
        "docs: check order of resources in behat tests [MIM-1409] (#123)",
        "style: check order of resources in behat tests [MIM-1409] (#123)",
        "test: check order of resources in behat tests [MIM-1409] (#123)",
        "build: check order of resources in behat tests [MIM-1409] (#123)",
        "feat!: check order of resources in behat tests [MIM-1409] (#123)",
        "BREAKING CHANGE: check order of resources in behat tests [MIM-1409] (#123)",
        "fix(release): need to depend on latest rxjs and zone.js (#123)",
        "feat(release): need to depend on latest rxjs and zone.js [MIM-1409] (#123)",
        "feat(release)!: need to depend on latest rxjs and zone.js [MIM-1409] (#123)",
        "chore: merge develop into master",
        "chore(merge): merge develop into master",
        "chore(release): 1.9.2"
    ];

    for (let index = 0; index < inputs.length; index++) {
        const input = inputs[index];
        await validateTitle(input);
    }
});

it('throws for PR titles without a type', async () => {
    await expect(validateTitle('Fix bug')).rejects.toThrow(
        /No release type found in pull request title "Fix bug"./
    );
});

it('throws for PR titles without a Jira Id if type is feat', async () => {
    await expect(validateTitle('feat: check order of resources in behat tests (#123)')).rejects.toThrow(
        /Jira ID is required for pull requests of type: \"feat\"./
    );
});

it('throws for PR titles without a commit id', async () => {
    await expect(validateTitle('feat: check order of resources in behat tests [MIM-1409]')).rejects.toThrow(
        /Commit ID is required for pull requests of type: \"feat\"./
    );
});

it('throws for PR titles with an unknown type', async () => {
    await expect(validateTitle('foo: Bar')).rejects.toThrow(
        /Unknown release type "foo" found in pull request title "foo: Bar"./
    );
});

it('throws for merge commits without type', async () => {
    await expect(validateTitle('merge release/astatine to master')).rejects.toThrow(
        /No release type found in pull request title "merge release\/astatine to master"./
    );
});