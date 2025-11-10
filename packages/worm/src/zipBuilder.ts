import type { EmployeeRecord } from '@cc/importers-core';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

/**
 * Converts employee records to CSV format for control file
 */
export function controlCsv(employees: EmployeeRecord[]): string {
  const headers = [
    'Employee ID',
    'First Name',
    'Last Name',
    'Email',
    'Date of Birth',
    'Start Date',
    'Salary',
    'PPSN',
  ];

  const rows = employees.map((emp) => [
    emp.employeeId,
    emp.firstName,
    emp.lastName,
    emp.email || '',
    emp.dateOfBirth || '',
    emp.startDate || '',
    emp.salary?.toString() || '',
    emp.ppsn || '',
  ]);

  const csvLines = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ];

  return csvLines.join('\n');
}

/**
 * Builds a ZIP file containing the control CSV and returns the file path
 */
export async function buildZip(
  runId: string,
  employees: EmployeeRecord[]
): Promise<string> {
  const csvContent = controlCsv(employees);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const zipFileName = `NAERSA_${runId}_${timestamp}.zip`;
  
  // Create .worm/submissions directory if it doesn't exist
  const submissionsDir = path.join(process.cwd(), '.worm', 'submissions');
  if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir, { recursive: true });
  }

  const zipPath = path.join(submissionsDir, zipFileName);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', () => {
      resolve(zipPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add the control CSV to the ZIP
    archive.append(csvContent, { name: `control_${runId}.csv` });

    // Finalize the archive
    archive.finalize();
  });
}
