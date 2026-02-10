import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import { Readable } from 'node:stream';

export const runtime = 'nodejs'; // Required for Streams

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const previewResults: any[] = [];
    let rowCount = 0;
    const PREVIEW_LIMIT = 100;

    // 1. Convert the uploaded file into a Stream
    const stream = Readable.from(Buffer.from(await file.arrayBuffer()));

    // 2. Parse the CSV line-by-line
    const parser = stream.pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
      })
    );

    for await (const record of parser) {
      if (rowCount >= PREVIEW_LIMIT) {
        // 3. NUCLEAR OPTION: Kill the stream as soon as we have our 100 rows
        parser.destroy();
        break;
      }
      previewResults.push(record);
      rowCount++;
    }

    return NextResponse.json({
      success: true,
      preview: previewResults,
      info: {
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        // In production, you'd return an S3 URL or ID here for the full download
        fullFileId: "file_ref_10k_rows" 
      }
    });

  } catch (error: any) {
    console.error("Streaming Error:", error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}