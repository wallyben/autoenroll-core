import { NextRequest, NextResponse } from 'next/server';
import { mapBrightPay } from '@cc/importer-brightpay';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const source = formData.get('source') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!source) {
      return NextResponse.json(
        { error: 'No source specified' },
        { status: 400 }
      );
    }

    // Read file content
    const csvContent = await file.text();

    // Route to appropriate importer
    if (source === 'brightpay') {
      const result = mapBrightPay(csvContent, {
        validatePPSN: true,
        strictMode: false,
      });

      return NextResponse.json(result);
    } else if (source === 'sage') {
      // Sage importer not implemented yet
      return NextResponse.json(
        { error: 'Sage importer not yet implemented' },
        { status: 501 }
      );
    } else {
      return NextResponse.json(
        { error: `Unknown source: ${source}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
