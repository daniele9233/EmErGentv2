# @emergent/ui

Primitive condivise del design system EmErGent: componenti React completamente tipizzati, stilizzati con classi utility Tailwind.

## Componenti

`Button`, `Input`, `Textarea`, `Badge`, `Card` (con `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`), `Spinner`, più l'helper `cn` per la composizione di classi.

## Integrazione con Tailwind

Il package non dipende da Tailwind a runtime: le classi sono stringhe. L'app consumatrice deve includere i sorgenti del package nella scansione dei contenuti Tailwind (direttiva `@source` in Tailwind v4 o `content` in v3). I token di tema di piattaforma verranno introdotti in FASE 8 insieme al setup Tailwind dell'app web.

## Accessibilità

Ogni componente espone gli attributi ARIA corretti (`aria-invalid` per gli stati di errore, `role="status"` per lo spinner) e supporta `forwardRef` dove serve integrazione con form library o focus management.
