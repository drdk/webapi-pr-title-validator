const validateTitle = require('../validateTitle');

// Install preset (takes some time)
jest.setTimeout(10000);

it('detects valid PR titles', async () => {
    const inputs = [
        "fix: Fix bug",
        "fix: Fix bug\n\nBREAKING CHANGE: Fix bug",
        "feat: Add feature",
        "feat: Add feature\n\nBREAKING CHANGE: Add feature",
        "refactor!: Internal cleanup",
        "docs(changelog): update changelog to beta.5",
        "chore(merge): merge release/mercury to master",
        "feat: check order of resources in behat tests [MIM-1409]",
        "perf: check order of resources in behat tests [MIM-1409]",
        "ci: check order of resources in behat tests [MIM-1409]",
        "docs: check order of resources in behat tests [MIM-1409]",
        "style: check order of resources in behat tests [MIM-1409] (#3f3ca)",
        "test: check order of resources in behat tests [MIM-1409]",
        "build: check order of resources in behat tests [MIM-1409]",
        "feat!: check order of resources in behat tests [MIM-1409]",
        "BREAKING CHANGE: check order of resources in behat tests [MIM-1409]",
        "fix(release): need to depend on latest rxjs and zone.js"
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