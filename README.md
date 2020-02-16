<p align="center">
  <a href="https://github.com/peachjar/action-run-e2e/actions"><img alt="typescript-action status" src="https://github.com/peachjar/action-run-e2e/workflows/build-test/badge.svg"></a>
</p>

# Github Action: Run End-to-End Tests

Invoke the e2e tests on the Peachjar E2E Tests repository.

## Usage

```
uses: peachjar/action-run-e2e@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  domain: peachjar.com
```

If you want to invoke a specific tagged version of the tests:

```
uses: peachjar/action-run-e2e@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  domain: peachjar.com
  target: verified-20200229 # a Docker tag in the peachjar-tests package repo.
```
