# Mockaroo DB Tester

Ferramenta full-stack para importar dados do Mockaroo (CSV/JSON) no MySQL e visualizar registros com dashboard.

## Pré-requisitos
- Node.js 18+
- MySQL 8+

## Configuração do banco
1. Crie o banco no MySQL:
   ```sql
   CREATE DATABASE mockaroo_db;
   ```
2. Configure o arquivo `.env` (crie na raiz do projeto):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=mockaroo_db
   DB_PORT=3306
   PORT=3000
   ```

A tabela `mock_data` é criada automaticamente na primeira execução.

## Instalação
```bash
npm install
```

## Execução
```bash
npm run dev
```

ou

```bash
npm start
```

## Rotas principais
- `GET /` Página inicial
- `GET /import` Formulário de upload
- `POST /api/import` Importação de CSV/JSON
- `GET /records` Visualização de registros
- `GET /api/records` API com paginação e busca
- `GET /dashboard` Dashboard
- `GET /api/metrics` Métricas em JSON

## Observações
- Limite de upload: 5MB.
- JSON deve ser um array de objetos.
- No modo SQL (formulário de importação), o sistema gera um script com `CREATE TABLE` e `INSERT` para execução manual.
