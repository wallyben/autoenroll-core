import { describe, it, expect } from 'vitest';
import {
  importEmployeesFromCSV,
  importEmployersFromCSV,
  importContributionsFromCSV,
} from './index';

describe('CSV Importer', () => {
  describe('importEmployeesFromCSV', () => {
    it('should import employees from CSV data', () => {
      const csvData = `id,employer_id,first_name,last_name,pps_number,date_of_birth,email,address_line1,city,postal_code,employment_start_date,salary
123,emp-1,John,Doe,1234567T,1990-01-01,john@example.com,123 Main St,Dublin,D01 A1B2,2020-01-01,50000`;

      const employees = importEmployeesFromCSV(csvData);

      expect(employees).toHaveLength(1);
      expect(employees[0]).toMatchObject({
        id: '123',
        employerId: 'emp-1',
        firstName: 'John',
        lastName: 'Doe',
        ppsNumber: '1234567T',
        salary: 50000,
      });
      expect(employees[0].address.city).toBe('Dublin');
    });

    it('should handle custom delimiter', () => {
      const csvData = `id;employer_id;first_name;last_name;pps_number;date_of_birth;address_line1;city;postal_code;employment_start_date;salary
456;emp-2;Jane;Smith;7654321T;1985-05-15;456 High St;Cork;T12 AB34;2019-06-01;60000`;

      const employees = importEmployeesFromCSV(csvData, { delimiter: ';' });

      expect(employees).toHaveLength(1);
      expect(employees[0].firstName).toBe('Jane');
      expect(employees[0].salary).toBe(60000);
    });
  });

  describe('importEmployersFromCSV', () => {
    it('should import employers from CSV data', () => {
      const csvData = `id,name,tax_number,address_line1,city,postal_code
emp-1,Test Company Ltd,1234567A,456 Business Park,Cork,T12 AB34`;

      const employers = importEmployersFromCSV(csvData);

      expect(employers).toHaveLength(1);
      expect(employers[0]).toMatchObject({
        id: 'emp-1',
        name: 'Test Company Ltd',
        taxNumber: '1234567A',
      });
      expect(employers[0].address.city).toBe('Cork');
    });
  });

  describe('importContributionsFromCSV', () => {
    it('should import contributions from CSV data', () => {
      const csvData = `id,employee_id,employer_id,period_start,period_end,employee_amount,employer_amount
cont-1,123,emp-1,2024-01-01,2024-01-31,150,150`;

      const contributions = importContributionsFromCSV(csvData);

      expect(contributions).toHaveLength(1);
      expect(contributions[0]).toMatchObject({
        id: 'cont-1',
        employeeId: '123',
        employerId: 'emp-1',
        employeeAmount: 150,
        employerAmount: 150,
        totalAmount: 300,
      });
    });

    it('should calculate total amount correctly', () => {
      const csvData = `id,employee_id,employer_id,period_start,period_end,employee_amount,employer_amount
cont-2,456,emp-2,2024-02-01,2024-02-29,200,250`;

      const contributions = importContributionsFromCSV(csvData);

      expect(contributions[0].totalAmount).toBe(450);
    });
  });
});
