# Convenzioni di naming e stile

**Stato:** vincolanti per l'intero monorepo. Le violazioni vengono intercettate da ESLint/Prettier/commitlint dove automatizzabile; il resto è responsabilità della code review.

## 1. Package e workspace

| Elemento           | Convenzione                                              | Esempio                            |
| ------------------ | -------------------------------------------------------- | ---------------------------------- |
| Nome package       | `@emergent/<nome>` in kebab-case                         | `@emergent/agent-core`             |
| Directory package  | `packages/<nome>` uguale al suffisso del nome            | `packages/contracts`               |
| Directory app      | `apps/<nome>` in kebab-case, uguale al nome del servizio | `apps/agent-worker`                |
| Dipendenze interne | sempre `workspace:*`                                     | `"@emergent/utils": "workspace:*"` |

## 2. File e directory

- Tutti i file e le directory in **kebab-case**: `file-tree.ts`, `agent-run.service.ts`.
- I componenti React vivono in file kebab-case che esportano simboli PascalCase: `button.tsx` esporta `Button`.
- Test colocati accanto al sorgente con suffisso `.test.ts` / `.test.tsx`.
- Un modulo = una responsabilità: se un file supera ~300 righe o accumula export non correlati, va scomposto.

## 3. Simboli TypeScript

| Elemento                               | Convenzione                               | Esempio                             |
| -------------------------------------- | ----------------------------------------- | ----------------------------------- |
| Tipi, interfacce, classi, componenti   | PascalCase, nessun prefisso `I`           | `PaginatedResult`, `TimeoutError`   |
| Funzioni, variabili, proprietà         | camelCase                                 | `normalizePagination`               |
| Costanti module-level immutabili       | UPPER_SNAKE_CASE                          | `MAX_PAGE_SIZE`                     |
| Union di letterali al posto degli enum | `as const` + tipo derivato                | `WORKSPACE_ROLES` → `WorkspaceRole` |
| Generici                               | `T` semplice, altrimenti `T` + sostantivo | `TPayload`                          |

## 4. Moduli e import

- ESM ovunque (`"type": "module"`); gli import relativi portano **sempre l'estensione `.js`** (risoluzione NodeNext), anche nei file `.tsx`.
- Import di soli tipi con `import { type X }` (enforced da `verbatimModuleSyntax` + ESLint).
- Nessun package importa i sorgenti interni di un altro package: si passa sempre dall'entry point pubblico (`@emergent/<nome>`).
- Direzione delle dipendenze tra shared package: `config` ← non dipende da nulla; `contracts`, `utils`, `ui` non dipendono tra loro. Ogni nuova dipendenza incrociata richiede una decisione architetturale documentata.

## 5. Stile di formattazione (Prettier)

`printWidth 100`, `singleQuote`, `semi`, `trailingComma: all`, `tabWidth 2`, `arrowParens: always`, `endOfLine: lf`. La configurazione vive in `@emergent/config/prettier` ed è l'unica fonte di verità.

## 6. Commit e branch

- **Conventional Commits** enforced da commitlint: `tipo(scope): descrizione` con subject in minuscolo.
- Tipi ammessi: quelli di `@commitlint/config-conventional` (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `style`, `revert`).
- Scope ammessi (enum in `commitlint.config.mjs`): nomi dei package/app (`config`, `contracts`, `utils`, `ui`, `api`, `web`, …) più `repo`, `docs`, `ci`, `deps`, `release`. Lo scope è opzionale.
- Branch: `tipo/breve-descrizione-kebab` (es. `feat/agent-retry-policy`), oltre ai branch gestiti dalla piattaforma di delivery.

## 7. Naming di dominio

- Gli identificatori delle entità usano i **branded types** di `@emergent/contracts` (`UserId`, `ProjectId`, …): mai passare `string` nudi tra confini di modulo.
- Gli eventi di dominio (dalle fasi successive) seguiranno `<aggregato>.<evento>` in kebab-case: `file.created`, `agent-run.completed`.
- Le risorse REST usano sostantivi plurali kebab-case: `/workspaces/:id/agent-runs`.

## 8. Lingua

- Codice, identificatori, messaggi di errore e commenti: **inglese**.
- Documentazione architetturale e di prodotto in `docs/`: **italiano**.
- I commenti nel codice esistono solo dove spiegano un vincolo non ovvio; mai per parafrasare il codice.
