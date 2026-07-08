# @emergent/contracts

Contratti condivisi della piattaforma: la fonte di verità dei tipi che attraversano i confini tra servizi.

- **Branded IDs** — identificatori nominali per ogni aggregato del dominio (`UserId`, `ProjectId`, …)
- **API envelope** — `ApiResponse<T>` (success/error) e paginazione normalizzata
- **Error codes** — codici errore piattaforma con type guard
- **RBAC** — ruoli workspace, risorse, azioni e matrice permessi (`hasPermission`)

Regola: questo package non dipende da nessun altro package del workspace e non contiene logica di dominio, solo contratti.
