# DevFlow

API REST para gerenciamento de projetos e tarefas com autenticação JWT.

## Stack

- Node.js + Express 5
- TypeScript
- Prisma ORM + PostgreSQL (Neon)
- Zod (validação)
- JWT + bcrypt (autenticação)

## Como rodar

### Pré-requisitos

- Node.js 18+
- Banco PostgreSQL (ou conta no [Neon](https://neon.tech))

### Instalação

```bash
cd backend
npm install
```

### Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT (use 64+ caracteres) |
| `PORT` | Porta do servidor (padrão: 3000) |
| `FRONTEND_URL` | URL do frontend para configuração do CORS |

### Banco de dados

```bash
npx prisma migrate deploy
```

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## Endpoints

### Auth

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Não | Registrar usuário |
| POST | `/auth/login` | Não | Login, retorna JWT |
| GET | `/auth/me` | Sim | Retorna usuário logado |

### Projetos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/projects` | Listar projetos do usuário |
| GET | `/projects/:id` | Buscar projeto por ID |
| POST | `/projects` | Criar projeto |
| PATCH | `/projects/:id` | Atualizar projeto |
| DELETE | `/projects/:id` | Deletar projeto |

### Tarefas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tasks/:projectId` | Listar tarefas de um projeto |
| POST | `/tasks` | Criar tarefa |
| PATCH | `/tasks/:id` | Atualizar status da tarefa |
| DELETE | `/tasks/:id` | Deletar tarefa |

Todas as rotas de projetos e tarefas exigem o header:

```
Authorization: Bearer <token>
```

## Modelos

```
User
  id, name, email, password, createdAt

Project
  id, title, description?, userId, createdAt

Task
  id, title, completed, projectId, createdAt
```
