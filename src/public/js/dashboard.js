const metricTotal = document.getElementById('metricTotal');
const metricToday = document.getElementById('metricToday');
const metricLast = document.getElementById('metricLast');
const recentList = document.getElementById('recentList');

const buildChart = (labels, data) => {
  const ctx = document.getElementById('dailyChart');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Registros',
          data,
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.2)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const loadDashboard = async () => {
  const response = await fetch('/api/metrics');
  const data = await response.json();

  metricTotal.textContent = data.total;

  const today = new Date().toISOString().slice(0, 10);
  const todayRow = data.daily.find((row) => row.day === today);
  metricToday.textContent = todayRow ? todayRow.total : 0;

  if (data.recent.length) {
    metricLast.textContent = new Date(data.recent[0].created_at).toLocaleString();
  }

  recentList.innerHTML = '';
  data.recent.forEach((record) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `#${record.id} - ${new Date(record.created_at).toLocaleString()}`;
    recentList.appendChild(li);
  });

  const labels = data.daily.map((row) => row.day);
  const values = data.daily.map((row) => row.total);
  buildChart(labels, values);
};

loadDashboard();
