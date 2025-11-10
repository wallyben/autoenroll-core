import { describe, it, expect } from 'vitest';
import { generateNAERSAZip } from './index';
import type { NAERSASubmission } from '@autoenroll/types';

describe('NAERSA Adapter', () => {
  const validSubmission: NAERSASubmission = {
    employerId: 'emp-1',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-31',
    employees: [
      {
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
      },
    ],
    contributions: [
      {
        id: 'cont-1',
        employeeId: '123',
        employerId: 'emp-1',
        periodStart: '2024-01-01',
        periodEnd: '2024-01-31',
        employeeAmount: 150,
        employerAmount: 150,
        totalAmount: 300,
      },
    ],
  };

  describe('generateNAERSAZip', () => {
    it('should generate a ZIP file with valid submission', async () => {
      const outputPath = '/tmp/test-naersa.zip';
      const result = await generateNAERSAZip(validSubmission, { outputPath });

      expect(result).toBe(outputPath);
    });

    it('should throw error for missing employer ID', async () => {
      const invalidSubmission = { ...validSubmission, employerId: '' };

      await expect(generateNAERSAZip(invalidSubmission)).rejects.toThrow('Employer ID is required');
    });

    it('should throw error for missing employees', async () => {
      const invalidSubmission = { ...validSubmission, employees: [] };

      await expect(generateNAERSAZip(invalidSubmission)).rejects.toThrow(
        'At least one employee is required'
      );
    });

    it('should throw error for missing contributions', async () => {
      const invalidSubmission = { ...validSubmission, contributions: [] };

      await expect(generateNAERSAZip(invalidSubmission)).rejects.toThrow(
        'At least one contribution is required'
      );
    });

    it('should skip validation when validate option is false', async () => {
      const invalidSubmission = { ...validSubmission, employerId: '' };
      const outputPath = '/tmp/test-naersa-no-validate.zip';

      // Should not throw error
      const result = await generateNAERSAZip(invalidSubmission, {
        outputPath,
        validate: false,
      });

      expect(result).toBe(outputPath);
    });
  });
});
