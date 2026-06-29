# Plošinový poradce 0.4.1

Webová aplikace připravená pro GitHub Pages.

## Změny ve verzi 0.4.1
- chytré hledání rozpozná dotaz na hmotnost modelu,
- umí vyhledat konkrétní hmotnost podle výrobního čísla, pokud je číslo uložené v poli `units`,
- bez výrobního čísla seskupí všechny evidované hmotnosti daného modelu,
- z uživatelského rozhraní byly odstraněny nepotřebné informační poznámky,
- odstraněny byly všechny dříve vytvořené technické souhrny PDF,
- aplikace zobrazí tlačítko dokumentu jen tehdy, když je připojen skutečný dokument výrobce.

## Data konkrétních strojů
Pro přesné hledání podle výrobního čísla doplňte ke stroji pole:

```js
"units": [
  { "serialNumber": "SKUTECNE_VYROBNI_CISLO", "weightKg": 2812 }
]
```

Do pole se nesmí vkládat odhadované nebo smyšlené údaje.

## Připojené originální dokumenty
V této pracovní verzi je ověřen a lokálně připojen pouze originální dokument Genie pro GS-3246 (Part No. 114423). Ostatní dříve vytvořené souhrny byly odstraněny a nesmí se vrátit. Další dokument se má připojit až po přiřazení ke správné výrobní řadě.
