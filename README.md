# WebAPI PR title Validator

This is a GitHub action that can be configured from any repository to validate a title of a pull request.

## Setup:

Do the following to setup this Github Action on your repo:

1. Create folder `.github` in root of project
2. Create folder `workflows` inside the `.github` folder
3. Create `.yml` file by name you choose. E.g. `pr-validation.yml` inside the `workflows` folder.
4. Copy & Paste the following content into the file:
```
name: Check PR title
on:
  pull_request:
    branches:
      - master
      - develop
    types:
      - opened
      - reopened
      - edited
      - synchronize

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: drdk/pr-validator@master
```

You can customize the branches that the action will run on by changing `master` and `develop` to anything you like. You can remove the branches all together to run the action on every branch.

### Configuation of enforcement of commit and Jira ids

You can enforce the types of commits that should require either Jira or Commit IDs.

After you have defined the job, pass `commit_ids` and/or `jira_ids` as arguments to the job using the `with` key.
You must provide `types` as a comma seperated string:

```
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: drdk/pr-validator@master
      with:
          jira_ids: feat
          commit_ids: feat,docs,fix,build,ci,style,perf,test
```

## Running action

By adding the GitAction a workflow will automatically be created and run when a pull request is made.

### Enforcing action

The action if will run automatically if added to repo, but it is not required to run or pass to merge pull request. To enforce the test you can do the dollowing:

1. Go to settings page for repo.
2. Choose `Branches` from sidemenu.
3. Check `Require status checks to pass before merging` if not checked.
4. Select `lint` option in list of possible checks. 
  (*Enforce another name if you have changed the name in your configuation.*)
5. Save changes.

## Errors

If the workflow is run on events that are not pull requests such as pull requests etc. An error will be thrown and the workflow will fail.
