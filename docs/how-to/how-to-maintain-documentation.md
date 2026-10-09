# Maintain Documentation

## Apply the Hub Scaffold

The local package is available without registry access:

```bash
node /Users/KevinM/Projects/documentation-hub/bin/asg-docs.js init --project-type auto --dry-run
node /Users/KevinM/Projects/documentation-hub/bin/asg-docs.js validate
```

For a package runner, pack a snapshot first to avoid npm attempting to chmod a symlink into the read-only source checkout:

```bash
npm pack /Users/KevinM/Projects/documentation-hub --ignore-scripts --pack-destination /private/tmp
npm exec --package=/private/tmp/asg-architects-documentation-hub-0.1.4.tgz -- asg-docs validate
```

If the private package registry is already configured, `npx @asg-architects/documentation-hub@0.1.4 validate` is also available. Registry access has not been configured or tested for this app. No hub package is added to the app's runtime dependencies.

## Update Documents

Change planning when intent changes; change technical reference when behavior changes. Use the planning index for requirements/ADRs and the technical index for operational docs. Update capability states only with implementation evidence.

Re-run scaffold init without `--force` to preserve tailored content. Do not force-overwrite this project's Mac paths, review policy or populated planning files.

## Validate

```bash
npm run docs:check
npm run format:check
PATH="$PWD/node_modules/.bin:$PATH" node /Users/KevinM/Projects/documentation-hub/bin/asg-docs.js validate
```

Lint includes dot directories containing agent rules. Link checks validate local file targets while ignoring URLs, template tokens and anchor fragments. External URLs/platform claims need separate live verification when used. Scaffold validate only checks presence and tool availability.

## Commit

Use a local `docs:` commit with accurate source/review metadata. Keep sandboxing enabled; Git operations may require scoped permission. GitHub setup and PRs remain deferred by the user.
