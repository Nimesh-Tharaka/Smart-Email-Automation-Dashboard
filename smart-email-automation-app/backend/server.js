const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'emails.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

function readEmails() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    console.error('Failed to read emails.json:', error.message);
    return [];
  }
}

function writeEmails(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  if (typeof value === 'number') return value === 1;
  return false;
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.get('/api/emails', (req, res) => {
  const { category = 'All', search = '' } = req.query;
  let emails = readEmails();

  if (category !== 'All') {
    emails = emails.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search.trim()) {
    const keyword = search.toLowerCase();
    emails = emails.filter((item) => {
      return (
        item.subject.toLowerCase().includes(keyword) ||
        item.fromEmail.toLowerCase().includes(keyword) ||
        item.snippet.toLowerCase().includes(keyword)
      );
    });
  }

  emails.sort(
    (a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
  );

  res.json({ success: true, count: emails.length, data: emails });
});

app.get('/api/stats', (req, res) => {
  const emails = readEmails();

  const stats = {
    total: emails.length,
    work: 0,
    shopping: 0,
    newsletter: 0,
    other: 0,
    important: 0,
    archived: 0,
  };

  emails.forEach((item) => {
    const category = (item.category || 'Other').toLowerCase();

    if (category === 'work') stats.work += 1;
    else if (category === 'shopping') stats.shopping += 1;
    else if (category === 'newsletter') stats.newsletter += 1;
    else stats.other += 1;

    if (item.important) stats.important += 1;
    if (item.archived) stats.archived += 1;
  });

  res.json({ success: true, data: stats });
});

app.post('/api/emails', (req, res) => {
  const {
    gmailMessageId,
    fromEmail,
    subject,
    snippet,
    category,
    label,
    actionTaken,
    important,
    archived,
    receivedAt,
  } = req.body;

  if (!gmailMessageId || !subject || !category) {
    return res.status(400).json({
      success: false,
      message: 'gmailMessageId, subject, and category are required.',
    });
  }

  const emails = readEmails();
  const existingIndex = emails.findIndex(
    (item) => item.gmailMessageId === gmailMessageId
  );

  const emailRecord = {
    id:
      existingIndex >= 0
        ? emails[existingIndex].id
        : Date.now().toString(),
    gmailMessageId,
    fromEmail: fromEmail || 'Unknown Sender',
    subject,
    snippet: snippet || '',
    category,
    label: label || category,
    actionTaken: actionTaken || 'Processed by n8n',
    important: normalizeBoolean(important),
    archived: normalizeBoolean(archived),
    receivedAt: receivedAt || new Date().toISOString(),
    processedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    emails[existingIndex] = emailRecord;
  } else {
    emails.push(emailRecord);
  }

  writeEmails(emails);

  res.status(201).json({
    success: true,
    message: 'Email event stored successfully.',
    data: emailRecord,
  });
});

app.delete('/api/emails/:id', (req, res) => {
  const { id } = req.params;
  const emails = readEmails();
  const filtered = emails.filter((item) => item.id !== id);

  if (filtered.length === emails.length) {
    return res.status(404).json({ success: false, message: 'Email not found.' });
  }

  writeEmails(filtered);
  res.json({ success: true, message: 'Email removed successfully.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});