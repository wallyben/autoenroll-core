# autoenroll-core

Irish Auto-Enrolment SaaS Platform

## Overview

This monorepo contains the core infrastructure for the Irish Auto-Enrolment pension system, including payroll import utilities and a Bureau Console for managing submissions.

## Project Structure

```
.
├── apps/
│   ├── console/           # Next.js Bureau Console application
│   └── orchestrator/      # Orchestrator service
├── packages/
│   ├── importers-core/    # Core types and interfaces for importers
│   ├── importer-brightpay/# BrightPay CSV parser
│   └── worm/              # ZIP building utilities for submissions
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Installation

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm -r build
```

### Development

```bash
# Run all services in development mode
pnpm dev

# Run a specific app
pnpm --filter @cc/console dev

# Build all packages
pnpm -r build

# Type check all packages
pnpm -r type-check

# Lint all packages
pnpm -r lint
```

## Packages

### @cc/importers-core

Core types and interfaces used by all importer packages.

### @cc/importer-brightpay

Parses BrightPay payroll CSV files and converts them to standard employee records with validation.

### @cc/worm

Utilities for building ZIP submission packages for the NAERSA pension system.

## Applications

### Bureau Console (`apps/console`)

A Next.js 14 web application for importing payroll data and generating pension auto-enrolment submission packages.

Features:
- CSV import from BrightPay (Sage coming soon)
- Real-time validation and error reporting
- Automated ZIP package generation
- Modern, responsive UI

See [apps/console/README.md](apps/console/README.md) for more details.

## Contributing

This is a private project. Please follow the established code style and ensure all tests pass before submitting changes.

## Security

Please report security vulnerabilities to the project maintainers. Do not create public issues for security concerns.

## License

Private - Irish Auto-Enrolment SaaS Platform
