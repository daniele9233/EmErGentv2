# FASE 1 — Core Architecture

**Deliverable:** monorepo operativo con tooling di qualità e shared packages.
**Riferimenti:** decisioni ADR-001 (TypeScript end-to-end) e struttura §8.4 del documento FASE 0.

---

## 1. Analisi

La FASE 1 costruisce le fondamenta su cui tutte le fasi successive poggiano: la meccanica del monorepo (installazione, build, cache), la rete di sicurezza sulla qualità (lint, format, commit hook) e i quattro package condivisi che definiscono il vocabolario comune della piattaforma. L'obiettivo non è produrre feature, ma rendere **impossibile** introdurre drift di configurazione, tipi duplicati o stili incoerenti quando i servizi applicativi arriveranno.

## 2. Architettura del monorepo

```
emergent/
├── apps/                        # vuota in FASE 1: i servizi arrivano dalle fasi 2+
├── packages/
│   ├── config/                  # preset ESLint / Prettier / tsconfig (nessuna build: i sorgenti sono la distribuzione)
│   ├── contracts/               # tipi condivisi: branded ids, API envelope, error codes, RBAC
│   ├── utils/                   # utility pure: assert, Result, retry/timeout, string, format, object
│   └── ui/                      # design system React: Button, Input, Textarea, Badge, Card, Spinner, cn
├── docs/architecture/           # documenti di fase + naming conventions
├── turbo.json                   # task graph: build / typecheck / test con cache
├── pnpm-workspace.yaml          # workspace apps/* + packages/*
├── eslint.config.mjs            # lint centralizzato a root (unica fonte di verità)
├── commitlint.config.mjs        # Conventional Commits + scope enum
└── .husky/                      # pre-commit (lint-staged) e commit-msg (commitlint)
```

**Pipeline Turborepo:** `build` (con output `dist/**` in cache), `typecheck` e `test` dipendono da `^build` così i package che in futuro consumeranno i `dist` dei propri dependency vengono costruiti nell'ordine corretto. Il lint resta un task di root (vedi ADR-013).

**Grafo delle dipendenze tra shared package:** `contracts`, `utils` e `ui` sono mutuamente indipendenti e dipendono solo da `config` (devDependency di tooling). Questa indipendenza è una scelta: il giorno in cui servisse un incrocio, la decisione va documentata, non subita.

## 3. Motivazioni (ADR)

### ADR-011 — ESM-only con risoluzione NodeNext

Tutti i package emettono **solo ESM** (`"type": "module"`, `module: NodeNext`), con estensione `.js` obbligatoria negli import relativi. Node è vincolato a `>= 22.12`, dove `require(esm)` è stabile: anche un eventuale consumatore CJS (es. tooling NestJS in FASE 2) può consumare i package senza dual build. Alternativa scartata: dual ESM+CJS via bundler — raddoppia gli artifact e introduce una toolchain di build aggiuntiva per un problema che la versione minima di Node già elimina.

### ADR-012 — Versioni della toolchain bloccate su compatibilità verificate

- **TypeScript `~5.9`** e non 6.0: la 6.x è appena uscita e l'ecosistema delle fasi successive (NestJS, Vite) non la supporta ancora ufficialmente; il tilde-range evita salti minor non testati.
- **ESLint `^9.39`** e non 10: `eslint-plugin-react` dichiara peer `eslint ^9.7` al massimo. Il resto della catena (typescript-eslint 8.63, eslint-config-prettier 10) supporta già la 9 pienamente.
- **React 19** come target dei tipi e dei test del design system, con peer dependency `^18.3 || ^19` per non vincolare prematuramente l'app web.
- La riproducibilità è garantita dal lockfile pnpm committato + `engine-strict`.

### ADR-013 — Lint centralizzato a root

Un solo `eslint.config.mjs` a root (che compone i preset di `@emergent/config`) invece di un config per package. Motivo: il valore del lint è l'uniformità; N config sono N occasioni di drift. Il type-aware linting usa il TypeScript Project Service, che aggancia automaticamente il `tsconfig.json` del package di ogni file. Costo accettato: niente cache Turborepo sul lint — irrilevante a questa scala, reversibile se i tempi cresceranno.

### ADR-014 — Design system senza dipendenza Tailwind in FASE 1

`@emergent/ui` stilizza con classi utility Tailwind ma **non dipende** da Tailwind: le classi sono stringhe, il CSS viene generato dall'app consumatrice che include i sorgenti del package nella scansione dei contenuti. Theming e token di piattaforma arrivano in FASE 8 col setup Tailwind reale dell'app web: definirli ora significherebbe progettare un tema senza il suo consumatore. I test dei componenti (testing-library + happy-dom) non richiedono CSS.

### ADR-015 — Contracts come package a runtime quasi nullo

`@emergent/contracts` contiene quasi solo tipi; le uniche eccezioni runtime sono la matrice RBAC con `hasPermission` (la matrice È il contratto di autorizzazione, e dev'essere condivisa da backend e frontend) e la normalizzazione della paginazione (il clamping dei limiti è parte del contratto API, non della sua implementazione).

## 4. Qualità enforced automaticamente

| Livello        | Strumento                                                                                                              | Cosa blocca                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Salvataggio/CI | Prettier (`format:check`)                                                                                              | Stile incoerente                                                              |
| Lint           | ESLint 9 flat, typescript-eslint `strictTypeChecked` + `stylisticTypeChecked`, react + rules-of-hooks su `packages/ui` | `any` non sicuri, promise non gestite, violazioni Rules of Hooks, `console.*` |
| Compilazione   | tsconfig `strict` + `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`                 | Classi intere di bug su undefined/index/import                                |
| Commit         | Husky: lint-staged (pre-commit) + commitlint (commit-msg)                                                              | Codice non lintato e messaggi fuori standard                                  |
| Test           | Vitest 4 (node per contracts/utils, happy-dom + testing-library per ui)                                                | Regressioni sulle utility e sui componenti                                    |

## 5. Checklist finale FASE 1

- [x] **Monorepo** — repository unico con workspace pnpm e task graph Turborepo
- [x] **Package Manager** — pnpm 10, `packageManager` pinned, `engine-strict`
- [x] **Workspace** — `pnpm-workspace.yaml` con `apps/*` e `packages/*`
- [x] **Turborepo** — `turbo.json` con task `build`/`typecheck`/`test`, cache su `dist/**`
- [x] **Struttura cartelle** — conforme al target §8.4 della FASE 0
- [x] **Naming Convention** — `docs/architecture/naming-conventions.md`, vincolante
- [x] **ESLint** — flat config type-checked centralizzata, preset condivisi in `@emergent/config`
- [x] **Prettier** — config condivisa `@emergent/config/prettier`
- [x] **Husky** — hook `pre-commit` (lint-staged) e `commit-msg` (commitlint)
- [x] **Commitlint** — Conventional Commits con scope enum del workspace
- [x] **TypeScript Config** — preset `base` e `react-library` condivisi, strict massimale
- [x] **Shared Packages** — `config`, `contracts`, `utils`, `ui`
- [x] **Shared Types** — `@emergent/contracts` (branded ids, API envelope, errori, RBAC) con test
- [x] **Shared Utils** — `@emergent/utils` (assert, Result, async, string, format, object) con test
- [x] **Shared UI** — `@emergent/ui` (7 componenti + `cn`) con test testing-library

**STOP.** La FASE 2 (Backend) inizierà esclusivamente al comando: **OK, PROCEDI**.
