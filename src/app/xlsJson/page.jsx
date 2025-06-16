'use Client';
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { readFile, unlink } from 'fs/promises';
import * as XLSX from 'xlsx';
import path from 'path';

// Disable bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = formidable({ multiples: false, uploadDir: '/tmp', keepExtensions: true });

  const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files.file;

  // Read Excel file
  const buffer = await readFile(file.filepath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  // Format data
  const formatted = rawData.map(row => ({
    school_name: row['School Name'],
    program: row['Program Type'],
    course_name: row['Course Name'],
  })).filter(entry => entry.school_name && entry.program && entry.course_name);

  // Cleanup uploaded temp file
  await unlink(file.filepath);

  return NextResponse.json(formatted);
}
