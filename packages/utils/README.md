# @emergent/utils

Utility pure e framework-agnostiche condivise da tutti i servizi del monorepo.

- `invariant`, `assertNever` — asserzioni e exhaustiveness check
- `Result`, `ok/err`, `fromPromise`, `unwrap`, `toError` — gestione esplicita degli errori attesi
- `sleep`, `withTimeout`, `retry` — primitive async con abort, timeout e backoff esponenziale
- `slugify`, `truncate` — manipolazione stringhe
- `formatBytes`, `formatDurationMs` — formattazione human-readable
- `pick`, `omit`, `isPlainObject` — helper su oggetti

Regola: nessuna dipendenza runtime, nessun side effect, nessun accesso a I/O.
