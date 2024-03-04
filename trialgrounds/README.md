# Init

```bash
npm i
npm run link
```

# Testing

```bash
npm run test

#or
npx playwright test -g "testName"
```

- Missing golden screenshots indicate that the test case is not supported by projectrix yet
- Tests will occasionally fail due to a transient connection refused error

## Updating golden screenshots

```bash
npm run updateTestScreenshots

#or
npx playwright test -g "testName" --update-snapshots
```

# Developing

```bash
npm run dev
```

Then navigate to the link that Vite prints on the console
