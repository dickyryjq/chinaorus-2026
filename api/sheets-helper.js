const { google } = require('googleapis');

/**
 * Get authenticated Google Sheets client
 */
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  return sheets;
}

/**
 * Get current vote count from Google Sheet
 */
async function getVoteCount() {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2', // Cell A2 contains the vote count
  });

  const value = response.data.values?.[0]?.[0];
  return parseInt(value) || 1248; // Default to 1248 if not found
}

/**
 * Increment vote count in Google Sheet
 */
async function incrementVote() {
  const sheets = await getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Get current count
  const currentCount = await getVoteCount();
  const newCount = currentCount + 1;

  // Update both vote count and timestamp
  const timestamp = new Date().toISOString();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'A2:B2',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[newCount, timestamp]],
    },
  });

  return newCount;
}

module.exports = {
  getVoteCount,
  incrementVote,
};
