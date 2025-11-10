#!/usr/bin/env node

import { readFile } from 'fs/promises';
import {
  importEmployeesFromCSV,
  importEmployersFromCSV,
  importContributionsFromCSV,
} from '@autoenroll/csv-importer';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: csv-import <type> <file>');
    console.log('');
    console.log('Types:');
    console.log('  employees      Import employee data');
    console.log('  employers      Import employer data');
    console.log('  contributions  Import contribution data');
    console.log('');
    console.log('Example:');
    console.log('  csv-import employees data/employees.csv');
    process.exit(1);
  }

  const [type, filePath] = args;
  const delimiter = args.find((arg) => arg.startsWith('--delimiter='))?.split('=')[1] || ',';

  try {
    console.log(`Reading CSV file: ${filePath}`);
    const csvData = await readFile(filePath, 'utf-8');

    let results;
    switch (type) {
      case 'employees':
        results = importEmployeesFromCSV(csvData, { delimiter });
        console.log(`✅ Imported ${results.length} employees`);
        break;

      case 'employers':
        results = importEmployersFromCSV(csvData, { delimiter });
        console.log(`✅ Imported ${results.length} employers`);
        break;

      case 'contributions':
        results = importContributionsFromCSV(csvData, { delimiter });
        console.log(`✅ Imported ${results.length} contributions`);
        break;

      default:
        console.error(`❌ Unknown type: ${type}`);
        process.exit(1);
    }

    // Output JSON for further processing
    console.log('');
    console.log('Results (JSON):');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
