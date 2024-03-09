# Init

```bash
npm i
npm run link
```

# Testing

```bash
npm run test

#or (see playwright.config.ts for project names, or omit)
npx playwright test -g "testName" --project "projectName"
```

- Missing golden screenshots indicate that the test case is not supported by projectrix yet
- Tests will occasionally fail due to a transient connection refused error, especially firefox

## Updating golden screenshots

```bash
npm run updateTestScreenshots

#or
npx playwright test -g "testName" --project "projectName" --update-snapshots
```

# Developing

```bash
npm run dev
```

Then navigate to the link that Vite prints on the console
