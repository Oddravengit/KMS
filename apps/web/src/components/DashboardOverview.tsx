const metrics = [
  { label: "Orders today", value: "24", detail: "+12% from yesterday", tone: "violet" },
  { label: "In production", value: "18", detail: "6 due this week", tone: "blue" },
  { label: "Ready to dispatch", value: "11", detail: "3 awaiting QC", tone: "green" },
  { label: "Open balance", value: "$8,420", detail: "Demo account total", tone: "amber" },
];

const activity = [
  ["ORD-1048", "Northstar Studio", "Gangsheet print", "In production"],
  ["ORD-1047", "Raven & Co.", "DTF transfers", "Ready to dispatch"],
  ["ORD-1046", "Morrow Goods", "Sample pack", "Awaiting QC"],
];

export function DashboardOverview() {
  return (
    <div className="dashboard-overview">
      <div className="dashboard-heading-row">
        <div>
          <h2>Today at a glance</h2>
          <p>Demo workspace metrics for the approved frontend preview.</p>
        </div>
        <span className="demo-badge">DEMO DATA</span>
      </div>

      <section className="metric-grid" aria-label="Dashboard metrics">
        {metrics.map((metric) => (
          <article className={`metric-card metric-${metric.tone}`} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-panels" aria-label="Dashboard analytics">
        <article className="dashboard-panel order-trend-panel">
          <div className="panel-heading">
            <div><h2>Order volume</h2><p>Last seven days</p></div>
            <span className="panel-value">86 orders</span>
          </div>
          <div className="trend-chart" role="img" aria-label="Order volume trend rising from 8 to 18 orders">
            {[32, 44, 38, 56, 52, 69, 84].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </article>
        <article className="dashboard-panel status-panel">
          <div className="panel-heading"><div><h2>Production status</h2><p>Current workload</p></div></div>
          <div className="status-bars">
            <div><span>Queued</span><strong>8</strong><i className="bar violet" style={{ width: "42%" }} /></div>
            <div><span>Printing</span><strong>18</strong><i className="bar blue" style={{ width: "74%" }} /></div>
            <div><span>Finishing</span><strong>11</strong><i className="bar green" style={{ width: "55%" }} /></div>
          </div>
        </article>
      </section>

      <section className="dashboard-panel activity-panel" aria-labelledby="activity-title">
        <div className="panel-heading"><div><h2 id="activity-title">Recent order activity</h2><p>Sample records for layout review</p></div><button type="button" className="text-button">View all</button></div>
        <div className="activity-table" role="table" aria-label="Recent order activity">
          <div className="activity-row activity-header" role="row"><span>Order</span><span>Customer</span><span>Work type</span><span>Status</span></div>
          {activity.map(([order, customer, work, status]) => <div className="activity-row" role="row" key={order}><strong>{order}</strong><span>{customer}</span><span>{work}</span><span className="status-pill">{status}</span></div>)}
        </div>
      </section>
    </div>
  );
}
