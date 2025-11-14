import Papa from 'papaparse';
import type { ImportResult, EmployeeRecord, ImporterOptions } from '@cc/importers-core';

/**
 * Maps BrightPay CSV format to standard employee records
 * Expected columns: Employee ID, First Name, Last Name, Email, DOB, Start Date, Salary, PPSN
 */
export function mapBrightPay(
  csvContent: string,
  options: ImporterOptions = {}
): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const employees: EmployeeRecord[] = [];

  try {
    const parsed = Papa.parse(csvContent, {
      header: false,
      skipEmptyLines: true,
    });

    if (parsed.errors && parsed.errors.length > 0) {
      parsed.errors.forEach((error: any) => {
        errors.push(`CSV Parse Error: ${error.message} at row ${error.row}`);
      });
    }

    const rows = parsed.data as string[][];
    
    if (rows.length === 0) {
      return {
        success: false,
        recordCount: 0,
        employees: [],
        errors: ['CSV file is empty'],
        warnings: [],
      };
    }

    // Skip header row (row 0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Validate minimum columns
      if (row.length < 3) {
        warnings.push(`Row ${i + 1}: Insufficient columns, skipping`);
        continue;
      }

      const employee: EmployeeRecord = {
        employeeId: row[0]?.trim() || '',
        firstName: row[1]?.trim() || '',
        lastName: row[2]?.trim() || '',
        email: row[3]?.trim() || undefined,
        dateOfBirth: row[4]?.trim() || undefined,
        startDate: row[5]?.trim() || undefined,
        salary: row[6] ? parseFloat(row[6]) : undefined,
        ppsn: row[7]?.trim() || undefined,
      };

      // Validate required fields
      if (!employee.employeeId || !employee.firstName || !employee.lastName) {
        warnings.push(
          `Row ${i + 1}: Missing required fields (ID, First Name, or Last Name), skipping`
        );
        continue;
      }

      // Validate PPSN format if present and strict mode is on
      if (options.validatePPSN && employee.ppsn) {
        const ppsnRegex = /^[0-9]{7}[A-Z]{1,2}$/;
        if (!ppsnRegex.test(employee.ppsn)) {
          if (options.strictMode) {
            errors.push(`Row ${i + 1}: Invalid PPSN format: ${employee.ppsn}`);
            continue;
          } else {
            warnings.push(`Row ${i + 1}: Invalid PPSN format: ${employee.ppsn}`);
          }
        }
      }

      employees.push(employee);
    }

    return {
      success: errors.length === 0,
      recordCount: employees.length,
      employees,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      recordCount: 0,
      employees: [],
      errors: [`Unexpected error: ${error instanceof Error ? error.message : String(error)}`],
      warnings,
    };
  }
}
