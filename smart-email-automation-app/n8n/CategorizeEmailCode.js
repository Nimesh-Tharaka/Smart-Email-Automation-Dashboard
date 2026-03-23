const fromEmail = (($json.fromEmail || $json.from || '').toLowerCase());
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
  subject.includes('project') ||
  subject.includes('invoice review')
) {
  category = 'Work';
  label = 'Work';
  actionTaken = 'Applied Work label and marked as important';
  important = true;
} else if (
  fromEmail.includes('amazon') ||
  fromEmail.includes('daraz') ||
  subject.includes('order') ||
  subject.includes('shipped') ||
  subject.includes('delivery') ||
  snippet.includes('tracking number')
) {
  category = 'Shopping';
  label = 'Shopping';
  actionTaken = 'Applied Shopping label';
} else if (
  fromEmail.includes('newsletter') ||
  fromEmail.includes('noreply') ||
  subject.includes('newsletter') ||
  subject.includes('weekly update') ||
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