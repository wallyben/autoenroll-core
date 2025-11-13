#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { generateNAERSAZip } from '@autoenroll/naersa-adapter';
import type { NAERSASubmission } from '@autoenroll/types';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: naersa-generate <input.json> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --output=<path>     Output ZIP file path (default: naersa-submission.zip)');
    console.log('  --no-validate       Skip validation');
    console.log('');
    console.log('Example:');
    console.log('  naersa-generate submission.json --output=output.zip');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputPath =
    args.find((arg) => arg.startsWith('--output='))?.split('=')[1] || 'naersa-submission.zip';
  const validate = !args.includes('--no-validate');

  try {
    console.log(`📖 Reading submission data from: ${inputFile}`);
    const jsonData = await readFile(inputFile, 'utf-8');
    const submission: NAERSASubmission = JSON.parse(jsonData);

    console.log(`🏢 Employer ID: ${submission.employerId}`);
    console.log(`📅 Period: ${submission.periodStart} to ${submission.periodEnd}`);
    console.log(`👥 Employees: ${submission.employees?.length || 0}`);
    console.log(`💰 Contributions: ${submission.contributions?.length || 0}`);
    console.log('');

    console.log(`📦 Generating NAERSA ZIP file...`);
    const result = await generateNAERSAZip(submission, {
      outputPath,
      validate,
    });

    console.log(`✅ Successfully generated: ${result}`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

main();
