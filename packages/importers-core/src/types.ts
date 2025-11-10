// Core types for all importers
export interface EmployeeRecord {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth?: string;
  startDate?: string;
  salary?: number;
  ppsn?: string; // Irish Personal Public Service Number
}

export interface ImportResult {
  success: boolean;
  recordCount: number;
  employees: EmployeeRecord[];
  errors: string[];
  warnings: string[];
}

export interface ImporterOptions {
  validatePPSN?: boolean;
  strictMode?: boolean;
}

export type ImporterFunction = (
  csvContent: string,
  options?: ImporterOptions
) => ImportResult;
