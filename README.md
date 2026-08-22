# Teknomont Web

Starter now contains the application shell for the new Teknomont B2B website.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- next-intl (PL / EN)
- lucide-react
- react-hook-form + Zod (ready for sourcing forms)

## Start

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/pl`
- `http://localhost:3000/en`

## Routing

Internal route | Polish | English
--- | --- | ---
`/produkty` | `/pl/produkty` | `/en/products`
`/producenci` | `/pl/producenci` | `/en/manufacturers`
`/sourcing` | `/pl/sourcing` | `/en/sourcing`
`/oferta-b2b` | `/pl/oferta-b2b` | `/en/b2b`
`/o-firmie` | `/pl/o-firmie` | `/en/about`
`/kontakt` | `/pl/kontakt` | `/en/contact`

## Current structure

```text
src/
  app/[locale]/
  components/layout/
  components/ui/
  i18n/
  lib/
messages/
```

The header and mobile drawer are responsive from the start. The next development step is the production homepage hero and its supporting sections.
