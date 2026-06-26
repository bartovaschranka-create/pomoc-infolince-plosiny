# Zeppelin – Plošinový poradce

Jednoduchá statická webová aplikace pro rychlý orientační výběr pracovní plošiny během hovoru se zákazníkem.

## Co umí

- kategorie Nůžková, Kloubová, Teleskopická, Vlečná a Anténní,
- filtrování podle vnitřního/venkovního provozu,
- minimální pracovní výšky a nosnosti,
- volitelně podle bočního dosahu, rozměrů, pohonu a povrchu,
- seřazení od nejmenší vhodné varianty,
- zobrazení nejbližších variant, pokud přesná shoda neexistuje,
- obrázek, rozměry stroje, rozměr koše, hmotnost, cenu a přímý odkaz na produkt Zeppelin CZ.

## Spuštění

Aplikace nemá externí závislosti.

### Nejjednodušší způsob

Otevřete `index.html` v prohlížeči.

### Lokální webový server

V kořenové složce projektu spusťte:

```bash
python -m http.server 8080
```

Potom otevřete:

```text
http://localhost:8080
```

## Nasazení na GitHub Pages

1. Založte nový samostatný repozitář.
2. Nahrajte celý obsah této složky do větve `main`.
3. V GitHubu otevřete `Settings → Pages`.
4. Vyberte `Deploy from a branch`, větev `main`, složku `/root`.
5. Uložte nastavení.

## Struktura projektu

- `index.html` – obrazovky aplikace,
- `styles.css` – vzhled a responzivita,
- `app.js` – filtrování, řazení a vykreslení výsledků,
- `data/machines.js` – lokální katalog,
- `assets/images/` – lokální obrázky a náhradní ilustrace,
- `scripts/check-sources.mjs` – kontrola dostupnosti produktových odkazů.

## Aktualizace katalogu

Katalog je uložen v `data/machines.js`. Každý stroj je samostatný objekt. Číselné údaje jsou uloženy jako čísla v metrech nebo kilogramech.

Po ruční změně upravte také:

- `version`,
- `updatedAt`.

Kontrolu produktových odkazů lze spustit v Node.js 18+:

```bash
node scripts/check-sources.mjs
```

## Omezení první verze

- Neověřuje aktuální dostupnost stroje na pobočce.
- Neprovádí rezervaci ani cenovou nabídku.
- Maximální počet osob není na použitých veřejných produktových stránkách vždy uveden, proto se nevymýšlí a zobrazuje se „Neuvedeno na webu“.
- Údaje a ceny je nutné před potvrzením zákazníkovi ověřit na odkazované produktové stránce.
- Některé stroje mají náhradní ilustraci, pokud se nepodařilo bezpečně uložit konkrétní produktovou fotografii.

## Další rozšíření

Datová a filtrovací část jsou oddělené od uživatelského rozhraní. Později lze přidat:

- firemní API dostupnosti strojů,
- pobočky a termíny vrácení,
- export doporučení do e-mailu,
- administraci katalogu,
- automatickou synchronizaci se schváleným firemním datovým zdrojem.
