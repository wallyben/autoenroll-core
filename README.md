# AutoEnroll.ie

Engine-agnostic orchestration for Ireland Auto-Enrolment (NAERSA).

## Overview

This is a production-ready TypeScript monorepo built with pnpm workspaces containing packages and CLI tools for managing Irish Auto-Enrolment data, including CSV imports and NAERSA submission generation.

## Project Structure

```
autoenroll-core/
├── packages/
│   ├── types/              # Shared TypeScript types
│   ├── csv-importer/       # CSV import utilities
│   └── naersa-adapter/     # NAERSA ZIP generation
├── apps/
│   ├── csv-import-cli/     # CLI for CSV imports
│   ├── naersa-generator-cli/ # CLI for NAERSA ZIP generation
│   └── orchestrator/       # Legacy orchestrator (imported)
├── examples/
│   └── data/               # Example CSV and JSON data files
└── docs/                   # Documentation
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Installation

Install pnpm if you haven't already:

```bash
npm install -g pnpm
```

Install dependencies:

```bash
pnpm install
```

## Building

Build all packages and apps:

```bash
pnpm build
```

Build a specific package:

```bash
pnpm --filter @autoenroll/types build
```

## Testing

Run all tests:

```bash
pnpm test
```

Run tests for a specific package:

```bash
pnpm --filter @autoenroll/csv-importer test
```

Run tests in watch mode:

```bash
pnpm --filter @autoenroll/csv-importer test:watch
```

## Linting and Formatting

Lint all packages:

```bash
pnpm lint
```

Format all files:

```bash
pnpm format
```

Check formatting:

```bash
pnpm format:check
```

## Type Checking

Run TypeScript type checking across all packages:

```bash
pnpm typecheck
```

## CLI Tools

### CSV Import CLI

Import employee, employer, or contribution data from CSV files.

**Usage:**

```bash
# Build the CLI first
pnpm --filter @autoenroll/csv-import-cli build

# Import employees
node apps/csv-import-cli/dist/index.js employees examples/data/employees.csv

# Import employers
node apps/csv-import-cli/dist/index.js employers examples/data/employers.csv

# Import contributions
node apps/csv-import-cli/dist/index.js contributions examples/data/contributions.csv

# Use custom delimiter
node apps/csv-import-cli/dist/index.js employees data.csv --delimiter=;
```

### NAERSA Generator CLI

Generate NAERSA submission ZIP files from JSON data.

**Usage:**

```bash
# Build the CLI first
pnpm --filter @autoenroll/naersa-generator-cli build

# Generate NAERSA ZIP
node apps/naersa-generator-cli/dist/index.js examples/data/naersa-submission.json

# Specify custom output path
node apps/naersa-generator-cli/dist/index.js examples/data/naersa-submission.json --output=output/submission.zip

# Skip validation
node apps/naersa-generator-cli/dist/index.js examples/data/naersa-submission.json --no-validate
```

## Development

Start development mode with watch:

```bash
pnpm dev
```

This will build all packages and watch for changes.

## Packages

### @autoenroll/types

Shared TypeScript types for all packages and apps.

### @autoenroll/csv-importer

Utilities for importing employee, employer, and contribution data from CSV files.

**Features:**

- Parse CSV with configurable delimiters
- Support for standard AutoEnroll CSV formats
- Type-safe outputs

### @autoenroll/naersa-adapter

Generate NAERSA submission ZIP files containing XML and manifest data.

**Features:**

- Generate NAERSA-compliant XML
- Create ZIP archives with proper structure
- Validation of submission data
- Comprehensive manifest generation

## CI/CD

The repository includes GitHub Actions workflows for:

- Moving files and directories
- One-tap bootstrap and merge
- One-tap finalization

Additional CI workflows for build, test, and lint should be added based on your deployment requirements.

## Production Readiness

See [docs/production-readiness.md](docs/production-readiness.md) for detailed information on:

- SLOs and architecture
- Security and GDPR compliance
- Incident response procedures
- Disaster recovery plans

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint`
5. Format code: `pnpm format`
6. Submit a pull request

## License

Proprietary - Example Company Ltd
