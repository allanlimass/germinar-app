# ⛪ GerminarApp

SaaS de gestão para igrejas com suporte a estrutura multi-filial (matriz e congregações), desenvolvido com Next.js e TypeScript.

## 📋 Sobre o projeto

O GerminarApp é uma plataforma de gestão eclesiástica que centraliza membros, famílias, grupos/ministérios e finanças de uma igreja e suas filiais em um único sistema, com controle de acesso baseado em papéis (RBAC) e arquitetura multi-tenant.

## 🚀 Tecnologias utilizadas

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **UI:** shadcn-ui
- **Backend:** Next.js (Server Actions) com Next Safe Action
- **Banco de dados:** PostgreSQL
- **ORM:** Drizzle ORM
- **Autenticação:** Better Auth
- **Validação de formulários:** Zod, React Hook Form

## ✨ Funcionalidades

- Arquitetura multi-tenant (banco compartilhado + `tenant_id` + RLS)
- Controle de acesso baseado em papéis (RBAC)
- Gestão de membros e famílias
- Gestão de grupos e ministérios
- Módulo financeiro completo:
  - Lançamentos de entradas e saídas
  - Conciliação bancária (importação OFX)
  - Estrutura matriz/filial com transferências financeiras entre unidades
  - Plano de contas
- Estrutura de billing e notificações

## 🔧 Como executar o projeto

```bash
# Clonar o repositório
git clone https://github.com/allanlimass/germinarapp.git
cd germinarapp

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Preencher com suas credenciais de banco de dados e demais serviços

# Rodar as migrações do banco de dados
npx drizzle-kit push

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## 👤 Autor

**Allan Silva**
- LinkedIn: [linkedin.com/in/allanlimass](https://linkedin.com/in/allanlimass)
- GitHub: [github.com/allanlimass](https://github.com/allanlimass)

## 📄 Licença

Este projeto está sob a licença MIT.
