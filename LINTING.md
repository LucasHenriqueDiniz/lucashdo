# Linting and Formatting Guide

This project is set up with ESLint and Prettier to ensure code quality and consistent formatting.

## Automatic Checks

### Pre-commit Hooks

Before each commit, Husky will automatically:

1. Format your code with Prettier
2. Run ESLint to fix any linting issues

This ensures that all code committed to the repository is properly formatted and follows the linting rules.

### GitHub Actions

Automated linting and formatting checks are configured with GitHub Actions:

1. **Push Checks**: Whenever code is pushed to the main or master branch, GitHub Actions will:

   - Run ESLint across the entire codebase
   - Check that all files conform to Prettier formatting

2. **Pull Request Checks**: For any pull request, GitHub Actions will:
   - Run ESLint across the entire codebase
   - Check that all files conform to Prettier formatting
   - Run TypeScript type checking

The workflow files are located in the `.github/workflows` directory.

## Manual Commands

- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Run ESLint and automatically fix issues when possible
- `npm run format` - Format all supported files with Prettier
- `npm run lint-check` - Run a manual lint check and save the report to the `lint-reports` directory
- `npm run type-check` - Run TypeScript type checking
