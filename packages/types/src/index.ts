/**
 * Core AutoEnroll types
 */

/**
 * Employer information
 */
export interface Employer {
  id: string;
  name: string;
  taxNumber: string;
  address: Address;
}

/**
 * Employee information
 */
export interface Employee {
  id: string;
  employerId: string;
  firstName: string;
  lastName: string;
  ppsNumber: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address: Address;
  employmentStartDate: string;
  salary: number;
}

/**
 * Address information
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postalCode: string;
  country: string;
}

/**
 * Contribution record
 */
export interface Contribution {
  id: string;
  employeeId: string;
  employerId: string;
  periodStart: string;
  periodEnd: string;
  employeeAmount: number;
  employerAmount: number;
  totalAmount: number;
}

/**
 * CSV import options
 */
export interface CSVImportOptions {
  delimiter?: string;
  hasHeader?: boolean;
  skipLines?: number;
}

/**
 * NAERSA submission data
 */
export interface NAERSASubmission {
  employerId: string;
  periodStart: string;
  periodEnd: string;
  employees: Employee[];
  contributions: Contribution[];
}

/**
 * NAERSA ZIP generation options
 */
export interface NAERSAZipOptions {
  outputPath?: string;
  validate?: boolean;
}
