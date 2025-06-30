# Contributing to JSDoc Sentinel

First off, thanks for taking the time to contribute! We welcome all kinds of contributions: bug reports, feature requests, documentation improvements, code patches, performance optimizations, and more.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork:

   ```bash
   git clone https://github.com/michaelbarley/jsdoc-sentinel.git
   cd jsdoc-sentinel
   ```
3. **Install dependencies**:

   ```bash
   npm ci
   ```
4. **Build and watch**:

   ```bash
   npm run watch
   ```
5. **Run tests** to verify everything is working before you start coding:

   ```bash
   npm test
   ```

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). By participating, you agree to abide by its terms.

## How to Contribute

### Reporting Bugs

* Please search existing [issues](https://github.com/michaelbarley/jsdoc-sentinel/issues) before opening a new one.
* Provide a clear title and description.
* Include steps to reproduce, expected vs. actual behavior, and any logs or screenshots.

### Suggesting Enhancements

* Use the issue tracker to propose new features or improvements.
* Describe the use case, user experience, and any API/behavior changes.

### Pull Requests

1. **Branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit** messages should follow conventional style:

   * Prefix with the type (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
   * Subject should be short and imperative.
   * Body (if needed) should explain the *why* and *how*.

   *Example:*

   ```text
   feat: add support for optional @throws detection
   ```
3. **Run** linting and tests locally:

   ```bash
   npm run lint
   npm test
   ```
4. **Push** to your fork and open a PR against `main`:

   ```bash
   git push origin feature/your-feature-name
   ```
5. Fill out the PR template with:

   * Motivation and context
   * What has changed
   * How to test
   * Screenshots (if UI-related)

## Development Guidelines

* Follow the existing code style: double quotes, no trailing commas, AirBnB + TypeScript ESLint rules.
* Write unit tests for new features and edge cases; maintain 100% coverage for critical modules.
* Keep functions small and focused; adhere to SOLID/KISS principles.
* Document public APIs in JSDoc format so that JSDoc Sentinel can validate them!

## Branching Strategy and Releases

* `main` always reflects the latest stable release.
* Create feature branches off `main`.
* Merge only via pull requests; require at least one approving review.
* Release versions via GitHub Releases when merging a `release/*` branch.

## Continuous Integration

* All PRs are validated in GitHub Actions for linting, testing, and coverage.
* Ensure your branch passes the CI checks before requesting a review.

## Questions?

Feel free to open an issue or reach out on our discussion board. We’re happy to help newcomers get started!

---

<sub>Thank you for improving JSDoc Sentinel! 🚀</sub>
