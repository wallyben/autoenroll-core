import { parse } from 'csv-parse/sync';
import type { Employee, Employer, Contribution, CSVImportOptions } from '@autoenroll/types';

interface CSVRecord {
  [key: string]: string;
}

/**
 * Import employees from CSV data
 */
export function importEmployeesFromCSV(
  csvData: string,
  options: CSVImportOptions = {}
): Employee[] {
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: options.delimiter || ',',
    from_line: options.skipLines ? options.skipLines + 1 : 1,
  }) as CSVRecord[];

  return records.map((record) => ({
    id: record.id || record.employee_id,
    employerId: record.employer_id,
    firstName: record.first_name,
    lastName: record.last_name,
    ppsNumber: record.pps_number,
    dateOfBirth: record.date_of_birth,
    email: record.email,
    phone: record.phone,
    address: {
      line1: record.address_line1,
      line2: record.address_line2,
      city: record.city,
      county: record.county,
      postalCode: record.postal_code,
      country: record.country || 'Ireland',
    },
    employmentStartDate: record.employment_start_date,
    salary: parseFloat(record.salary),
  }));
}

/**
 * Import employers from CSV data
 */
export function importEmployersFromCSV(
  csvData: string,
  options: CSVImportOptions = {}
): Employer[] {
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: options.delimiter || ',',
    from_line: options.skipLines ? options.skipLines + 1 : 1,
  }) as CSVRecord[];

  return records.map((record) => ({
    id: record.id || record.employer_id,
    name: record.name,
    taxNumber: record.tax_number,
    address: {
      line1: record.address_line1,
      line2: record.address_line2,
      city: record.city,
      county: record.county,
      postalCode: record.postal_code,
      country: record.country || 'Ireland',
    },
  }));
}

/**
 * Import contributions from CSV data
 */
export function importContributionsFromCSV(
  csvData: string,
  options: CSVImportOptions = {}
): Contribution[] {
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    delimiter: options.delimiter || ',',
    from_line: options.skipLines ? options.skipLines + 1 : 1,
  }) as CSVRecord[];

  return records.map((record) => {
    const employeeAmount = parseFloat(record.employee_amount);
    const employerAmount = parseFloat(record.employer_amount);

    return {
      id: record.id || record.contribution_id,
      employeeId: record.employee_id,
      employerId: record.employer_id,
      periodStart: record.period_start,
      periodEnd: record.period_end,
      employeeAmount,
      employerAmount,
      totalAmount: employeeAmount + employerAmount,
    };
  });
}

export { CSVImportOptions };
