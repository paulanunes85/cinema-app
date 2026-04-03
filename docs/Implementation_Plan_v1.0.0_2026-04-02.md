---
title: "Production Bible App — Implementation Plan"
description: "Complete phased implementation plan for the Production Bible App, a collaborative audiovisual pre-production platform"
author: "Sofia Silva"
date: "2026-04-02"
version: "1.0.0"
status: "planned"
spec_version: "1.0.0"
tags: ["implementation-plan", "react", "react-native", "nestjs", "prisma", "socket-io", "azure"]
---

# Production Bible App — Implementation Plan

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

> Plano completo de implementação para a plataforma colaborativa de gestão de pré-produção audiovisual. Monorepo com React 19 (web) + React Native/Expo (mobile) + NestJS (backend) + PostgreSQL/Prisma + Socket.IO, deploy em Azure.

## Change Log

| Version | Date       | Author      | Changes         |
|---------|------------|-------------|-----------------|
| 1.0.0   | 2026-04-02 | Sofia Silva | Initial plan    |

## Table of Contents

- [1. Decisões Técnicas](#1-decisões-técnicas)
- [2. Copilot Customization](#2-copilot-customization)
- [3. Estrutura do Projeto](#3-estrutura-do-projeto)
- [4. Fases de Implementação](#4-fases-de-implementação)
  - [FASE 0 — Scaffold & DevOps Foundation](#fase-0--scaffold--devops-foundation)
  - [FASE 1 — Data Model & Database Schema](#fase-1--data-model--database-schema)
  - [FASE 2 — Authentication & User Management](#fase-2--authentication--user-management)
  - [FASE 3 — Design System & UI Foundation](#fase-3--design-system--ui-foundation)
  - [FASE 4 — Projects & Department Spaces](#fase-4--projects--department-spaces)
  - [FASE 5 — Objectives Core](#fase-5--objectives-core-lifecycle-checklist-detail-view)
  - [FASE 6 — Comments & Collaboration](#fase-6--comments--collaboration)
  - [FASE 7 — Real-Time & Auto-Save](#fase-7--real-time--auto-save)
  - [FASE 8 — Templates & Supervision Mode](#fase-8--templates--supervision-mode)
  - [FASE 9 — Notifications & Mobile Polish](#fase-9--notifications--mobile-polish)
  - [FASE 10 — Testing, QA & Security](#fase-10--testing-qa--security)
  - [FASE 11 — Deploy Azure & Go-Live](#fase-11--deploy-azure--go-live)
- [5. Dependências entre Fases](#5-dependências-entre-fases)
- [6. Escopo Excluído](#6-escopo-excluído)
- [7. Riscos](#7-riscos)
- [8. Referências](#8-referências)

---

## 1. Decisões Técnicas

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Web Frontend | React 19 + Vite + TypeScript | Spec exige React; Vite é o bundler mais moderno e rápido |
| Mobile | React Native + Expo (managed) | Spec exige React Native; Expo simplifica deploy para App Store |
| Backend | NestJS + TypeScript | Framework estruturado com módulos, guards, pipes — ideal para app complexa |
| Database | PostgreSQL + Prisma ORM | Relacional type-safe com migrations automáticas e schema declarativo |
| Real-time | Socket.IO | Maduro, fallback automático, rooms built-in para presence e broadcast |
| Auth | Passport.js (Google OAuth2 + Apple ID) | Strategies prontas para ambos os providers exigidos pela spec |
| Monorepo | Turborepo | Orquestra builds entre web, mobile, server e packages compartilhados |
| Testes | Vitest + Playwright + React Testing Library | Cobertura completa: unit, integration, E2E |
| Hosting | Azure (App Service + Azure DB for PostgreSQL) | PaaS escalável com managed database |

---

## 2. Copilot Customization

Recursos do repositório [github/awesome-copilot](https://github.com/github/awesome-copilot) a serem instalados no projeto para acelerar o desenvolvimento com workflows agênticos.

### 2.1 Agents (`.github/agents/`)

| Agent | Uso no Projeto |
|-------|---------------|
| `expert-react-frontend-engineer.agent.md` | Desenvolvimento de componentes React 19 com hooks modernos, TypeScript, acessibilidade |
| `se-ux-ui-designer.agent.md` | Análise JTBD, user journey maps, artefatos UX |
| `implementation-plan.agent.md` | Gerar planos estruturados e executáveis por fase |
| `se-system-architecture-reviewer.agent.md` | Revisar decisões de arquitetura do monorepo |
| `se-product-manager-advisor.agent.md` | Validar prioridades de features e roadmap do MVP |
| `playwright-tester.agent.md` | Testes E2E automatizados |
| `prd.agent.md` | Refinamento da spec em user stories |

### 2.2 Skills (`.github/skills/`)

| Skill | Uso no Projeto |
|-------|---------------|
| `create-implementation-plan` | Criar planos de implementação faseados a partir da spec |
| `architecture-blueprint-generator` | Documentar arquitetura com diagramas C4/UML |
| `technology-stack-blueprint-generator` | Documentar stack técnica completa |
| `folder-structure-blueprint-generator` | Gerar blueprint de estrutura de pastas |
| `premium-frontend-ui` | UI polida com motion design e paleta pastel |
| `webapp-testing` | Testes de UI com Playwright |
| `breakdown-feature-prd` | Quebrar spec em features menores |
| `breakdown-feature-implementation` | Quebrar features em tarefas de implementação |
| `quality-playbook` | Playbook de qualidade (state machine, safeguards) |
| `gdpr-compliant` | Conformidade GDPR para dados de utilizadores |
| `context-map` | Mapear domínio (projetos, departamentos, objetivos) |

### 2.3 Instructions (`.github/instructions/`)

| Instruction | Apply To | Uso |
|-------------|----------|-----|
| `a11y.instructions.md` | `**/*.{tsx,jsx}` | Acessibilidade WCAG AA (FR-UI-05) |
| `security-and-owasp.instructions.md` | `**` | Segurança OWASP (SSO, auth, sanitização) |
| `performance-optimization.instructions.md` | `**` | Otimização de performance |
| `nestjs.instructions.md` | `server/**` | Best practices NestJS |
| `containerization-docker-best-practices.instructions.md` | `**/Dockerfile*` | Docker para deployment |
| `html-css-style-color-guide.instructions.md` | `**/*.{css,scss,tsx}` | Paleta pastel e guia visual |

### 2.4 Hooks (`.github/hooks/`)

| Hook | Uso |
|------|-----|
| `secrets-scanner` | Prevenir vazamento de API keys e secrets em commits |
| `governance-audit` | Auditoria de governança no ciclo de desenvolvimento |

---

## 3. Estrutura do Projeto

```
cinema-app/
├── .github/
│   ├── agents/                     # Copilot custom agents
│   ├── instructions/               # Copilot file instructions
│   ├── skills/                     # Copilot skills
│   ├── hooks/                      # Copilot lifecycle hooks
│   ├── prompts/                    # Copilot reusable prompts
│   └── workflows/                  # GitHub Actions CI/CD
├── apps/
│   ├── web/                        # React 19 + Vite + TypeScript
│   │   ├── src/
│   │   │   ├── components/         # Componentes específicos web
│   │   │   ├── pages/              # Páginas/rotas
│   │   │   ├── hooks/              # React hooks customizados
│   │   │   ├── stores/             # State management (Zustand)
│   │   │   └── lib/                # Utilitários web-specific
│   │   └── public/
│   └── mobile/                     # React Native + Expo
│       ├── app/                    # Expo Router (file-based routing)
│       ├── components/             # Componentes específicos mobile
│       └── hooks/                  # React hooks mobile-specific
├── packages/
│   ├── shared/                     # Tipos, constantes, utils compartilhados
│   │   └── src/
│   │       ├── types/              # Enums, DTOs, interfaces
│   │       ├── constants/          # Departamentos padrão, status, roles
│   │       └── utils/              # Funções utilitárias
│   ├── ui/                         # Design system (componentes pastel)
│   │   └── src/
│   │       ├── components/         # Button, Card, Badge, Avatar, etc.
│   │       ├── tokens/             # Design tokens (cores, tipografia)
│   │       └── styles/             # Tailwind config, global styles
│   └── api-client/                 # Cliente HTTP + WebSocket
│       └── src/
│           ├── http/               # Axios/fetch wrappers
│           └── socket/             # Socket.IO client hooks
├── server/                         # NestJS + TypeScript
│   ├── src/
│   │   ├── auth/                   # Google SSO + Apple ID + JWT
│   │   ├── users/                  # Perfil, onboarding, roles
│   │   ├── projects/               # CRUD projetos + convites
│   │   ├── departments/            # Espaços de departamento + progress
│   │   ├── objectives/             # Core unit: lifecycle, collaborators
│   │   ├── comments/               # Threaded comments, @mentions, reactions
│   │   ├── templates/              # Templates de objetivos
│   │   ├── decisions/              # Log de decisões
│   │   ├── links/                  # Links/documentos externos
│   │   ├── notifications/          # Push + in-app notifications
│   │   ├── realtime/               # Socket.IO Gateway
│   │   └── common/                 # Guards, pipes, decorators, filters
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── migrations/             # Migration files
│   │   └── seed.ts                 # Seed data
│   └── test/                       # E2E tests do backend
├── docs/
│   ├── ux/                         # Journey maps, JTBD, personas
│   └── architecture/               # Blueprints, ADRs, diagramas
├── plan/                           # Planos de implementação
├── docker-compose.yml              # PostgreSQL + Redis para dev
├── turbo.json                      # Turborepo config
├── package.json                    # Root package (workspaces)
├── .env.example                    # Template de variáveis de ambiente
├── copilot-instructions.md         # Copilot workspace instructions
└── Production_App_Specification_v1.0.0_2026-04-02.md
```

---

## 4. Fases de Implementação

### FASE 0 — Scaffold & DevOps Foundation

**Objetivo**: Estabelecer monorepo, tooling, CI/CD e Copilot customization.
**Depende de**: Nada (fase inicial)
**Requisitos cobertos**: Fundação técnica

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-001 | Inicializar monorepo com Turborepo | `npx create-turbo@latest cinema-app`, configurar workspaces em `apps/` e `packages/` |
| TASK-002 | Scaffold app web | `apps/web/` — React 19 + Vite + TypeScript, configurar path aliases |
| TASK-003 | Scaffold app mobile | `apps/mobile/` — Expo (managed workflow), TypeScript, Expo Router |
| TASK-004 | Scaffold backend | `server/` — NestJS + TypeScript, configurar módulos base |
| TASK-005 | Scaffold packages compartilhados | `packages/shared/` (tipos/constantes), `packages/ui/` (design system), `packages/api-client/` (HTTP client) |
| TASK-006 | Configurar PostgreSQL + Prisma | Schema inicial em `server/prisma/schema.prisma`, configurar migrations e seed |
| TASK-007 | Configurar Docker Compose | PostgreSQL + Redis (cache de sessions) para desenvolvimento local |
| TASK-008 | Configurar ESLint + Prettier | Configuração unificada no root do monorepo com regras TypeScript |
| TASK-009 | Configurar Vitest | Testes unitários para web + server, configurar workspaces |
| TASK-010 | Configurar Playwright | Testes E2E para app web |
| TASK-011 | Copilot customization | Copiar agents, skills, instructions e hooks do awesome-copilot para `.github/` |
| TASK-012 | Criar `copilot-instructions.md` | Instruções workspace-level: paleta de cores pastel, convenções de código, stack técnica |
| TASK-013 | Configurar Git + GitHub | Repositório, branch protection rules, PR template, issue templates |

**Critérios de Verificação**:
- `turbo dev` inicia web, mobile e server simultaneamente sem erros
- `turbo test` executa e passa em todos os workspaces
- Docker Compose levanta PostgreSQL e Redis
- Lint passa sem warnings

---

### FASE 1 — Data Model & Database Schema

**Objetivo**: Implementar schema completo do banco de dados com todas as entidades do domínio.
**Depende de**: FASE 0
**Requisitos cobertos**: FR-PM-01/02, FR-DS-01, FR-OB-01/02, FR-AU-03/04/05

#### Schema Prisma — Entidades Principais

```
User
  - id              String    @id @default(uuid())
  - email           String    @unique
  - displayName     String?
  - avatarUrl       String?
  - authProvider    AuthProvider (GOOGLE | APPLE)
  - isOnboarded     Boolean   @default(false)
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt

Project
  - id              String    @id @default(uuid())
  - name            String
  - description     String?
  - status          ProjectStatus (ACTIVE | ARCHIVED)
  - createdById     String    → User
  - createdAt       DateTime  @default(now())
  - archivedAt      DateTime?

ProjectMember
  - id              String    @id @default(uuid())
  - projectId       String    → Project
  - userId          String    → User
  - roles           Role[]    (DIRECTOR | AD | DEPARTMENT_HEAD | TEAM_MEMBER)
  - joinedAt        DateTime  @default(now())

MemberDepartment
  - memberId        String    → ProjectMember
  - departmentId    String    → Department
  @@id([memberId, departmentId])

Department
  - id              String    @id @default(uuid())
  - projectId       String    → Project
  - name            String
  - icon            String?
  - color           String?
  - isCustom        Boolean   @default(false)
  - order           Int       @default(0)

Objective
  - id              String    @id @default(uuid())
  - projectId       String    → Project
  - primaryDeptId   String    → Department
  - templateId      String?   → Template
  - title           String
  - description     String?
  - status          ObjectiveStatus (NOT_STARTED | IN_PROGRESS | COMPLETED)
  - deadline        DateTime?
  - phase           String?
  - sceneOrLocation String?
  - whatIsNormallyDone  String?
  - directorsVision    String?
  - createdById     String    → User
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt

ObjectiveDepartment
  - objectiveId     String    → Objective
  - departmentId    String    → Department
  @@id([objectiveId, departmentId])

ObjectiveCollaborator
  - id              String    @id @default(uuid())
  - objectiveId     String    → Objective
  - userId          String    → User
  - isActive        Boolean   @default(true)
  - joinedAt        DateTime  @default(now())

Decision
  - id              String    @id @default(uuid())
  - objectiveId     String    → Objective
  - content         String
  - createdById     String    → User
  - createdAt       DateTime  @default(now())

Link
  - id              String    @id @default(uuid())
  - objectiveId     String    → Objective
  - url             String
  - description     String?
  - authorName      String
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt

Comment
  - id              String    @id @default(uuid())
  - objectiveId     String    → Objective
  - parentId        String?   → Comment (self-relation for threads)
  - content         String
  - createdById     String    → User
  - createdAt       DateTime  @default(now())
  - updatedAt       DateTime  @updatedAt

CommentReaction
  - id              String    @id @default(uuid())
  - commentId       String    → Comment
  - userId          String    → User
  - emoji           String    (✅ | 👀 | 👍)
  @@unique([commentId, userId, emoji])

CommentMention
  - id              String    @id @default(uuid())
  - commentId       String    → Comment
  - mentionedUserId String    → User

Template
  - id              String    @id @default(uuid())
  - projectId       String?   → Project (null = system template)
  - name            String
  - objectiveType   String
  - content         String
  - checklist       Json?
  - isSystem        Boolean   @default(false)
  - createdAt       DateTime  @default(now())

Notification
  - id              String    @id @default(uuid())
  - userId          String    → User
  - type            NotificationType (MENTION | STATUS_CHANGE | COMMENT | INVITATION)
  - referenceId     String
  - referenceType   String
  - read            Boolean   @default(false)
  - createdAt       DateTime  @default(now())

ProjectInvite
  - id              String    @id @default(uuid())
  - projectId       String    → Project
  - token           String    @unique
  - email           String?
  - expiresAt       DateTime
  - usedAt          DateTime?
  - createdById     String    → User
```

#### Tasks

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-014 | Definir schema Prisma completo | Todas as entidades acima com relações, indexes compostos e constraints de unicidade |
| TASK-015 | Criar migration inicial | `npx prisma migrate dev --name init` — validar que schema cria todas as tabelas corretamente |
| TASK-016 | Criar seed data | Projeto exemplo "Curta-Metragem Demo" com 5 departamentos padrão (Cinematografia, Arte, Som, Figurino, Design de Produção), 10-15 templates de sistema, e objetivos de exemplo |
| TASK-017 | Definir tipos TypeScript compartilhados | Em `packages/shared/src/types/` — enums (ObjectiveStatus, Role, AuthProvider, NotificationType), DTOs de request/response, interfaces de domínio |
| TASK-018 | Validar schema com testes de integração | Testes para CRUD básico de cada entidade, validar cascading deletes e constraints |

**Critérios de Verificação**:
- `npx prisma migrate deploy` executa sem erros
- `npx prisma db seed` popula banco com dados de exemplo
- Tipos TypeScript compilam corretamente em todos os workspaces
- Testes de integração passam para todas as entidades

---

### FASE 2 — Authentication & User Management

**Objetivo**: Implementar SSO Google + Apple ID, perfil de utilizador, onboarding obrigatório, gestão de sessions com JWT.
**Depende de**: FASE 1
**Requisitos cobertos**: FR-AU-01 a FR-AU-07

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-019 | Configurar Passport.js + Google OAuth2 | Strategy `passport-google-oauth20`, scopes: `profile`, `email`. Configurar Google Cloud Console com redirect URIs |
| TASK-020 | Configurar Apple ID OAuth | Strategy `passport-apple`, configurar Apple Developer account, Sign in with Apple service ID |
| TASK-021 | Implementar JWT + Refresh Tokens | Access token (15min TTL) + refresh token (7d TTL) com rotação. Armazenar refresh tokens no banco com fingerprint do device |
| TASK-022 | API: `POST /auth/google/callback` | Endpoint de callback Google OAuth, criar User se não existe, retornar JWT pair |
| TASK-023 | API: `POST /auth/apple/callback` | Endpoint de callback Apple OAuth, criar User se não existe, retornar JWT pair |
| TASK-024 | API: `POST /auth/refresh` | Validar refresh token, gerar novo JWT pair, invalidar token anterior (rotação) |
| TASK-025 | API: `GET /auth/me` | Retornar perfil completo do utilizador autenticado incluindo roles e departments por projeto |
| TASK-026 | API: `PATCH /users/profile` | Atualizar displayName. Validar que campos obrigatórios permanecem preenchidos |
| TASK-027 | API: `POST /users/onboarding` | Fluxo first-login: receber displayName + roles (obrigatório) + departments (opcional). Marcar `isOnboarded = true` |
| TASK-028 | Guard de autenticação NestJS | `JwtAuthGuard` global aplicado a todas as rotas. Decorador `@Public()` para rotas de auth que não precisam de JWT |
| TASK-029 | Middleware de onboarding | Interceptor que verifica `isOnboarded` — se `false`, retorna 403 com redirect para onboarding (exceto rotas de auth e onboarding) |
| TASK-030 | UI: Tela de Login (web) | Botão "Sign in with Google" com estilo da paleta pastel, redirect OAuth, loading state, error handling |
| TASK-031 | UI: Tela de Login (mobile) | Botões "Sign in with Google" + "Sign in with Apple", usando `expo-auth-session` para OAuth flow nativo |
| TASK-032 | UI: Tela de Onboarding | Form multi-step: (1) displayName, (2) select roles com chips multi-select, (3) optional department selection. Validação client-side |
| TASK-033 | UI: Edição de Perfil | Tela/modal para atualizar displayName, visualizar roles e departments (roles/depts editáveis pelo admin do projeto) |

**Critérios de Verificação**:
- Login Google funcional no browser (web) e no simulador/dispositivo (mobile)
- Login Apple funcional no dispositivo iOS
- Onboarding bloqueia acesso a qualquer rota até conclusão
- Token refresh funciona silenciosamente sem logout do utilizador
- Testes: mock de OAuth providers + testes de guards e middleware

---

### FASE 3 — Design System & UI Foundation

**Objetivo**: Criar design system completo com paleta pastel da spec, componentes base reutilizáveis entre web e mobile, layouts principais.
**Depende de**: FASE 0 (pode ser feita em **paralelo** com FASE 1 e FASE 2)
**Requisitos cobertos**: FR-UI-04, FR-UI-05, FR-UI-06

#### Paleta de Cores (conforme Spec §15.2)

| Token CSS | Elemento | Cor | Hex |
|-----------|----------|-----|-----|
| `--bg-primary` | Background | White | `#FFFFFF` |
| `--bg-secondary` | Section background | Light gray | `#F7F7F9` |
| `--color-primary` | Primary actions | Soft blue | `#4A6CF7` |
| `--color-in-progress` | In Progress status | Pastel yellow | `#F2C94C` |
| `--color-completed` | Completed status | Soft green | `#6FCF97` |
| `--color-comments` | Comments / notes | Light lilac | `#BDB2FF` |
| `--text-primary` | Text (primary) | Dark gray | `#1F2937` |
| `--text-secondary` | Text (secondary) | Medium gray | `#6B7280` |

#### Tasks

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-034 | Design tokens CSS/TailwindCSS | Configurar Tailwind em `packages/ui/` com paleta pastel customizada, tokens de espaçamento (4/8/12/16/24/32/48px), tipografia (Inter ou Satoshi), border-radius (8/12/16px) |
| TASK-035 | Componentes base | `Button` (primary/secondary/ghost), `Input`, `Select`, `TextArea`, `Badge`, `Avatar`, `AvatarGroup`, `ProgressBar`, `Card`, `Modal`, `Tooltip`, `Skeleton` (loading) |
| TASK-036 | Status indicators acessíveis | Componente `StatusBadge` com ícone + texto + cor — **nunca** apenas cor como indicador (FR-UI-05). Ícones: ⏳ Not Started, 🔄 In Progress, ✅ Completed |
| TASK-037 | Layout principal web | `AppLayout` com: Sidebar colapsável (navegação departamentos + progress rings), Header (projeto selecionado + avatar + notificações), Content area com breadcrumbs |
| TASK-038 | Layout principal mobile | Bottom tabs (Home, Departments, Supervision?, Profile) + Header com título + Content area. Usando Expo Router tabs layout |
| TASK-039 | Componente `Checklist` | Lista scrollável de objetivos agrupados por status. Cada item mostra: StatusBadge, título, deadline, AvatarStack dos colaboradores, indicador cross-dept |
| TASK-040 | Componente `ObjectiveCard` | Card expandível com: título, StatusBadge, deadline badge, AvatarStack, department tags. Visual por estado: default (Not Started), highlight amarelo (In Progress), verde + opacity:0.7 (Completed) |
| TASK-041 | Componente `AvatarStack` | Exibir 1-5 avatares sobrepostos + badge "+N" se mais. Tooltip com nomes ao hover. Animação de entrada/saída quando colaborador join/leave |
| TASK-042 | Componente `ProgressRing` | Anel circular SVG com percentagem central. Cor: primary blue se < 100%, completed green se = 100%. Tamanhos: sm (32px), md (48px), lg (64px) |
| TASK-043 | Storybook ou Ladle | Documentar visualmente todos os componentes com variações de props, estados, e temas. Incluir stories de acessibilidade |

**Critérios de Verificação**:
- Todos os componentes renderizam corretamente em web e mobile
- Testes de acessibilidade (axe-core) passam sem violações Level AA
- Paleta de cores respeita contraste mínimo WCAG 4.5:1 para texto
- Storybook acessível em `http://localhost:6006`
- Componentes de status nunca dependem apenas de cor

---

### FASE 4 — Projects & Department Spaces

**Objetivo**: CRUD completo de projetos, gestão de departamentos (padrão + customizados), convites, navegação por departamento com progress tracking.
**Depende de**: FASE 2 + FASE 3
**Requisitos cobertos**: FR-PM-01 a FR-PM-05, FR-DS-01 a FR-DS-05

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-044 | API: CRUD Projects | `POST /projects` (criar), `GET /projects` (listar do utilizador), `GET /projects/:id` (detalhe), `PATCH /projects/:id` (editar), `DELETE /projects/:id` (soft delete/archive). Validar que só membros acedem |
| TASK-045 | API: Project Members | `POST /projects/:id/invite` (gerar link ou enviar email), `GET /projects/:id/members` (listar), `PATCH /projects/:id/members/:memberId` (alterar role), `DELETE /projects/:id/members/:memberId` (remover). Validar permissões de quem convida |
| TASK-046 | API: Departments | `GET /projects/:id/departments` (listar com progress), `POST /projects/:id/departments` (criar custom), `PATCH /departments/:id` (editar nome/ordem), `DELETE /departments/:id` (apenas custom). Proteger departamentos padrão contra delete |
| TASK-047 | Auto-criar departamentos padrão | Hook `afterCreate` no Project que cria automaticamente: Cinematografia, Arte, Som, Figurino, Design de Produção. Cada um com ícone e cor pré-definidos |
| TASK-048 | API: Department Progress | `GET /departments/:id/progress` — retornar `{ total: number, completed: number, percentage: number }`. Cálculo: `(completed / total) * 100` baseado em objetivos com status COMPLETED |
| TASK-049 | UI: Lista de Projetos | Grid/lista com ProjectCards (nome, descrição truncada, número de membros, progress geral). Botão "Novo Projeto". Tabs: Ativos / Arquivados (FR-PM-05) |
| TASK-050 | UI: Criar/Editar Projeto | Modal com form: nome (obrigatório), descrição (opcional), toggle para departamentos customizados adicionais |
| TASK-051 | UI: Convite por Link/Email | Modal de convite com: (1) gerar link copiável com expiração, (2) campo de email para convite direto. Preview do convite |
| TASK-052 | UI: Dashboard por Departamento | Layout principal pós-login: sidebar com lista de departamentos, cada um mostrando ProgressRing + nome. Ao clicar, content area mostra Checklist do departamento |
| TASK-053 | UI: Navegação entre departamentos | Sidebar com departamentos clicáveis, highlight visual do dept ativo. Toggle switch "Meu Departamento / Todos" para non-supervisory users (FR-UI-03). Transição suave entre departamentos |

**Critérios de Verificação**:
- Criar projeto → 5 departamentos padrão auto-criados com ícones e cores
- Convidar membro por link → membro aceita → vê projeto na lista
- Progress % calcula corretamente (0% se nenhum objetivo, N% com objetivos)
- Toggle "Meu / Todos" filtra corretamente os departamentos visíveis
- Testes E2E: fluxo completo de criar projeto → convidar → aceitar

---

### FASE 5 — Objectives Core (Lifecycle, Checklist, Detail View)

**Objetivo**: Implementar o core unit da aplicação — objetivos com lifecycle completo (Not Started → In Progress → Completed), detail view com 6 secções, cross-department sharing, collaborator presence.
**Depende de**: FASE 4
**Requisitos cobertos**: FR-OB-01 a FR-OB-14, FR-DS-02/03

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-054 | API: CRUD Objectives | `POST /departments/:id/objectives` (criar dentro de dept), `GET /departments/:id/objectives` (listar com filtros status/deadline), `GET /objectives/:id` (detalhe completo), `PATCH /objectives/:id` (editar), `DELETE /objectives/:id`. Incluir eager loading de collaborators, decisions, links |
| TASK-055 | API: Status transitions | `PATCH /objectives/:id/status` — validar transições permitidas: NOT_STARTED → IN_PROGRESS, IN_PROGRESS → COMPLETED, COMPLETED → IN_PROGRESS (reabrir). Ao mudar para IN_PROGRESS, auto-adicionar utilizador como collaborator ativo |
| TASK-056 | API: Collaborator management | `POST /objectives/:id/collaborators` (join — marcar isActive=true), `DELETE /objectives/:id/collaborators` (leave — marcar isActive=false). Retornar lista de collaborators ativos para display de avatares |
| TASK-057 | API: Cross-department sharing | `POST /objectives/:id/departments` — associar objetivo a departamentos adicionais (FR-OB-07). `DELETE /objectives/:id/departments/:deptId` para remover. Não permitir remover primary department |
| TASK-058 | API: Decisions log | `POST /objectives/:id/decisions` (criar decisão com content + auto-timestamp + auto-attribution), `GET /objectives/:id/decisions` (listar cronologicamente). Imutáveis após criação |
| TASK-059 | API: Links/Documents | `POST /objectives/:id/links` (adicionar url + description + authorName), `GET /objectives/:id/links` (listar), `PATCH /links/:id` (atualizar url/description, auto-update updatedAt), `DELETE /links/:id` |
| TASK-060 | API: Scene/Location | `PATCH /objectives/:id` com campo `sceneOrLocation` — texto livre para associar a cena ou locação (FR-OB-14) |
| TASK-061 | UI: Department Checklist | Lista completa de objetivos do departamento. Filtros dropdown: All / Not Started / In Progress / Completed. Ordenar por: deadline, status, criação. Cada item é um ObjectiveCard clicável |
| TASK-062 | UI: Objective Detail View | Tela/modal full com 6 secções em tabs ou scroll: (1) Overview (título, dept tags, deadline, scene/location), (2) "What Is Normally Done" (texto do template, read-only), (3) Director's Creative Vision (rich text editável por Director/AD), (4) Defined Decisions (timeline), (5) Documents & Links (lista), (6) Comments (threaded — implementado na FASE 6) |
| TASK-063 | UI: Status transition controls | Dropdown ou botões segmentados para mudar status. Ao selecionar "In Progress": avatar do utilizador aparece instantaneamente no ObjectiveCard (FR-OB-04). Se segundo utilizador também marca In Progress, ambos avatares aparecem (FR-OB-05) |
| TASK-064 | UI: Visual feedback por status | ObjectiveCard styles por estado: **Not Started** — fundo branco, borda sutil, sem avatares. **In Progress** — fundo `#FDF8E8` (pastel yellow tint), borda `#F2C94C`, avatares visíveis. **Completed** — fundo `#F0F9F4` (soft green tint), `opacity: 0.7`, borda `#6FCF97` (FR-OB-06) |
| TASK-065 | UI: Decisions section | Timeline vertical com cards: conteúdo da decisão, avatar + nome do autor, timestamp relativo ("há 2 dias"). Botão "Adicionar Decisão" com text area |
| TASK-066 | UI: Links section | Lista de cards com: favicon do URL, título/descrição, nome do autor, badge "Atualizado há X". Botão "Adicionar Link" com form: URL + descrição |
| TASK-067 | UI: Director's Vision section | Text area com rich text básico (bold, italic, listas). Links de referência visual inline. Editável apenas por Director/AD ou collaborator ativo |
| TASK-068 | UI: "What Is Normally Done" | Bloco informativo read-only com ícone 💡, texto do template associado. Estilo visual distinto (fundo lilac/lavender suave). Útil para júniors (FR-OB-08) |
| TASK-069 | UI: Combined checklist (multi-role) | Para utilizadores com múltiplos roles/departments: vista combinada com separadores por departamento, ou toggle para filtrar. Cada secção com seu ProgressRing (FR-UI-02) |

**Critérios de Verificação**:
- Criar objetivo → aparece na checklist do departamento correto
- Mudar para In Progress → avatar do utilizador aparece no card
- Completar → estilo visual muda (verde + transparência) + progress % do departamento sobe
- Sharing entre departamentos → objetivo aparece em ambos
- Detail view mostra todas as 6 secções com dados corretos
- Testes E2E: fluxo completo lifecycle de um objetivo

---

### FASE 6 — Comments & Collaboration

**Objetivo**: Sistema de comentários threaded dentro de cada objetivo, com @mentions para notificar membros da equipa e reações leves.
**Depende de**: FASE 5
**Requisitos cobertos**: FR-CC-01 a FR-CC-04

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-070 | API: Threaded comments | `POST /objectives/:id/comments` (criar, com `parentId` opcional para threads), `GET /objectives/:id/comments` (listar em árvore — root comments + children), `PATCH /comments/:id` (editar próprio), `DELETE /comments/:id` (soft delete próprio). Eager load author, reactions, mentions (FR-CC-01) |
| TASK-071 | API: @mentions parser | No `POST` e `PATCH` de comments, parsear regex `@(\w+)` no conteúdo. Para cada match: verificar se userId existe no projeto, criar `CommentMention`, disparar criação de `Notification` tipo MENTION (FR-CC-02) |
| TASK-072 | API: Reactions | `POST /comments/:id/reactions` (body: `{ emoji: "✅" | "👀" | "👍" }`), `DELETE /comments/:id/reactions/:emoji`. Constraint unique por [commentId, userId, emoji] — toggle behavior (FR-CC-03) |
| TASK-073 | UI: Comments section | Secção na Objective Detail View. Root comments em lista cronológica. Cada comment mostra: avatar + nome, timestamp relativo, conteúdo com @mentions highlightados em azul, reactions bar, botão "Responder" que abre thread. Threads indentadas visualmente |
| TASK-074 | UI: @mention autocomplete | No campo de input de comentário, ao digitar `@`: dropdown com membros do projeto (avatar + nome + role), filtrado por texto digitado. Ao selecionar, inserir `@displayName` formatado. Highlight visual no comentário renderizado |
| TASK-075 | UI: Reactions bar | Abaixo de cada comentário: emojis ✅ 👀 👍 como chips clicáveis. Mostrar contagem ao lado de cada emoji. Highlight se o utilizador atual já reagiu. Click toggle on/off |

**Critérios de Verificação**:
- Criar comentário com `@Sofia` → Sofia recebe notificação
- Responder a um comentário → thread hierárquica visível
- Reações toggle on/off corretamente, contagem atualiza
- Comentários são contextuais ao objetivo (FR-CC-04)
- Testes: parser de @mentions com edge cases (nome com espaço, utilizador inexistente)

---

### FASE 7 — Real-Time & Auto-Save

**Objetivo**: Implementar propagação em tempo real de todas as alterações (status, presence, comments, decisions) via Socket.IO, auto-save sem ação manual, e resolução básica de conflitos.
**Depende de**: FASE 5 + FASE 6
**Requisitos cobertos**: FR-RT-01 a FR-RT-04, FR-OB-13

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-076 | Configurar Socket.IO no NestJS | `@nestjs/platform-socket.io` — criar `RealtimeGateway`. Namespaces: `/project-{id}`. Rooms: `dept-{id}`, `objective-{id}`. Autenticação via JWT no handshake |
| TASK-077 | Evento: `objective:statusChanged` | Quando API muda status, broadcast para room `dept-{id}` e `project-{id}`. Payload: `{ objectiveId, newStatus, userId, timestamp }`. Todos os clientes conectados atualizam ObjectiveCard instantaneamente (FR-RT-02, FR-OB-13) |
| TASK-078 | Evento: `objective:collaboratorUpdate` | Quando utilizador join/leave objetivo, broadcast para room `objective-{id}`. Payload: `{ objectiveId, userId, action: 'joined' | 'left', activeCollaborators[] }`. Avatares atualizam em real-time (FR-RT-03) |
| TASK-079 | Evento: `comment:created` | Quando novo comentário criado via API, broadcast para room `objective-{id}`. Payload: comment completo com author. UI insere comment na lista sem refresh |
| TASK-080 | Evento: `decision:created` | Quando nova decisão criada via API, broadcast para room `objective-{id}`. UI insere decisão na timeline |
| TASK-081 | Auto-save debounced | Implementar hook `useAutoSave(value, saveFn, delay=2000)` em `packages/api-client/`. Ao editar campos de texto (Director's Vision, description), salvar automaticamente após 2 segundos de inatividade. Indicador visual: "Saving..." → "Saved ✓" (FR-RT-01) |
| TASK-082 | Conflict resolution | Estratégia **optimistic updates + last-write-wins**: (1) UI atualiza instantaneamente (optimistic), (2) server persiste e broadcast, (3) se outro cliente editou o mesmo campo, o último write ganha, (4) em caso de conflito detectado, mostrar toast "Atualizado por [nome]" (FR-RT-04) |
| TASK-083 | Online presence indicators | Ao conectar ao Socket.IO room de um projeto, broadcast evento `user:online`. Manter lista de utilizadores online no server (em memória ou Redis). Mostrar dot verde no avatar na sidebar para utilizadores online |
| TASK-084 | UI: Real-time indicators | Badge "LIVE" discreto quando conectado ao WebSocket. Animação suave (fade in/slide) quando ObjectiveCard muda de status por outro utilizador. Toast notification para eventos relevantes |
| TASK-085 | Client Socket.IO hook | `useSocket(projectId)` em `packages/api-client/src/socket/` — gerencia conexão, reconexão, subscrição de eventos. Retorna: `{ isConnected, onlineUsers, subscribe(event, handler), emit(event, data) }`. Compartilhado entre web e mobile |

**Critérios de Verificação**:
- Dois browsers abertos no mesmo projeto: mudar status num → ObjectiveCard atualiza no outro em < 500ms
- Presence indicators: avatar com dot verde aparece quando utilizador entra na room
- Auto-save: editar Director's Vision → "Saving..." após parar de digitar → "Saved ✓"
- Comentário criado por utilizador A aparece instantaneamente para utilizador B
- Reconexão automática após perda de rede
- Testes: mock de Socket.IO + testes de hooks

---

### FASE 8 — Templates & Supervision Mode

**Objetivo**: Templates predefinidos e editáveis para tipos de objetivos + modo de supervisão exclusivo para Director e AD com vista panorâmica de todos os departamentos.
**Depende de**: FASE 5 (pode ser feita em **paralelo** com FASE 6 e FASE 7)
**Requisitos cobertos**: FR-TP-01 a FR-TP-04, FR-SM-01 a FR-SM-05

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-086 | Templates de sistema (seed) | Criar 10-15 templates padrão como seed data: Mapa de Iluminação, Moodboard Visual, Pesquisa Sonora, Conceito de Figurino, Planta de Cenário, Storyboard, Shot List, Calendário de Locações, Research de Referências, Paleta de Cores, Prop List, Breakdown de Cena, Plano de Continuidade, etc. Cada um com: `content` (descrição do que é normalmente feito), `checklist` (JSON com subtarefas internas) |
| TASK-087 | API: CRUD Templates | `GET /templates` (listar system + project-specific), `POST /projects/:id/templates` (criar custom para projeto), `PATCH /templates/:id` (editar — só Director/AD, e apenas templates do projeto, não system), `DELETE /templates/:id` (apenas custom). Guard de role para edição (FR-TP-03) |
| TASK-088 | API: Auto-associate template | No `POST /objectives`, se `templateId` não fornecido, sugerir template baseado em keywords do título (matching simples). Se fornecido, popular campos `whatIsNormallyDone` e checklist do template (FR-TP-04) |
| TASK-089 | UI: Template editor | Tela acessível via Settings do projeto (só Director/AD). Lista de templates com search. Form de edição: nome, tipo, conteúdo rich text, checklist builder (adicionar/remover/reordenar subtarefas). Preview do template |
| TASK-090 | UI: Template selection ao criar objetivo | No form de criação de objetivo: dropdown "Tipo de Objetivo" que lista templates disponíveis. Ao selecionar, preenche preview do "What Is Normally Done" e checklist interna. Option "Sem template" disponível |
| TASK-091 | API: Supervision endpoints | `GET /projects/:id/supervision` — retornar: `{ departments: [{ id, name, progress: { total, completed, percentage }, recentObjectives: Objective[] }], overallProgress: number }`. Endpoint dedicado otimizado para a dashboard panorâmica (FR-SM-02) |
| TASK-092 | Guard: Supervision access | Decorador `@Roles(Role.DIRECTOR, Role.AD)` + `RolesGuard` que verifica roles do `ProjectMember` no contexto do projeto. Aplicar em rotas de supervision (FR-SM-01) |
| TASK-093 | Guard: Document access para Supervisors | Na rota de objective detail, se utilizador é Director/AD e **não** é collaborator ativo: permitir ver tudo, mas bloquear edição de campos de conteúdo (decisions, Director's Vision) se status ≠ COMPLETED. Permitir sempre comentar (FR-SM-04, FR-SM-05) |
| TASK-094 | UI: Supervision Dashboard | Vista panorâmica acessível via tab/botão "Supervisão" (só visível para Director/AD). Layout: grid de DepartmentCards, cada um com: nome, ProgressRing grande, lista dos 3 últimos objetivos completados, botão "Ver Tudo". Barra de progress geral do projeto no topo |
| TASK-095 | UI: Supervision filters | Na Supervision Dashboard: filtros por status (Not Started / In Progress / Completed), por departamento (multi-select), por range de deadline, busca por texto em títulos de objetivos. Resultados atualizados em real-time |

**Critérios de Verificação**:
- Director vê Supervision Dashboard com todos os departamentos e progress % correto
- Director tenta editar Director's Vision de objetivo In Progress sem ser collaborator → bloqueado
- Director pode comentar em qualquer objetivo independente do status
- Criar objetivo com template → campos "What Is Normally Done" e checklist auto-populados
- Director/AD edita template → template atualizado para novos objetivos (existentes não mudam)
- Testes: guards de roles, auto-population de templates

---

### FASE 9 — Notifications & Mobile Polish

**Objetivo**: Sistema de notificações push (mobile) e in-app (web), polimento da experiência mobile, garantia de consistência cross-platform.
**Depende de**: FASE 7 + FASE 8
**Requisitos cobertos**: FR-UI-06, FR-UI-07

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-096 | API: Notification system | `GET /notifications` (listar do utilizador, paginado, filtro read/unread), `PATCH /notifications/:id/read` (marcar como lida), `PATCH /notifications/read-all` (marcar todas). Tipos: MENTION, STATUS_CHANGE, COMMENT, INVITATION. Criar notification automaticamente nos handlers de @mention, status change, e convite |
| TASK-097 | Push notifications (mobile) | Configurar `expo-notifications`: (1) request permission no onboarding, (2) registrar push token no server, (3) enviar push via Expo Push API quando notificação criada. Título e body contextuais: "@Sofia mencionou você no Mapa de Luz", "Moodboard da Cena 3 marcado como Concluído" (FR-UI-07) |
| TASK-098 | In-app notifications (web) | Ícone de sino no Header com badge de contagem (unread count). Dropdown/panel com lista de notificações: ícone por tipo, texto descritivo, timestamp relativo, indicador read/unread. Click navega para o objetivo relevante |
| TASK-099 | Mobile: Polir navegação | Expo Router: (1) tab bar com ícones e labels, (2) transições de página com animações nativas, (3) pull-to-refresh em listas, (4) haptic feedback em status changes, (5) swipe gestures para navegação entre departamentos |
| TASK-100 | Mobile: Offline-first basics | (1) Cache local de checklists com MMKV ou AsyncStorage, (2) Queue de ações offline (status change, comment) que sincroniza quando reconecta, (3) Indicador visual "Offline — modo leitura" |
| TASK-101 | Mobile: Adapter de componentes UI | Garantir que componentes de `packages/ui/` funcionam em React Native. Para componentes web-only (ex: Tailwind), criar versões RN equivalentes com StyleSheet. Manter API de props idêntica |
| TASK-102 | Cross-platform consistency audit | Checklist visual comparando web vs mobile para: (1) paleta de cores, (2) tipografia, (3) espaçamento, (4) comportamento de componentes, (5) animações. Corrigir inconsistências encontradas (FR-UI-06) |

**Critérios de Verificação**:
- Push notification chega ao dispositivo quando alguém @menciona o utilizador
- In-app notification no web mostra badge de contagem correto
- Click na notificação navega para o objetivo correto
- Experiência visual idêntica entre web e mobile (audit documentado)
- Modo offline mostra dados cacheados e sincroniza ao reconectar

---

### FASE 10 — Testing, QA & Security

**Objetivo**: Garantir qualidade, segurança e acessibilidade do produto antes do deploy. Cobertura mínima de 80%, zero vulnerabilidades OWASP críticas, WCAG AA compliance.
**Depende de**: FASE 9
**Requisitos cobertos**: Qualidade transversal a todos os FRs

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-103 | Testes unitários backend | Vitest para todos os services, guards, pipes e interceptors do NestJS. Mínimo **80% coverage** nos modules core (auth, objectives, comments, realtime). Mock de Prisma Client para isolamento |
| TASK-104 | Testes unitários frontend | React Testing Library para componentes do design system (`packages/ui/`), hooks customizados (`useSocket`, `useAutoSave`), e componentes de página críticos (Checklist, ObjectiveDetailView) |
| TASK-105 | Testes E2E web | Playwright para fluxos críticos: (1) Login Google → Onboarding, (2) Criar projeto → Convidar membro, (3) Criar objetivo → Mudar status → Completar, (4) Comentar com @mention, (5) Supervision Dashboard view |
| TASK-106 | Testes E2E mobile | Detox ou EAS Build test: (1) Login → Onboarding flow, (2) Checklist navigation, (3) Status change + avatar presence, (4) Push notification handling |
| TASK-107 | Audit de acessibilidade | (1) axe-core automated scan em todas as páginas, (2) Manual testing: keyboard navigation completa sem mouse, (3) Screen reader testing (VoiceOver/NVDA) em fluxos críticos, (4) Verificar contrast ratios ≥ 4.5:1, (5) Validar que status nunca depende só de cor (FR-UI-05) |
| TASK-108 | Audit de segurança OWASP | (1) Auth: validar que tokens são httpOnly, secure, SameSite. (2) Input: sanitizar todo input de utilizador (comments, decisions, links — prevenir XSS). (3) Rate limiting em endpoints de auth e API pesadas. (4) CORS restrito a domínios permitidos. (5) Helmet.js para CSP, X-Frame-Options, etc. (6) Validar que links externos são sanitizados (prevenir javascript: URLs) |
| TASK-109 | Performance audit | (1) Lighthouse score ≥ 90 em todas as categorias, (2) Bundle size analysis com `vite-bundle-visualizer`, (3) Lazy loading de rotas e componentes pesados, (4) Otimizar queries Prisma com `select` e `include` específicos (evitar over-fetching) |
| TASK-110 | GDPR compliance | (1) Banner de consentimento de cookies, (2) Endpoint `GET /users/me/data-export` para download de dados pessoais, (3) Endpoint `DELETE /users/me` para exclusão de conta e dados, (4) Privacy policy page, (5) Termos de uso |
| TASK-111 | Load testing real-time | Simular **50+ conexões WebSocket** simultâneas com `artillery` ou `k6`. Métricas: latência de broadcast < 200ms, sem memory leaks no server após 1h de conexões ativas, verificar degradação graceful |

**Critérios de Verificação**:
- Coverage report: ≥ 80% nos modules core (auth, objectives, comments)
- Lighthouse: ≥ 90 em Performance, Accessibility, Best Practices, SEO
- axe-core: zero violações Level AA
- OWASP: zero vulnerabilidades críticas ou high
- Load test: broadcast latency < 200ms com 50 conexões
- GDPR: data export e delete account funcionam corretamente

---

### FASE 11 — Deploy Azure & Go-Live

**Objetivo**: Provisionar infraestrutura Azure, configurar CI/CD, deploy em staging para validação final, e go-live em production.
**Depende de**: FASE 10
**Requisitos cobertos**: Operacional

| Task | Descrição | Detalhes |
|------|-----------|---------|
| TASK-112 | Dockerfile multi-stage | Backend: stage 1 (build NestJS), stage 2 (runtime com Alpine, apenas production deps). Frontend: stage 1 (build Vite), stage 2 (serve com nginx). Otimizar layers para cache de Docker |
| TASK-113 | Azure DB for PostgreSQL | Provisionar instância Flexible Server, SKU Burstable B1ms para MVP. Configurar connection string como secret no Azure Key Vault. Habilitar backups automáticos |
| TASK-114 | Azure App Service (backend) | Deploy container NestJS. Configurar: environment variables via Application Settings, custom health check endpoint `/health`, auto-scaling rules (min 1, max 3 instances), Always On enabled |
| TASK-115 | Azure Static Web Apps (frontend) | Deploy do build React/Vite. Configurar: custom domain, fallback routing para SPA (`navigationFallback`), environment variables para API URL |
| TASK-116 | CI/CD GitHub Actions | Pipeline completo: `lint` → `test` (com coverage threshold) → `build` (Docker + Vite) → `deploy-staging` (on PR merge to `staging`) → `deploy-prod` (on tag/release). Secrets no GitHub para Azure credentials |
| TASK-117 | Expo EAS Build | Configurar `eas.json` com profiles: development, preview, production. Build iOS (requer Apple Developer account) + Android. Submissão para TestFlight e Google Play Internal Testing |
| TASK-118 | Monitoramento | Azure Application Insights para backend: request tracking, dependency tracking, exception logging. Frontend: error boundary global que reporta para App Insights via SDK JavaScript. Alertas para: error rate > 1%, response time > 2s |
| TASK-119 | Custom domain + SSL | Configurar domínio customizado no Azure Static Web Apps (frontend) e App Service (API). Certificado SSL managed pelo Azure. Redirect HTTP → HTTPS. HSTS header |
| TASK-120 | Smoke tests em staging | Executar subset de testes E2E Playwright contra ambiente de staging. Validar: (1) Login funciona, (2) Criar projeto funciona, (3) Real-time funciona, (4) Push notifications chegam. Só prosseguir para prod após todos passarem |

**Critérios de Verificação**:
- App web acessível via custom domain com HTTPS
- API responde no endpoint `/health` com status 200
- CI/CD pipeline verde end-to-end (lint → test → build → deploy)
- Mobile builds instaláveis via TestFlight (iOS) e Play Store Internal Testing (Android)
- Monitoring: dashboard de App Insights mostrando métricas reais
- Smoke tests em staging todos passam

---

## 5. Dependências entre Fases

```
FASE 0 ──┬──→ FASE 1 ──→ FASE 2 ──┬──→ FASE 4 ──→ FASE 5 ──┬──→ FASE 6 ──→ FASE 7 ──→ FASE 9 ──→ FASE 10 ──→ FASE 11
         │                         │                         │
         └──→ FASE 3 ──────────────┘                         └──→ FASE 8 ──────────────────┘
```

### Oportunidades de Paralelismo

| Fases em Paralelo | Condição |
|-------------------|----------|
| FASE 1 + FASE 3 | FASE 3 (Design System) não depende do banco de dados |
| FASE 2 + FASE 3 | FASE 3 pode avançar enquanto auth está sendo implementada |
| FASE 6 + FASE 8 | Comments e Templates/Supervision são independentes entre si |
| FASE 7 + FASE 8 | Real-time e Supervision são independentes entre si |

### Fases Bloqueantes

- **FASE 10** (Testing/QA) bloqueia FASE 11 (Deploy) — não deployar sem qualidade garantida
- **FASE 5** (Objectives Core) bloqueia FASE 6, 7 e 8 — é o core unit da aplicação

---

## 6. Escopo Excluído

Conforme definido na Spec §16 (Non-Goals for MVP):

- ❌ Orçamentação / contabilidade
- ❌ Gestão de casting
- ❌ Messaging fora do contexto de objetivos (chat geral)
- ❌ File hosting (apenas links para documentos externos)
- ❌ Video/image preview (links simples)
- ❌ Calendar/scheduling integration
- ❌ Export to PDF

---

## 7. Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|---------------|---------|-----------|
| RISK-001 | Socket.IO em scale pode necessitar de Redis Adapter para múltiplas instâncias do backend | Média | Alto | Implementar Redis Adapter desde o início na FASE 7. Adicionar ao Docker Compose |
| RISK-002 | Expo managed workflow pode limitar integrações nativas futuras (ex: deep linking avançado, background tasks) | Baixa | Médio | Avaliar necessidade de ejection para bare workflow se limitações surgirem. Para MVP, managed é suficiente |
| RISK-003 | Apple ID SSO requer Apple Developer account ativa ($99/ano) e configuração de Sign in with Apple service | Alta | Alto | Providenciar Apple Developer account antes de iniciar FASE 2. Bloqueia login mobile iOS |
| RISK-004 | Concurrent editing de campos de texto (Director's Vision, decisions) pode causar conflitos | Média | Médio | Last-write-wins + debounce 2s + toast notification "Atualizado por [nome]". Para MVP, não implementar CRDT/OT (complexidade desproporcional) |
| RISK-005 | Complexidade do monorepo com React + React Native pode causar problemas de build e tipos | Média | Médio | Configurar Turborepo cuidadosamente na FASE 0. Testar builds cross-workspace antes de avançar |

---

## 8. Referências

- **Spec**: [Production_App_Specification_v1.0.0_2026-04-02.md](./Production_App_Specification_v1.0.0_2026-04-02.md)
- **Awesome Copilot**: https://github.com/github/awesome-copilot
- **React 19 Docs**: https://react.dev
- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Expo Docs**: https://docs.expo.dev
- **Socket.IO Docs**: https://socket.io/docs
- **Turborepo Docs**: https://turbo.build/repo/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Azure App Service Docs**: https://learn.microsoft.com/en-us/azure/app-service/
- **Azure Static Web Apps Docs**: https://learn.microsoft.com/en-us/azure/static-web-apps/
- **Azure DB for PostgreSQL Docs**: https://learn.microsoft.com/en-us/azure/postgresql/
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Vitest Docs**: https://vitest.dev/guide/
