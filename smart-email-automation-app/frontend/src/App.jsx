import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const filters = ['All', 'Work', 'Shopping', 'Newsletter', 'Other'];

function App() {
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    work: 0,
    shopping: 0,
    newsletter: 0,
    other: 0,
    important: 0,
    archived: 0,
  });
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statsCards = useMemo(() => {
    return [
      { title: 'Total Processed', value: stats.total },
      { title: 'Work', value: stats.work },
      { title: 'Shopping', value: stats.shopping },
      { title: 'Newsletter', value: stats.newsletter },
      { title: 'Other', value: stats.other },
      { title: 'Important', value: stats.important },
      { title: 'Archived', value: stats.archived },
    ];
  }, [stats]);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');

      const query = new URLSearchParams({
        category: categoryFilter,
        search,
      });

      const [emailsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE}/api/emails?${query.toString()}`),
        fetch(`${API_BASE}/api/stats`),
      ]);

      if (!emailsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to load dashboard data.');
      }

      const emailsJson = await emailsResponse.json();
      const statsJson = await statsResponse.json();

      setEmails(emailsJson.data || []);
      setStats(statsJson.data || {});
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [categoryFilter]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => clearInterval(timer);
  }, [categoryFilter, search]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    loadDashboard();
  }

  function formatDate(value) {
    return new Date(value).toLocaleString();
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero">
          <div>
            <p className="eyebrow">n8n + Gmail + React Dashboard</p>
            <h1>Smart Email Automation Dashboard</h1>
            <p className="subtitle">
              Monitor categorized emails processed by your n8n workflow.
            </p>
          </div>
          <button className="refresh-button" onClick={loadDashboard}>
            Refresh
          </button>
        </header>

        <section className="card-grid">
          {statsCards.map((card) => (
            <div className="stat-card" key={card.title}>
              <span>{card.title}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </section>

        <section className="panel controls-panel">
          <div className="filter-row">
            <div className="filter-buttons">
              {filters.map((item) => (
                <button
                  key={item}
                  className={item === categoryFilter ? 'active' : ''}
                  onClick={() => setCategoryFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <form className="search-box" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search subject, sender, snippet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-header">
            <h2>Recent Processed Emails</h2>
            <span>{emails.length} items</span>
          </div>

          {loading ? (
            <div className="empty-state">Loading dashboard...</div>
          ) : error ? (
            <div className="empty-state error">{error}</div>
          ) : emails.length === 0 ? (
            <div className="empty-state">No processed emails yet.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Action</th>
                    <th>Flags</th>
                    <th>Processed</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email.id}>
                      <td>
                        <div className="sender-cell">
                          <strong>{email.fromEmail}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="subject-cell">
                          <strong>{email.subject}</strong>
                          <p>{email.snippet || 'No snippet available.'}</p>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${email.category.toLowerCase()}`}>
                          {email.category}
                        </span>
                      </td>
                      <td>{email.actionTaken}</td>
                      <td>
                        <div className="flag-stack">
                          {email.important && <span className="mini-flag">Important</span>}
                          {email.archived && <span className="mini-flag">Archived</span>}
                        </div>
                      </td>
                      <td>{formatDate(email.processedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;