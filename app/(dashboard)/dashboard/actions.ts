'use server';

import { db } from '@/lib/db/drizzle';
import { conversionHistory, feedback } from '@/lib/db/schema';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';

export async function logConversionAction(fileName: string, rowCount: number, format: string) {  const user = await getUser();
  if (!user) return;
// This "pokes" Next.js to refresh the History List immediately
  revalidatePath('/dashboard');
  const team = await getTeamForUser(user.id);
  if (!team) return;


  await db.insert(conversionHistory).values({
    teamId: team.id,
    fileName,
    rowCount,
    format,
  });
}
export async function submitFeedback(message: string, type: string) {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  await db.insert(feedback).values({
    userId: user.id,
    message,
    type,
  });
}
export async function processExcel(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  
  // 1. Read the workbook
  const workbook = XLSX.read(arrayBuffer);
  
  // 2. Get the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // 3. Convert to JSON (This matches your current CSV logic!)
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  return jsonData;
}