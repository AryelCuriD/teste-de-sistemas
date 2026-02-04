const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const importForm = document.getElementById('importForm');
const importAlert = document.getElementById('importAlert');
const previewTable = document.getElementById('previewTable');
const modeSelect = document.getElementById('modeSelect');

const showAlert = (message, type) => {
  importAlert.className = `alert alert-${type}`;
  importAlert.textContent = message;
  importAlert.classList.remove('d-none');
};

const renderPreview = (records) => {
  const headers = records.length ? Object.keys(records[0]) : [];
  const thead = previewTable.querySelector('thead');
  const tbody = previewTable.querySelector('tbody');
  thead.innerHTML = '';
  tbody.innerHTML = '';

  if (!headers.length) {
    return;
  }

  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  records.slice(0, 10).forEach((record) => {
    const row = document.createElement('tr');
    headers.forEach((header) => {
      const td = document.createElement('td');
      td.textContent = record[header];
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
};

const handleFilePreview = (file) => {
  if (!file) {
    return;
  }
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'csv') {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        renderPreview(results.data);
      }
    });
  } else if (extension === 'json') {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (Array.isArray(data)) {
          renderPreview(data);
        }
      } catch (error) {
        showAlert('JSON inválido para pré-visualização.', 'warning');
      }
    };
    reader.readAsText(file);
  }
};

const handleFiles = (files) => {
  if (!files.length) {
    return;
  }
  fileInput.files = files;
  handleFilePreview(files[0]);
};

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
  handleFiles(event.target.files);
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  if (event.dataTransfer.files.length) {
    handleFiles(event.dataTransfer.files);
  }
});

importForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  importAlert.classList.add('d-none');

  if (!fileInput.files.length) {
    showAlert('Selecione um arquivo para importar.', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('mode', modeSelect.value);

  try {
    const response = await fetch('/api/import', {
      method: 'POST',
      body: formData
    });

    if (modeSelect.value === 'sql') {
      const sql = await response.text();
      if (!response.ok) {
        throw new Error(sql || 'Erro ao gerar SQL.');
      }
      const blob = new Blob([sql], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mock_data_import.sql';
      link.click();
      URL.revokeObjectURL(url);
      showAlert('SQL gerado com sucesso. O download foi iniciado.', 'success');
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao importar.');
    }

    showAlert(`${data.message} (${data.inserted} registros)`, 'success');
  } catch (error) {
    showAlert(error.message, 'danger');
  }
});
