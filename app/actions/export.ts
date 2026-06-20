// app/actions/export.ts
'use server';

import { db } from '@/lib/db/drizzle';
import { processedData } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Parser } from '@json2csv/plainjs';
import * as XLSX from 'xlsx';

export async function getExportData(batchId: string, format: 'csv' | 'xlsx') {
  const records = await db
    .select()
    .from(processedData)
    .where(eq(processedData.batchId, batchId));

  const rawData = records.map(r => r.rowData as Record<string, any>);

  if (format === 'csv') {
    const parser = new Parser();
    return { data: parser.parse(rawData), type: 'text/csv' };
  } else {
    // Excel logic
    const worksheet = XLSX.utils.json_to_sheet(rawData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return { data: buffer.toString('base64'), type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
  }
}