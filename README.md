# EmErGent v2

Piattaforma AI App Builder: creazione di applicazioni complete tramite prompt, iterazione via chat, IDE cloud, preview live e deploy gestito.

L'architettura completa è documentata in [`docs/architecture/FASE-0-analisi-piattaforma.md`](docs/architecture/FASE-0-analisi-piattaforma.md). Il progetto procede per fasi con approvazione esplicita; ogni fase ha il proprio documento in `docs/architecture/`.

## Prerequisiti

- Node.js `>= 22.12` (vedi `.nvmrc`)
- pnpm `>= 10` (versione bloccata dal campo `packageManager`)

## Setup

```bash
pnpm install
pnpm verify   # format check + lint + build + typecheck + test
```

## Script di root

| Script                              | Effetto                                            |
| ----------------------------------- | -------------------------------------------------- |
| `pnpm build`                        | Build di tutti i package via Turborepo (con cache) |
| `pnpm typecheck`                    | Type-check di tutti i package                      |
| `pnpm test`                         | Test di tutti i package (Vitest)                   |
| `pnpm lint` / `pnpm lint:fix`       | ESLint su tutto il repo (config centralizzata)     |
| `pnpm format` / `pnpm format:check` | Prettier su tutto il repo                          |
| `pnpm verify`                       | Pipeline completa di verifica locale               |

I commit sono protetti da hook Husky: `pre-commit` esegue lint-staged, `commit-msg` valida il messaggio con Conventional Commits (commitlint).

## Struttura del monorepo

```
├── apps/                  # Servizi deployabili (dalle fasi successive)
├── packages/
│   ├── config/            # @emergent/config — preset ESLint, Prettier, tsconfig
│   ├── contracts/         # @emergent/contracts — tipi condivisi (id, API, errori, RBAC)
│   ├── utils/             # @emergent/utils — utility pure condivise
│   └── ui/                # @emergent/ui — componenti React del design system
└── docs/architecture/     # Documenti architetturali e convenzioni
```

Le convenzioni di codice e naming sono definite in [`docs/architecture/naming-conventions.md`](docs/architecture/naming-conventions.md).
