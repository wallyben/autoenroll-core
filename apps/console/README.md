# Bureau Console

Irish Auto-Enrolment Bureau Console - A Next.js 14 application for managing payroll imports and pension auto-enrolment submissions.

## Features

- **Multi-source Import**: Support for BrightPay CSV files (Sage coming soon)
- **Validation**: Real-time validation with warnings and error reporting
- **ZIP Generation**: Automated NAERSA submission package creation
- **Modern UI**: Built with TailwindCSS and Framer Motion for smooth animations
- **Type-safe**: Full TypeScript support across all packages

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Installation

From the repository root:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Start the development server
pnpm --filter @cc/console dev
```

The console will be available at `http://localhost:3000`.

### Production Build

```bash
# Build for production
pnpm --filter @cc/console build

# Start production server
pnpm --filter @cc/console start
```

## Usage

### Importing Payroll Data

1. Select your payroll source (BrightPay or Sage)
2. Upload a CSV file with employee data
3. Review the import summary, including any warnings or errors

#### BrightPay CSV Format

Expected columns:
- Employee ID (required)
- First Name (required)
- Last Name (required)
- Email (optional)
- DOB (optional)
- Start Date (optional)
- Salary (optional)
- PPSN (optional)

Example:
```csv
Employee ID,First Name,Last Name,Email,DOB,Start Date,Salary,PPSN
EMP001,John,Doe,john.doe@example.com,1990-01-15,2020-03-01,45000,1234567AB
EMP002,Jane,Smith,jane.smith@example.com,1985-05-20,2019-06-15,52000,2345678BC
```

### Building Submission Packages

1. After a successful import, a Run ID will be generated
2. Click "Build Submission ZIP" to create the NAERSA package
3. The ZIP file will be created in `.worm/submissions/`
4. Submit the ZIP file to your pension provider

## API Endpoints

### POST /api/import

Import and parse payroll CSV files.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: CSV file
  - `source`: "brightpay" or "sage"

**Response:**
```json
{
  "success": true,
  "recordCount": 5,
  "employees": [...],
  "errors": [],
  "warnings": []
}
```

### POST /api/build-zip

Build a ZIP package for submission.

**Request:**
- Content-Type: `application/json`
- Body:
```json
{
  "runId": "RUN_1234567890",
  "employees": [...]
}
```

**Response:**
```json
{
  "success": true,
  "zipPath": "/path/to/NAERSA_RUN_1234567890_2025-11-10.zip",
  "runId": "RUN_1234567890",
  "recordCount": 5
}
```

## Project Structure

```
apps/console/
├── app/
│   ├── api/
│   │   ├── import/         # CSV import endpoint
│   │   └── build-zip/      # ZIP generation endpoint
│   ├── AutoEnrollBureauConsole.tsx  # Main UI component
│   ├── page.tsx            # Home page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Dependencies

- **Next.js 14**: React framework with App Router
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Recharts**: Chart library (for future analytics)

## Security

The application includes security measures to prevent:
- Path traversal attacks (sanitized file paths)
- Malicious CSV content (validated and parsed safely)
- XSS attacks (React's built-in escaping)

All user inputs are sanitized before being used in file operations.

## License

Private - Irish Auto-Enrolment SaaS Platform
