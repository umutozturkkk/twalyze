import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// You must add these to your .env.local:
// GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_SHEET_ID

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, content, summary, sentiment, timestamp } = body;

  // Google Auth
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    undefined,
    (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1', // Change if your sheet/tab has a different name
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[username, content, summary, sentiment, timestamp]],
      },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
