# n8n workflow steps

## Node order
1. Gmail Trigger — watches new emails
2. Set (Normalize Email) — shape your fields into a clean payload
3. Code (Categorize Email) — paste the code from `CategorizeEmailCode.js`
4. Switch — route by `category`
5. Gmail node — Apply Work label
6. Gmail node — Mark Work email as important
7. Gmail node — Apply Shopping label
8. Gmail node — Apply Newsletter label
9. Gmail node — Archive Newsletter email
10. HTTP Request — send event to backend dashboard

## HTTP Request node
- Method: POST
- URL: `http://localhost:5000/api/emails`
- Send Body: JSON
- Body:

```json
{
  "gmailMessageId": "={{ $json.gmailMessageId || $json.id }}",
  "fromEmail": "={{ $json.fromEmail || $json.from || 'Unknown Sender' }}",
  "subject": "={{ $json.subject }}",
  "snippet": "={{ $json.snippet || '' }}",
  "category": "={{ $json.category }}",
  "label": "={{ $json.label }}",
  "actionTaken": "={{ $json.actionTaken }}",
  "important": "={{ $json.important }}",
  "archived": "={{ $json.archived }}",
  "receivedAt": "={{ $json.receivedAt || $now }}"
}