import archiver from 'archiver';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import type { NAERSASubmission, NAERSAZipOptions } from '@autoenroll/types';

/**
 * Generate NAERSA XML content from submission data
 */
function generateNAERSAXML(submission: NAERSASubmission): string {
  const { employerId, periodStart, periodEnd, employees, contributions } = submission;

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<NAERSASubmission>\n';
  xml += `  <EmployerID>${employerId}</EmployerID>\n`;
  xml += `  <PeriodStart>${periodStart}</PeriodStart>\n`;
  xml += `  <PeriodEnd>${periodEnd}</PeriodEnd>\n`;

  xml += '  <Employees>\n';
  for (const employee of employees) {
    xml += '    <Employee>\n';
    xml += `      <ID>${employee.id}</ID>\n`;
    xml += `      <FirstName>${employee.firstName}</FirstName>\n`;
    xml += `      <LastName>${employee.lastName}</LastName>\n`;
    xml += `      <PPSNumber>${employee.ppsNumber}</PPSNumber>\n`;
    xml += `      <DateOfBirth>${employee.dateOfBirth}</DateOfBirth>\n`;
    xml += `      <Salary>${employee.salary}</Salary>\n`;
    xml += '    </Employee>\n';
  }
  xml += '  </Employees>\n';

  xml += '  <Contributions>\n';
  for (const contribution of contributions) {
    xml += '    <Contribution>\n';
    xml += `      <ID>${contribution.id}</ID>\n`;
    xml += `      <EmployeeID>${contribution.employeeId}</EmployeeID>\n`;
    xml += `      <EmployeeAmount>${contribution.employeeAmount}</EmployeeAmount>\n`;
    xml += `      <EmployerAmount>${contribution.employerAmount}</EmployerAmount>\n`;
    xml += `      <TotalAmount>${contribution.totalAmount}</TotalAmount>\n`;
    xml += '    </Contribution>\n';
  }
  xml += '  </Contributions>\n';

  xml += '</NAERSASubmission>\n';
  return xml;
}

/**
 * Validate NAERSA submission data
 */
function validateSubmission(submission: NAERSASubmission): void {
  if (!submission.employerId) {
    throw new Error('Employer ID is required');
  }
  if (!submission.periodStart || !submission.periodEnd) {
    throw new Error('Period start and end dates are required');
  }
  if (!submission.employees || submission.employees.length === 0) {
    throw new Error('At least one employee is required');
  }
  if (!submission.contributions || submission.contributions.length === 0) {
    throw new Error('At least one contribution is required');
  }
}

/**
 * Generate NAERSA ZIP file from submission data
 */
export async function generateNAERSAZip(
  submission: NAERSASubmission,
  options: NAERSAZipOptions = {}
): Promise<string> {
  const { outputPath = './naersa-submission.zip', validate = true } = options;

  // Validate submission if requested
  if (validate) {
    validateSubmission(submission);
  }

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });

  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      resolve(outputPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Generate and add XML content
    const xmlContent = generateNAERSAXML(submission);
    archive.append(xmlContent, { name: 'submission.xml' });

    // Add manifest
    const manifest = {
      version: '1.0',
      employer_id: submission.employerId,
      period_start: submission.periodStart,
      period_end: submission.periodEnd,
      employee_count: submission.employees.length,
      contribution_count: submission.contributions.length,
      generated_at: new Date().toISOString(),
    };
    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

    archive.finalize();
  });
}

export { NAERSASubmission, NAERSAZipOptions };
