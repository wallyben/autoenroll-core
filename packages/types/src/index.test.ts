import { describe, it, expect } from 'vitest';
import type { Employee, Employer, Contribution } from './index';

describe('Types', () => {
  it('should allow valid Employee type', () => {
    const employee: Employee = {
      id: '123',
      employerId: 'emp-1',
      firstName: 'John',
      lastName: 'Doe',
      ppsNumber: '1234567T',
      dateOfBirth: '1990-01-01',
      address: {
        line1: '123 Main St',
        city: 'Dublin',
        postalCode: 'D01 A1B2',
        country: 'Ireland',
      },
      employmentStartDate: '2020-01-01',
      salary: 50000,
    };

    expect(employee.id).toBe('123');
    expect(employee.firstName).toBe('John');
  });

  it('should allow valid Employer type', () => {
    const employer: Employer = {
      id: 'emp-1',
      name: 'Test Company Ltd',
      taxNumber: '1234567A',
      address: {
        line1: '456 Business Park',
        city: 'Cork',
        postalCode: 'T12 AB34',
        country: 'Ireland',
      },
    };

    expect(employer.id).toBe('emp-1');
    expect(employer.name).toBe('Test Company Ltd');
  });

  it('should allow valid Contribution type', () => {
    const contribution: Contribution = {
      id: 'cont-1',
      employeeId: '123',
      employerId: 'emp-1',
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
      employeeAmount: 150,
      employerAmount: 150,
      totalAmount: 300,
    };

    expect(contribution.totalAmount).toBe(300);
  });
});
