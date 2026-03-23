# Smart Email Automation Dashboard

A full-stack email automation system that classifies incoming Gmail messages, performs automated Gmail actions using **n8n**, stores processed results in a backend API, and displays everything in a **React dashboard**.

---

## Overview

This project automates email handling through an end-to-end workflow:

- Detect new incoming emails using **Gmail Trigger** in **n8n**
- Extract and normalize email details
- Classify emails into:
  - **Work**
  - **Shopping**
  - **Newsletter**
  - **Other**
- Perform automated Gmail actions:
  - Apply labels
  - Mark work emails as important
  - Archive newsletters
- Send processed email data to a **Node.js + Express** backend
- Display categorized results in a **React dashboard**

---

## Screenshots

### Dashboard Preview
![Screenshot_23-3-2026_12506_localhost](https://github.com/user-attachments/assets/9784d6ef-8958-4766-8b87-a0dd9afa80ed)

### Workflow Editor
<img width="1917" height="1053" alt="2222" src="https://github.com/user-attachments/assets/757b5438-dc15-4324-95f7-67727f58fc64" />

### Newsletter Execution
<img width="1667" height="1036" alt="1111" src="https://github.com/user-attachments/assets/f40e2827-4476-418e-8daa-e9a4cbd033e6" />

### Work Execution
<img width="1670" height="1031" alt="444" src="https://github.com/user-attachments/assets/58a0ed52-65a0-4d27-826f-2f2b8a72844c" />

### Successful Workflow Execution
<img width="1666" height="997" alt="333" src="https://github.com/user-attachments/assets/dd71e75d-f833-4535-9705-4f9aeb570133" />

---

## Features

- Gmail email detection with **n8n**
- Rule-based smart categorization
- Automated Gmail label management
- Importance marking for work emails
- Newsletter archiving by removing the `INBOX` label
- Backend API to store processed email records
- Dashboard to monitor:
  - total processed emails
  - work emails
  - shopping emails
  - newsletters
  - other emails
  - important emails
  - archived emails
- Search and filter functionality
- JSON-based local persistence for easy setup

---

## Workflow Categories

### Work
Examples:
- project meeting
- work updates
- professional communication

Action:
- Apply **Work** label
- Add **IMPORTANT** label

### Shopping
Examples:
- orders
- shipment updates
- Daraz / Amazon emails
- purchase confirmations

Action:
- Apply **Shopping** label

### Newsletter
Examples:
- weekly newsletter
- daily brief
- daily digest
- news updates
- unsubscribe emails

Action:
- Apply **Newsletter** label
- Archive email by removing the **INBOX** label

### Other
Examples:
- general personal emails
- uncategorized emails

Action:
- Store in dashboard only

---

## Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express
- CORS
- dotenv

### Automation
- n8n
- Gmail Trigger
- Gmail nodes
- HTTP Request node

### Storage
- Local JSON file

---

## Project Structure

```text
smart-email-automation-app/
├── backend/
│   ├── data/
│   │   └── emails.json
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## How It Works

```text
Gmail Trigger
→ Edit Fields
→ Code in JavaScript
→ Switch
   ├─ Work → Apply Work Label → Mark Work Email Important → HTTP Request
   ├─ Shopping → Apply Shopping Label → HTTP Request
   ├─ Newsletter → Apply Newsletter Label → Archive Newsletter Email → HTTP Request
   └─ Other → HTTP Request
```

---

## Setup Instructions

## 1. Clone the Project

```bash
git clone https://github.com/your-username/smart-email-automation-app.git
cd smart-email-automation-app
```

---

## 2. Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
```

Create `.env` from `.env.example`.

### Windows
```bash
copy .env.example .env
```

### Mac/Linux
```bash
cp .env.example .env
```

Run backend:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

Test backend health:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{"success":true,"message":"Backend is running"}
```

---

## 3. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## 4. Gmail Labels Setup

Before running the workflow, create these labels manually in Gmail:

- Work
- Shopping
- Newsletter

These labels are used by the Gmail nodes in n8n.

---

## 5. n8n Setup

Run n8n locally and open:

```text
http://127.0.0.1:5678
```

Create a new workflow named:

```text
Smart Email Automation Workflow
```

---

## n8n Workflow Nodes

Create nodes in this order:

1. **Gmail Trigger**
2. **Edit Fields**
3. **Code in JavaScript**
4. **Switch**
5. **Apply Work Label**
6. **Mark Work Email Important**
7. **Apply Shopping Label**
8. **Apply Newsletter Label**
9. **Archive Newsletter Email**
10. **HTTP Request**

---

## Gmail Trigger Node

- Connect your Gmail account using Gmail OAuth2
- Trigger on new incoming emails

---

## Edit Fields Node

Create these fields:

- `gmailMessageId` → `{{ $json.id }}`
- `fromEmail` → `{{ $json.from?.value?.[0]?.address || 'Unknown Sender' }}`
- `subject` → `{{ $json.subject }}`
- `snippet` → `{{ $json.snippet }}`
- `receivedAt` → `{{ $now }}`

---

## Code in JavaScript Node

Use this code:

```javascript
const fromEmail = (($json.fromEmail || '').toLowerCase());
const subject = (($json.subject || '').toLowerCase());
const snippet = (($json.snippet || '').toLowerCase());

let category = 'Other';
let label = 'Other';
let actionTaken = 'Stored in dashboard';
let important = false;
let archived = false;

if (
  fromEmail.includes('linkedin') ||
  fromEmail.includes('company.com') ||
  subject.includes('meeting') ||
  subject.includes('project')
) {
  category = 'Work';
  label = 'Work';
  actionTaken = 'Applied Work label and marked as important';
  important = true;
} else if (
  fromEmail.includes('amazon') ||
  fromEmail.includes('daraz') ||
  subject.includes('daraz') ||
  subject.includes('amazon') ||
  subject.includes('order') ||
  subject.includes('shipped') ||
  subject.includes('delivery') ||
  subject.includes('shopping') ||
  subject.includes('thank you for choosing')
) {
  category = 'Shopping';
  label = 'Shopping';
  actionTaken = 'Applied Shopping label';
} else if (
  fromEmail.includes('newsletter') ||
  fromEmail.includes('noreply') ||
  subject.includes('newsletter') ||
  subject.includes('weekly update') ||
  subject.includes('daily brief') ||
  subject.includes('daily digest') ||
  subject.includes('morning brief') ||
  subject.includes('headline') ||
  subject.includes('news') ||
  snippet.includes('unsubscribe')
) {
  category = 'Newsletter';
  label = 'Newsletter';
  actionTaken = 'Applied Newsletter label and archived';
  archived = true;
}

return [
  {
    ...$json,
    category,
    label,
    actionTaken,
    important,
    archived,
  },
];
```

---

## Switch Node

Set rules based on the `category` field:

- Output 0 → `Work`
- Output 1 → `Shopping`
- Output 2 → `Newsletter`
- Output 3 → `Other`

---

## Gmail Action Nodes

### Apply Work Label
- Resource: `Message`
- Operation: `Add Label`
- Message ID: `{{ $node["Edit Fields"].json["gmailMessageId"] }}`
- Label: `Work`

### Mark Work Email Important
- Resource: `Message`
- Operation: `Add Label`
- Message ID: `{{ $json.id }}`
- Label: `IMPORTANT`

### Apply Shopping Label
- Resource: `Message`
- Operation: `Add Label`
- Message ID: `{{ $node["Edit Fields"].json["gmailMessageId"] }}`
- Label: `Shopping`

### Apply Newsletter Label
- Resource: `Message`
- Operation: `Add Label`
- Message ID: `{{ $node["Edit Fields"].json["gmailMessageId"] }}`
- Label: `Newsletter`

### Archive Newsletter Email
- Resource: `Message`
- Operation: `Remove Label`
- Message ID: `{{ $json.id }}`
- Label: `INBOX`

---

## HTTP Request Node

Use one HTTP Request node connected from all final branches.

### Method
```text
POST
```

### URL
```text
http://172.27.48.1:5000/api/emails
```

> If your local IP is different, replace `172.27.48.1` with your machine’s working IP address.

### Authentication
```text
None
```

### Send Body
```text
Enabled
```

### Body Content Type
```text
JSON
```

### Specify Body
```text
Using Fields Below
```

### Body Fields

- `gmailMessageId` → `{{$node["Edit Fields"].json["gmailMessageId"] || $json.id}}`
- `fromEmail` → `{{$node["Edit Fields"].json["fromEmail"] || "Unknown Sender"}}`
- `subject` → `{{$node["Edit Fields"].json["subject"] || ""}}`
- `snippet` → `{{$node["Edit Fields"].json["snippet"] || ""}}`
- `category` → `{{$node["Code in JavaScript"].json["category"] || "Other"}}`
- `label` → `{{$node["Code in JavaScript"].json["label"] || "Other"}}`
- `actionTaken` → `{{$node["Code in JavaScript"].json["actionTaken"] || "Processed by workflow"}}`
- `important` → `{{$node["Code in JavaScript"].json["important"] || false}}`
- `archived` → `{{$node["Code in JavaScript"].json["archived"] || false}}`
- `receivedAt` → `{{$node["Edit Fields"].json["receivedAt"] || $now}}`

---

## Local IP Note

If `localhost` or `127.0.0.1` does not work inside n8n, use your machine IP.

Example:

```text
http://172.27.48.1:5000/api/emails
```

You can find your IP using:

```bash
ipconfig
```

---

## API Endpoints

### Health Check
```http
GET /api/health
```

### Get All Emails
```http
GET /api/emails
```

### Get Stats
```http
GET /api/stats
```

### Save Processed Email
```http
POST /api/emails
```

### Delete Email
```http
DELETE /api/emails/:id
```

---

## Example Stored Email Record

```json
{
  "id": "1774248642615",
  "gmailMessageId": "19d197579adb2515",
  "fromEmail": "nimerbliss@gmail.com",
  "subject": "The Daily Brief: Aviation Incident in NYC, Japan’s COVID Milestone, and More",
  "snippet": "",
  "category": "Newsletter",
  "label": "Newsletter",
  "actionTaken": "Applied Newsletter label and archived",
  "important": false,
  "archived": true,
  "receivedAt": "2026-03-23T02:50:42.587-04:00",
  "processedAt": "2026-03-23T06:50:42.615Z"
}
```

---

## Test Emails

Use these subjects to test the workflow:

### Work
```text
Project meeting tomorrow
```

### Shopping
```text
Your order has shipped
```

```text
Thank You for Choosing Daraz
```

### Newsletter
```text
Weekly newsletter update
```

```text
The Daily Brief: Test Newsletter Update
```

### Other
```text
Hello how are you
```

---

## Dashboard Features

- Total processed emails
- Category counts
- Important count
- Archived count
- Search by sender, subject, or snippet
- Category filter buttons
- Real-time refresh support

---

## Example Results

From the current working project:

- `Project meeting tomorrow` → **Work**
- `Thank You for Choosing Daraz` → **Shopping**
- `The Daily Brief: Aviation Incident in NYC, Japan’s COVID Milestone, and More` → **Newsletter**
- general unmatched emails → **Other**

---

## Example Execution Flow

The workflow has already been tested successfully with:

- Work email execution
- Shopping email execution
- Newsletter email execution
- Dashboard save via HTTP Request
- Gmail label automation
- Newsletter archive automation

---

## Future Improvements

- AI-based classification instead of pure rule-based logic
- support for more categories
- analytics charts
- persistent database integration
- authentication
- multiple inbox support
- rule management UI

---

## License

This project is for educational and portfolio use.
