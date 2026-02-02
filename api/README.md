# API - Azure Functions

Backend API for the vote counter using Google Sheets as database.

## Endpoints

- `GET /api/votes` - Get current vote count
- `POST /api/vote` - Increment vote count

## Setup Instructions

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Configure Environment Variables

Update `local.settings.json` with your credentials:

```json
{
  "Values": {
    "GOOGLE_SHEET_ID": "Your Google Sheet ID from the URL",
    "GOOGLE_SERVICE_ACCOUNT_EMAIL": "email from your service account JSON",
    "GOOGLE_PRIVATE_KEY": "private_key from your service account JSON"
  }
}
```

**How to get these values:**

1. **GOOGLE_SHEET_ID**: From your sheet URL
   - URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part

2. **GOOGLE_SERVICE_ACCOUNT_EMAIL** and **GOOGLE_PRIVATE_KEY**:
   - Open the service account JSON file you downloaded
   - Copy `client_email` value
   - Copy `private_key` value (keep the `\n` characters as-is)

### 3. Test Locally (Optional)

```bash
npm install -g azure-functions-core-tools@4
func start
```

The API will run at `http://localhost:7071`

## Deployment

Azure Static Web Apps automatically deploys functions in the `api` folder when you push to GitHub.
