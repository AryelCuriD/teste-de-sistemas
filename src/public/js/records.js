const tableBody = document.querySelector('#recordsTable tbody');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const limitSelect = document.getElementById('limitSelect');
const recordDetail = document.getElementById('recordDetail');

let currentPage = 1;

const fetchRecords = async () => {
  const query = searchInput.value.trim();
  const limit = limitSelect.value;
  const response = await fetch(`/api/records?page=${currentPage}&limit=${limit}&q=${encodeURIComponent(query)}`);
  const data = await response.json();
  renderTable(data.records);
  renderPagination(data.total, data.limit, data.page);
};

const renderTable = (records) => {
  tableBody.innerHTML = '';
  if (!records.length) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4" class="text-center text-muted">Nenhum registro encontrado.</td>';
    tableBody.appendChild(row);
    return;
  }

  records.forEach((record) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.id}</td>
      <td><pre class="mb-0">${JSON.stringify(record.data, null, 2)}</pre></td>
      <td>${new Date(record.created_at).toLocaleString()}</td>
      <td><button class="btn btn-sm btn-outline-primary" data-id="${record.id}">Ver detalhes</button></td>
    `;
    tableBody.appendChild(row);
  });

  tableBody.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => openDetail(button.dataset.id));
  });
};

const renderPagination = (total, limit, page) => {
  pagination.innerHTML = '';
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) {
    return;
  }

  for (let i = 1; i <= totalPages; i += 1) {
    const li = document.createElement('li');
    li.className = `page-item ${i === page ? 'active' : ''}`;
    const link = document.createElement('button');
    link.className = 'page-link';
    link.textContent = i;
    link.addEventListener('click', () => {
      currentPage = i;
      fetchRecords();
    });
    li.appendChild(link);
    pagination.appendChild(li);
  }
};

const openDetail = async (id) => {
  const response = await fetch(`/api/records/${id}`);
  const data = await response.json();
  recordDetail.textContent = JSON.stringify(data.data, null, 2);
  const modal = new bootstrap.Modal(document.getElementById('recordModal'));
  modal.show();
};

searchInput.addEventListener('input', () => {
  currentPage = 1;
  fetchRecords();
});

limitSelect.addEventListener('change', () => {
  currentPage = 1;
  fetchRecords();
});

fetchRecords();
