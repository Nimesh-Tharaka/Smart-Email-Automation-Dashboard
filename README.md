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

> Create a folder named `screenshots/` in your GitHub project and place your images there with these names:
>
> - `dashboard.jpeg`
> - `workflow-editor.png`
> - `execution-newsletter.png`
> - `execution-work.png`
> - `execution-success.png`

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
├── screenshots/
│   ├── dashboard.jpeg
│   ├── workflow-editor.png
│   ├── execution-newsletter.png
│   ├── execution-work.png
│   └── execution-success.png
└── README.md
