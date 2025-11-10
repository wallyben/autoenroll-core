import { NextRequest, NextResponse } from 'next/server';
import { controlCsv, buildZip } from '@cc/worm';
import type { EmployeeRecord } from '@cc/importers-core';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { runId, employees } = body as {
      runId: string;
      employees: EmployeeRecord[];
    };

    if (!runId) {
      return NextResponse.json(
        { error: 'No runId provided' },
        { status: 400 }
      );
    }

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return NextResponse.json(
        { error: 'No employees data provided' },
        { status: 400 }
      );
    }

    // Build the ZIP file
    const zipPath = await buildZip(runId, employees);

    return NextResponse.json({
      success: true,
      zipPath,
      runId,
      recordCount: employees.length,
    });
  } catch (error) {
    console.error('Build ZIP error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
