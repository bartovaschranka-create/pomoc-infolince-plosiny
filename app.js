(() => {
  "use strict";

  const platformCategories = [
    { id: "scissor", label: "Nůžkové", image: "assets/images/category-scissor.webp", description: "Rovná plocha, sklad, hala" },
    { id: "articulated", label: "Kloubové", image: "assets/images/category-articulated.webp", description: "Přes překážku a do stran" },
    { id: "telescopic", label: "Teleskopické", image: "assets/images/category-telescopic.webp", description: "Velký boční dosah" },
    { id: "trailer", label: "Vlečné", image: "assets/images/category-trailer.webp", description: "Vlečné plošiny OMME" },
    { id: "mast", label: "Anténní", image: "assets/images/category-mast.webp", description: "Toucan a stožárové plošiny" }
  ];
  const workIntents = [
    { id: "lift-people", label: "Zvedat osoby / pracovat ve výšce", description: "Servis, montáže, sklad, hala nebo práce venku.", icon: "assets/images/work-lift.svg", group: "platforms" },
    { id: "dig", label: "Kopat nebo hloubit výkop", description: "Rýhy, základy, výkopové práce.", icon: "assets/images/work-dig.svg", group: "work-machines", category: "tracked-excavators", categories: ["tracked-excavators", "wheeled-excavators", "backhoe-loaders"] },
    { id: "load", label: "Nakládat materiál", description: "Lopata, nakládka, manipulace se sypkým materiálem.", icon: "assets/images/work-load.svg", group: "work-machines", category: "wheel-loaders", categories: ["wheel-loaders", "skid-steer-loaders", "telehandlers"] },
    { id: "lift-material", label: "Zvedat a přesouvat materiál", description: "Palety, břemena, práce s výškou zdvihu.", icon: "assets/images/work-load.svg", group: "work-machines", category: "telehandlers", categories: ["telehandlers", "wheel-loaders"] },
    { id: "haul-earth", label: "Vyvážet zeminu", description: "Převoz zeminy a materiálu v korbě.", icon: "assets/images/work-haul.svg", group: "work-machines", category: "wheeled-dumpers", categories: ["wheeled-dumpers", "tracked-dumpers", "motor-barrows"] },
    { id: "compact", label: "Hutnit zeminu nebo asfalt", description: "Válcování, hutnění podkladů a povrchů.", icon: "assets/images/work-compact.svg", group: "work-machines", category: "rollers", categories: ["rollers"] },
    { id: "power", label: "Napájet stavbu elektřinou", description: "Elektrocentrála, rozvaděč, 230 V / 400 V.", icon: "assets/images/work-power.svg", group: "energy", category: "generators", categories: ["generators", "distribution-boards", "light-towers", "load-banks"] },
    { id: "air", label: "Potřebuji stlačený vzduch", description: "Kompresor podle tlaku a výkonu.", icon: "assets/images/work-power.svg", group: "energy", category: "compressors", categories: ["compressors"] },
    { id: "pump-water", label: "Čerpat vodu", description: "Čistá voda, kalová voda, hadice a průtok.", icon: "assets/images/work-pump.svg", group: "pumps", category: "pumps", categories: ["pumps", "hoses", "pump-accessories"] },
    { id: "dry-cool-heat", label: "Vysoušet, chladit nebo topit", description: "Odvlhčovače, klimatizace, ohřívače, ventilátory.", icon: "assets/images/work-climate.svg", group: "climate", categories: ["dehumidifiers", "air-conditioning", "heaters", "fans"] },
    { id: "accessories", label: "Potřebuji příslušenství nebo adaptér", description: "Doplňky, adaptéry a ostatní zařízení.", icon: "assets/images/work-tools.svg", group: "other" }
  ];
  const assortmentGroups = [
    {
      id: "platforms",
      label: "Pracovní plošiny",
      icon: "assets/images/work-lift.svg",
      description: "Nůžkové, kloubové, teleskopické, anténní a vlečné plošiny.",
      categories: platformCategories,
      ready: true
    },
    {
      id: "work-machines",
      label: "Pracovní stroje",
      icon: "assets/images/work-dig.svg",
      description: "Zemní a manipulační technika podle katalogu půjčovny.",
      categories: [
        { id: "tracked-excavators", label: "Pásová rypadla a minirypadla", icon: "assets/images/work-dig.svg", description: "Výkopové práce", filters: ["Hmotnost stroje", "Hloubka výkopu"] },
        { id: "wheeled-excavators", label: "Kolová rypadla", icon: "assets/images/work-dig.svg", description: "Mobilní rypadla", filters: ["Hmotnost stroje", "Hloubka výkopu"] },
        { id: "excavator-attachments", label: "Příslušenství k rypadlům", icon: "assets/images/work-tools.svg", description: "Kladiva, drapáky, vrtací zařízení", filters: ["Typ nářadí", "Kompatibilita"] },
        { id: "wheel-loaders", label: "Kolové nakladače", icon: "assets/images/work-load.svg", description: "Nakládka a manipulace", filters: ["Hmotnost stroje do", "Objem lopaty / nakládací výška"] },
        { id: "backhoe-loaders", label: "Rypadlo-nakladače", icon: "assets/images/work-dig.svg", description: "Univerzální stroje", filters: ["Hmotnost stroje", "Hloubka výkopu"] },
        { id: "skid-steer-loaders", label: "Smykem řízené nakladače", icon: "assets/images/work-load.svg", description: "Kompaktní nakladače", filters: ["Hmotnost stroje do", "Nosnost / šířka stroje"] },
        { id: "skid-steer-attachments", label: "Příslušenství ke smykovým nakladačům", icon: "assets/images/work-tools.svg", description: "Nářadí k nakladačům", filters: ["Typ nářadí", "Kompatibilita"] },
        { id: "telehandlers", label: "Manipulátory", icon: "assets/images/work-load.svg", description: "Nosnost a výška zdvihu", filters: ["Nosnost / výška zdvihu", "Hmotnost stroje do"] },
        { id: "wheeled-dumpers", label: "Kolové dumpery a minidumpery", icon: "assets/images/work-haul.svg", description: "Kolové dempry, minidumpery AUSA, Bergmann a podobné", filters: ["Nosnost / objem korby", "Šířka / typ výsypu"] },
        { id: "tracked-dumpers", label: "Pásové dumpery", icon: "assets/images/work-haul.svg", description: "Pásové dumpery do horšího terénu", filters: ["Nosnost / objem korby", "Hmotnost stroje do"] },
        { id: "motor-barrows", label: "Motorová kolečka", icon: "assets/images/work-haul.svg", description: "Kompaktní pásové nebo kolové přepravníky", filters: ["Nosnost / objem korby", "Šířka / typ podvozku"] },
        { id: "rollers", label: "Válce", icon: "assets/images/work-compact.svg", description: "Hutnění zeminy a asfaltu", filters: ["Hmotnost stroje / pracovní šířka", "Zemina / asfalt"] },
        { id: "dozers", label: "Dozery", icon: "assets/images/work-compact.svg", description: "Planýrování a zemní práce", filters: ["Hmotnost stroje", "Typ podvozku"] }
      ]
    },
    {
      id: "energy",
      label: "Energie",
      icon: "assets/images/work-power.svg",
      description: "Elektrocentrály, kompresory, světelné věže a rozvaděče.",
      categories: [
        { id: "generators", label: "Elektrocentrály", icon: "assets/images/work-power.svg", description: "Mobilní zdroje energie", filters: ["Výkon (kVA)", "230 V / 400 V"] },
        { id: "compressors", label: "Kompresory", icon: "assets/images/work-power.svg", description: "Stlačený vzduch", filters: ["Tlak (bar)", "Výkon (m³/min)"] },
        { id: "light-towers", label: "Světelné věže", icon: "assets/images/work-light.svg", description: "Osvětlení stavby", filters: ["Diesel / elektrická", "Výška stožáru"] },
        { id: "load-banks", label: "Odporová zátěž", icon: "assets/images/work-distribution.svg", description: "Testování zdrojů", filters: ["Výkon", "Napětí"] },
        { id: "distribution-boards", label: "Rozvaděče", icon: "assets/images/work-distribution.svg", description: "Staveništní rozvody", filters: ["Proud (A)", "230 V / 400 V"] }
      ]
    },
    {
      id: "pumps",
      label: "Čerpací technika",
      icon: "assets/images/work-pump.svg",
      description: "Čerpadla, hadice a příslušenství.",
      categories: [
        { id: "pumps", label: "Čerpadla", icon: "assets/images/work-pump.svg", description: "Čistá i kalová voda", filters: ["Čistá / kalová voda", "Průtok"] },
        { id: "hoses", label: "Hadice", icon: "assets/images/work-hose.svg", description: "Hadice k čerpací technice", filters: ["Průměr", "Délka"] },
        { id: "pump-accessories", label: "Příslušenství", icon: "assets/images/work-tools.svg", description: "Doplňky k čerpání", filters: ["Typ příslušenství", "Průměr / kompatibilita"] }
      ]
    },
    {
      id: "climate",
      label: "Klimatizace a vysoušení",
      icon: "assets/images/work-climate.svg",
      description: "Odvlhčovače, klimatizace, ohřívače a ventilátory.",
      categories: [
        { id: "dehumidifiers", label: "Odvlhčovače", icon: "assets/images/work-climate.svg", description: "Vysoušení prostor", filters: ["Velikost prostoru", "Výkon odvlhčení"] },
        { id: "air-conditioning", label: "Klimatizace", icon: "assets/images/work-climate.svg", description: "Chlazení prostor", filters: ["Velikost prostoru", "Chladicí výkon"] },
        { id: "heaters", label: "Ohřívače", icon: "assets/images/work-climate.svg", description: "Dočasné vytápění", filters: ["Druh paliva", "Výkon"] },
        { id: "fans", label: "Ventilátory", icon: "assets/images/work-climate.svg", description: "Proudění vzduchu", filters: ["Průtok vzduchu", "Průměr ventilátoru"] }
      ]
    },
    {
      id: "other",
      label: "Ostatní technika",
      icon: "assets/images/work-tools.svg",
      description: "Příslušenství, adaptéry a ostatní zařízení.",
      categories: [
        { id: "accessories", label: "Příslušenství", icon: "assets/images/work-tools.svg", description: "Doplňková technika", filters: ["Typ příslušenství", "Kompatibilita"] },
        { id: "adapters", label: "Adaptéry", icon: "assets/images/work-tools.svg", description: "Adaptéry ke strojům", filters: ["Typ adaptéru", "Kompatibilní stroj"] },
        { id: "trailers", label: "Přívěsné vozíky", icon: "assets/images/work-haul.svg", description: "Přeprava techniky", filters: ["Užitná hmotnost", "Typ vozíku"] },
        { id: "containers", label: "Kontejnery", icon: "assets/images/work-tools.svg", description: "Skladovací a úložné kontejnery", filters: ["Rozměr", "Typ kontejneru"] },
        { id: "small-mechanization", label: "Malá mechanizace", icon: "assets/images/work-tools.svg", description: "Kladiva, pily, nivelace", filters: ["Typ nářadí", "Výkon"] },
        { id: "ground-protection", label: "Roznášecí desky", icon: "assets/images/work-tools.svg", description: "Ochrana povrchu", filters: ["Rozměr", "Zatížení"] },
        { id: "landscape", label: "Krajinářská technika", icon: "assets/images/work-tools.svg", description: "Frézy, štěpkovače a rýhovače", filters: ["Typ stroje", "Hmotnost"] },
        { id: "compaction", label: "Vibrační a hutnicí technika", icon: "assets/images/work-compact.svg", description: "Desky, pěchy, válce", filters: ["Typ hutnění", "Hmotnost"] },
        { id: "crushing-screening", label: "Drtičky, třídičky a dopravníky", icon: "assets/images/work-load.svg", description: "Zpracování materiálu", filters: ["Typ stroje", "Výkon"] },
        { id: "cleaning", label: "Tlakové čističe a vysavače", icon: "assets/images/work-tools.svg", description: "Čištění a údržba", filters: ["Tlak", "Ohřev vody"] },
        { id: "scaffolding", label: "Lešení", icon: "assets/images/work-lift.svg", description: "Pojízdné lešení", filters: ["Pracovní výška", "Rozměr"] },
        { id: "other-equipment", label: "Ostatní zařízení", icon: "assets/images/work-tools.svg", description: "Další vybavení půjčovny", filters: ["Druh zařízení", "Hlavní parametr"] }
      ]
    }
  ];

  let machines = [];
  let equipmentItems = [];
  let selectedGroup = "platforms";
  let selectedCategory = null;
  let selectedIntent = null;

  const el = id => document.getElementById(id);
  const num = id => {
    const value = Number(el(id).value);
    return el(id).value === "" || Number.isNaN(value) ? null : value;
  };
  const fmt = value => value == null
    ? "Neuvedeno"
    : new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(value);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[char]));
  const normalize = value => String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  function isMast(machine) {
    const text = `${machine.manufacturer || ""} ${machine.model || ""} ${machine.sourceCategory || ""}`.toLowerCase();
    return ["toucan", "mast", "star", "stožár", "vertik"].some(term => text.includes(term));
  }

  function inCategory(machine, categoryId) {
    if (categoryId === "mast") return machine.category === "mast" || (machine.category === "articulated" && isMast(machine));
    if (categoryId === "articulated") return machine.category === "articulated" && !isMast(machine);
    return machine.category === categoryId;
  }

  function imageUrl(machine) {
    if (!machine.image) return "";
    if (/^https?:/i.test(machine.image)) return machine.image;
    return new URL(machine.image, document.baseURI).href;
  }

  function activeGroup() {
    return assortmentGroups.find(group => group.id === selectedGroup) || assortmentGroups[0];
  }

  function activeCategories() {
    return activeGroup().categories || [];
  }

  function activeIntent() {
    return workIntents.find(intent => intent.id === selectedIntent) || null;
  }

  function visibleCategories() {
    const group = activeGroup();
    const intent = activeIntent();
    const categories = activeCategories();
    if (!intent || intent.group !== group.id || !Array.isArray(intent.categories)) return categories;
    const allowed = new Set(intent.categories);
    return categories.filter(category => allowed.has(category.id));
  }

  function isPlatformGroup() {
    return activeGroup().id === "platforms";
  }

  function groupEquipment(groupId = selectedGroup) {
    return equipmentItems.filter(item => item.group === groupId);
  }

  function equipmentCategory(item) {
    if (item.category !== "dumpers") return item.category;
    const text = normalize(`${item.title || ""} ${item.sourceCategory || ""} ${item.searchText || ""}`);
    if (/motorovekolecko|kolovekolecko|tufftruk|messersi|cf/.test(text)) return "motor-barrows";
    if (/minidamper|minidumper|ausa|bergmann/.test(text)) return "wheeled-dumpers";
    if (/pasovy|pasove|morooka|messersi|tufftruk|track/.test(text)) return "tracked-dumpers";
    return "wheeled-dumpers";
  }

  function categoryEquipment(categoryId, groupId = selectedGroup) {
    return groupEquipment(groupId).filter(item => equipmentCategory(item) === categoryId);
  }

  function imageTag(src, className, alt) {
    return `<img class="${className}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`;
  }

  function isAccessoryLike(item) {
    const text = normalize(`${item.title || ""} ${equipmentCategory(item) || ""}`);
    return /(attachment|prislusenstvi|adapter|kladivo|lopata|drapak|hak|winch|plosina|rotavator|mulcovac|vrtaci|desky)/.test(text);
  }

  function isAccessoryCategory(categoryId) {
    return [
      "excavator-attachments", "skid-steer-attachments", "adapters", "accessories",
      "ground-protection", "load-banks"
    ].includes(categoryId);
  }

  function imageLooksLikeAccessory(item, allowAccessory = false) {
    const text = normalize(item.image || "");
    if (allowAccessory) return false;
    return /(lopata|skeleton|kladivo|drapak|hak|winch|plosina|rotavator|mulcovac|vrtaci|roznasecidesky)/.test(text)
      && !isAccessoryLike(item);
  }

  function equipmentSort(a, b) {
    const aCategory = equipmentCategory(a);
    const bCategory = equipmentCategory(b);
    const aAccessoryRank = isAccessoryCategory(aCategory) ? 0 : Number(isAccessoryLike(a));
    const bAccessoryRank = isAccessoryCategory(bCategory) ? 0 : Number(isAccessoryLike(b));
    return aAccessoryRank - bAccessoryRank
      || String(a.title).localeCompare(String(b.title), "cs");
  }

  function firstEquipmentImage(items, preferAccessory = false) {
    const pool = items || [];
    if (preferAccessory) {
      const accessory = pool.find(item => item.image && isAccessoryLike(item));
      if (accessory) return accessory.image;
      return pool.find(item => item.image)?.image || "";
    }
    const preferred = pool.find(item => item.image && !isAccessoryLike(item) && !imageLooksLikeAccessory(item));
    if (preferred) return preferred.image;
    const nonAccessoryImage = pool.find(item => item.image && !imageLooksLikeAccessory(item));
    return nonAccessoryImage?.image || "";
  }

  function categoryVisual(category, group) {
    const catalogImage = group.id === "platforms"
      ? category.image
      : firstEquipmentImage(categoryEquipment(category.id, group.id), isAccessoryCategory(category.id));
    return catalogImage
      ? imageTag(catalogImage, "category-photo", category.label)
      : imageTag(category.icon || group.icon, "category-art", category.label);
  }

  function intentVisual(intent) {
    const group = assortmentGroups.find(item => item.id === intent.group);
    const category = group?.categories.find(item => item.id === intent.category);
    if (group?.id === "platforms") {
      const image = category?.image || platformCategories[0]?.image;
      return imageTag(image || intent.icon, image ? "category-photo" : "category-art", intent.label);
    }
    const items = category
      ? categoryEquipment(category.id, group?.id)
      : groupEquipment(group?.id);
    const image = firstEquipmentImage(items, category ? isAccessoryCategory(category.id) : false);
    return image
      ? imageTag(image, "category-photo", intent.label)
      : imageTag(intent.icon, "category-art", intent.label);
  }

  function routeLabel(intent) {
    const group = assortmentGroups.find(item => item.id === intent.group);
    const category = group?.categories.find(item => item.id === intent.category);
    return category ? `${group.label} · ${category.label}` : group?.label || "";
  }

  function renderIntents() {
    el("intentGrid").innerHTML = workIntents.map(intent => `<button class="intent-button" data-intent="${intent.id}" type="button">
      <span class="intent-icon">${intentVisual(intent)}</span>
      <span><span class="intent-label">${esc(intent.label)}</span><span class="intent-description">${esc(intent.description)}</span><span class="intent-route">${esc(routeLabel(intent))}</span></span>
    </button>`).join("");
  }

  function chooseIntent(intentId) {
    const intent = workIntents.find(item => item.id === intentId);
    if (!intent) return;
    selectedIntent = intentId;
    document.querySelectorAll(".intent-button").forEach(button => {
      button.classList.toggle("active", button.dataset.intent === intentId);
    });
    setSelectedGroup(intent.group, { keepIntent: true });
    if (!isPlatformGroup()) {
      el("filterSection").classList.remove("hidden");
      runSearch({ scroll: false });
    }
    el("categorySection").scrollIntoView({ behavior: "smooth" });
  }

  function categoryLabel(categoryId) {
    return activeCategories().find(category => category.id === categoryId)?.label || "Všechny";
  }

  function globalCategoryLabel(categoryId) {
    for (const group of assortmentGroups) {
      const category = (group.categories || []).find(item => item.id === categoryId);
      if (category) return category.label;
    }
    return "Katalog";
  }

  function selectedCategoryConfig() {
    return visibleCategories().find(category => category.id === selectedCategory)
      || activeCategories().find(category => category.id === selectedCategory)
      || (visibleCategories().length === 1 ? visibleCategories()[0] : null)
      || null;
  }

  function equipmentFilterProfile() {
    const category = selectedCategoryConfig();
    if (category?.filters?.length) return category.filters;
    const intent = activeIntent();
    const intentFilters = {
      dig: ["Hmotnost stroje do", "Hloubka výkopu / šířka stroje"],
      load: ["Hmotnost stroje do", "Objem lopaty / nakládací výška"],
      "lift-material": ["Nosnost / výška zdvihu", "Hmotnost stroje do"],
      "haul-earth": ["Nosnost / objem korby", "Šířka stroje / typ výsypu"],
      compact: ["Hmotnost stroje / pracovní šířka", "Zemina / asfalt"],
      power: ["Výkon (kVA)", "230 V / 400 V"],
      air: ["Tlak (bar)", "Výkon (m3/min)"],
      "pump-water": ["Čistá / kalová voda", "Průtok / průměr hadice"],
      "dry-cool-heat": ["Velikost prostoru", "Výkon / druh energie"],
      accessories: ["Typ příslušenství", "Kompatibilní stroj"]
    };
    return intentFilters[intent?.id] || (isPlatformGroup()
      ? ["Provoz / druh práce", "Pracovní výška"]
      : ["Hmotnost / výkon / nosnost", "Rozměr / dosah / průtok"]);
  }

  function selectedFiltersLabel() {
    const filters = equipmentFilterProfile();
    return `Filtry: ${filters.slice(0, 2).join(" · ")}`;
  }

  function setSelectedGroup(groupId, options = {}) {
    if (!options.keepIntent) selectedIntent = null;
    selectedGroup = assortmentGroups.some(group => group.id === groupId) ? groupId : "platforms";
    selectedCategory = null;
    renderCategories();
    setSelectedCategory(null);
    el("categorySection").classList.remove("hidden");
    el("filterSection").classList.add("hidden");
    el("resultsSection").classList.add("hidden");
  }

  function setSelectedCategory(categoryId) {
    selectedCategory = categoryId || null;
    document.querySelectorAll(".category-button").forEach(button => {
      button.classList.toggle("active", selectedCategory && button.dataset.category === selectedCategory);
    });
    el("selectedCategoryLabel").textContent = selectedCategory
      ? `${activeGroup().label}: ${categoryLabel(selectedCategory)} · ${selectedFiltersLabel()}`
      : `${activeGroup().label}: všechny podkategorie · ${selectedFiltersLabel()}`;
    updateFilterLabels();
  }

  function renderCategories() {
    const group = activeGroup();
    const intent = activeIntent();
    const categories = visibleCategories();
    el("categoryTitle").textContent = `Vyberte podkategorii: ${group.label}`;
    el("categoryDescription").textContent = intent && intent.group === group.id && categories.length < activeCategories().length
      ? `Zobrazuji jen typy, které dávají smysl pro: ${intent.label}.`
      : group.id === "platforms"
        ? "Když podkategorii nevyberete, aplikace hledá ve všech plošinách."
        : "Když podkategorii nevyberete, aplikace hledá v celé vybrané skupině podle katalogu Zeppelin CZ.";
    el("showAllButton").textContent = group.id === "platforms" ? "Hledat ve všech kategoriích" : "Zobrazit tento výběr";
    el("categoryGrid").innerHTML = categories.map(category => {
      const count = group.id === "platforms"
        ? machines.filter(machine => inCategory(machine, category.id)).length
        : categoryEquipment(category.id, group.id).length;
      const icon = categoryVisual(category, group);
      const meta = group.id === "platforms"
        ? `${count} strojů · ${category.description}`
        : `${count} položek · ${category.description}`;
      return `<button class="category-button" data-category="${category.id}" type="button">
        <span class="category-icon">${icon}</span>
        <span class="category-label">${esc(category.label)}</span>
        <span class="category-count">${esc(meta)}</span>
      </button>`;
    }).join("");
  }

  function chooseCategory(categoryId) {
    setSelectedCategory(categoryId);
    el("filterSection").classList.remove("hidden");
    if (isPlatformGroup()) {
      el("resultsSection").classList.add("hidden");
      el("filterSection").scrollIntoView({ behavior: "smooth" });
      return;
    }
    runSearch({ scroll: false });
    el("filterSection").scrollIntoView({ behavior: "smooth" });
  }

  function updateFilterLabels() {
    const filters = equipmentFilterProfile();
    el("primaryFilterLabel").textContent = isPlatformGroup() ? "Provoz" : (filters[0] || "Hlavní filtr");
    el("secondaryFilterLabel").textContent = isPlatformGroup() ? "Druh práce" : (filters[1] || "Upřesnění");
    document.querySelector("#filterForm .form-grid").classList.toggle("hidden", !isPlatformGroup());
    el("clearFiltersButton").classList.remove("hidden");
    el("searchSubmitButton").textContent = isPlatformGroup() ? "Vyhledat vhodné plošiny" : "Vyhledat techniku";
    el("configFilterPreview").classList.toggle("hidden", isPlatformGroup());
    el("configFilterPreview").innerHTML = isPlatformGroup() ? "" : consultationPreview(filters);
    if (!isPlatformGroup()) el("configFilterPreview").innerHTML = equipmentFilterPanel(filters);
  }

  function equipmentFilterPanel(filters) {
    const items = (filters.length ? filters.slice(0, 2) : equipmentFilterProfile().slice(0, 2));
    const placeholder = equipmentSearchPlaceholder();
    return `<div class="filter-preview-note">
      <strong>Parametry pro infolinku</strong>
      <span>Vyplňte jen to, co zákazník ví. Hodnoty se hledají v názvu a technických údajích katalogu Zeppelin CZ.</span>
    </div>
    <label class="field equipment-filter-field"><span>Značka, model nebo typ stroje</span><input id="equipmentText" type="search" placeholder="${esc(placeholder)}"></label>
    ${items.map((filter, index) => `<label class="field equipment-filter-field"><span>${esc(filter)}</span><input id="equipmentFilter${index + 1}" type="search" placeholder="bez omezení"></label>`).join("")}`;
  }

  function equipmentSearchPlaceholder() {
    const categoryId = selectedCategoryConfig()?.id || activeIntent()?.id || activeGroup().id;
    const placeholders = {
      dig: "např. Cat 301.8, minirypadlo, hloubka 2,5 m",
      load: "např. Cat 906, Kramer, 0,8 m3, nakládací výška",
      "lift-material": "např. Manitou MT 625, 6 m, 2,5 t",
      "haul-earth": "např. AUSA D601, Morooka, objem korby",
      compact: "např. válec 3 t, asfalt, šířka 1300 mm",
      power: "např. 60 kVA, 400 V, elektrocentrála",
      air: "např. kompresor 7 bar, m3/min",
      "pump-water": "např. kalové čerpadlo, průtok, DN50",
      "dry-cool-heat": "např. odvlhčovač, klimatizace, výkon kW",
      accessories: "např. kladivo, lopata, adaptér, kompatibilita",
      "tracked-excavators": "např. Cat 301.8, 2 t, hloubka 2,5 m",
      "wheeled-excavators": "např. kolové rypadlo, 15 t, hloubka výkopu",
      "excavator-attachments": "např. kladivo, drapák, lopata pro Cat",
      "wheel-loaders": "např. Cat 906, objem lopaty, nosnost",
      "backhoe-loaders": "např. traktorbagř, Cat 432, hloubka výkopu",
      "skid-steer-loaders": "např. Bobcat, pásový, nosnost",
      "skid-steer-attachments": "např. paletizační vidle, zametač, fréza",
      "telehandlers": "např. Manitou MT 625, 6 m, 2,5 t",
      "wheeled-dumpers": "např. AUSA D601, Bergmann, Cat 730, nosnost",
      "tracked-dumpers": "např. Morooka, pásový dempr, nosnost",
      "motor-barrows": "např. Messersi, TuffTruk, pásové kolečko",
      "rollers": "např. válec asfalt, zemina, hmotnost",
      "dozers": "např. dozer, pásový, hmotnost",
      "generators": "např. 60 kVA, 400 V, elektrocentrála",
      "compressors": "např. 7 bar, kompresor, m3/min",
      "light-towers": "např. diesel, elektrická, výška stožáru",
      "load-banks": "např. odporová zátěž, výkon kW",
      "distribution-boards": "např. rozvaděč 32 A, 400 V",
      "pumps": "např. kalové čerpadlo, průtok, hadice",
      "hoses": "např. hadice DN50, délka 20 m",
      "pump-accessories": "např. spojka, savice, průměr",
      "dehumidifiers": "např. odvlhčovač, velikost prostoru",
      "air-conditioning": "např. klimatizace, chladicí výkon",
      "heaters": "např. naftový ohřívač, výkon kW",
      "fans": "např. ventilátor, průtok vzduchu",
      "trailers": "např. přívěsný vozík, brzděný",
      "containers": "např. skladový kontejner, rozměr",
      "small-mechanization": "např. bourací kladivo, pila, nivelační laser",
      "ground-protection": "např. roznášecí deska, rozměr",
      "landscape": "např. štěpkovač, pařezová fréza",
      "compaction": "např. vibrační deska, pěch, hmotnost",
      "crushing-screening": "např. drtič, třídič, dopravník",
      "cleaning": "např. tlakový čistič, vysavač",
      "scaffolding": "např. lešení, pracovní výška",
      "other-equipment": "např. konkrétní název stroje nebo parametr"
    };
    return placeholders[categoryId] || "např. značka, model, výkon nebo hlavní parametr";
  }

  function consultationPreview(filters) {
    const items = (filters.length ? filters.slice(0, 2) : ["Model / velikost", "Hlavní technický parametr"]);
    return `<div class="filter-preview-note">
      <strong>Co si ověřit na infolince</strong>
      <span>Vyberte podkategorii nebo rovnou zobrazte vhodnou techniku. Detailní upřesnění řešte podle typu stroje, ne podle filtrů pro plošiny.</span>
    </div>${items.map((filter, index) => `<div class="filter-preview-item"><span>Dotaz ${index + 1}</span><strong>${esc(filter)}</strong></div>`).join("")}`;
  }

  function filters() {
    return {
      environment: el("environment").value,
      workType: el("workType").value,
      workingHeight: num("workingHeight"),
      minCapacity: num("minCapacity"),
      outreach: num("outreach"),
      drive: el("drive").value,
      maxWeight: num("maxWeight"),
      requiresStabilizers: el("requiresStabilizers").checked
    };
  }

  function equipmentFilters() {
    return ["equipmentText", "equipmentFilter1", "equipmentFilter2"]
      .map((id, index) => ({
        value: (document.getElementById(id)?.value || "").trim(),
        label: index === 0 ? "Značka, model nebo typ stroje" : equipmentFilterProfile()[index - 1] || ""
      }))
      .filter(item => item.value);
  }

  function equipmentMatchesFilters(item, values) {
    if (!values.length) return true;
    const text = normalize(`${item.title || ""} ${item.sourceCategory || ""} ${item.searchText || ""}`);
    return values.every(filter => {
      const value = typeof filter === "string" ? filter : filter.value;
      const label = typeof filter === "string" ? "" : filter.label;
      const normalizedLabel = normalize(label);
      if (/hmotnost.*do|hmotnoststrojedo/.test(normalizedLabel)) {
        const maxWeightKg = maxWeightFromQuery(`do ${value}`);
        if (maxWeightKg != null) return equipmentMatchesQueryConstraints(item, { maxWeightKg });
      }
      return (normalize(value).match(/[a-z0-9]+/g) || [])
        .filter(part => part.length >= 2)
        .every(part => text.includes(part));
    });
  }

  function parseDecimalNumber(value) {
    const normalized = String(value || "")
      .replace(/\s+/g, "")
      .replace(",", ".");
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }

  function maxWeightFromQuery(query) {
    const text = String(query || "").toLowerCase();
    const match = text.match(/(?:do|max\.?|maximalne|maximálně|nejvic|nejvíc|<=)\s*([0-9]+(?:[\s.,][0-9]+)?)\s*(t|tun|tuny|kg|kilogramu|kilogramů)?/i);
    if (!match) return null;
    const value = parseDecimalNumber(match[1]);
    if (value == null) return null;
    const unit = normalize(match[2] || "");
    if (/^t|tun/.test(unit)) return value * 1000;
    if (/^kg|kil/.test(unit)) return value;
    return value <= 80 ? value * 1000 : value;
  }

  function equipmentWeightKg(item) {
    const specs = Array.isArray(item.specs) ? item.specs : [];
    const weightSpec = specs.find(row => /hmotnost/i.test(row.label || ""));
    const source = weightSpec?.value || item.searchText || "";
    const match = String(source).match(/([0-9]+(?:[\s.,][0-9]+)?)\s*(kg|t|tun|tuny)\b/i);
    if (!match) return null;
    const value = parseDecimalNumber(match[1]);
    if (value == null) return null;
    return /^t|tun/i.test(match[2]) ? value * 1000 : value;
  }

  function equipmentQueryConstraints(query) {
    return {
      maxWeightKg: maxWeightFromQuery(query)
    };
  }

  function equipmentMatchesQueryConstraints(item, constraints) {
    if (!constraints?.maxWeightKg) return true;
    const weightKg = equipmentWeightKg(item);
    return weightKg == null || weightKg <= constraints.maxWeightKg;
  }

  function equipmentConstraintDescription(query) {
    const constraints = equipmentQueryConstraints(query);
    if (!constraints.maxWeightKg) return "";
    return `Hmotnost do ${fmt(constraints.maxWeightKg)} kg`;
  }

  function match(machine, selectedFilters) {
    if (selectedFilters.environment === "indoor" && (!machine.indoor || machine.driveGroup === "diesel")) return false;
    if (selectedFilters.environment === "outdoor" && !machine.outdoor) return false;
    if (!machineMatchesWorkType(machine, selectedFilters.workType)) return false;
    if (selectedFilters.workingHeight != null && Number(machine.workingHeightM || 0) < selectedFilters.workingHeight) return false;
    if (selectedFilters.minCapacity != null && Number(machine.capacityKg || 0) < selectedFilters.minCapacity) return false;
    if (selectedFilters.outreach != null && Number(machine.outreachM || 0) < selectedFilters.outreach) return false;
    if (selectedFilters.drive !== "any" && machine.driveGroup !== selectedFilters.drive) return false;
    if (selectedFilters.maxWeight != null && Number(machine.weightKg || 0) > selectedFilters.maxWeight) return false;
    if (selectedFilters.requiresStabilizers && !machineHasStabilizers(machine)) return false;
    return true;
  }

  function machineMatchesWorkType(machine, workType) {
    if (!workType || workType === "any") return true;
    if (workType === "straight") return inCategory(machine, "scissor") || inCategory(machine, "mast");
    if (workType === "obstacle") return inCategory(machine, "articulated") || inCategory(machine, "mast");
    if (workType === "outreach") return inCategory(machine, "telescopic") || inCategory(machine, "articulated") || inCategory(machine, "trailer") || Number(machine.outreachM || 0) >= 6;
    if (workType === "narrow") return inCategory(machine, "mast") || Number(machine.dimensions?.widthM || 99) <= 0.85;
    if (workType === "rough") return machine.driveGroup === "diesel" || inCategory(machine, "telescopic") || (Array.isArray(machine.terrain) && machine.terrain.includes("rough"));
    return true;
  }

  function machineHasStabilizers(machine) {
    if (typeof machine.hasStabilizers === "boolean") return machine.hasStabilizers;
    const text = normalize(`${machine.manufacturer || ""} ${machine.model || ""} ${machine.sourceCategory || ""}`);
    return machine.category === "trailer" || text.includes("omme") || text.includes("stabiliz") || text.includes("oper");
  }

  function usableDocumentUrl(value) {
      const url = String(value || "").trim();
      if (!url) return false;
      const normalizedUrl = url.toLowerCase();

      if (normalizedUrl.startsWith("assets/manufacturer-docs/")) return true;
      if (normalizedUrl.includes("technicky-souhrn") || normalizedUrl.includes("/assets/datasheets/")) return false;
      if (normalizedUrl.includes("raw.githubusercontent.com/bartovaschranka-create/pomoc-infolince-plosiny")) return false;
      return /^https?:\/\//i.test(url);
  }

  function getTechnicalDocumentUrl(machine) {
    const officialCandidates = [machine.officialDocumentUrl, machine.datasheetSourceUrl];
    return officialCandidates.find(value => usableDocumentUrl(value)) || "";
  }

  function priceBlock(machine) {
    const shortPrice = machine.priceShort || "";
    const longPrice = machine.priceLong || "";
    if (!shortPrice && !longPrice) return "";

    return `<div class="price-box">
      <span>Cena půjčení</span>
      <div>
        ${shortPrice ? `<strong>${esc(shortPrice)}</strong>` : ""}
        ${longPrice ? `<small>Dlouhodobě: ${esc(longPrice)}</small>` : ""}
      </div>
    </div>`;
  }

  function deltaText(actual, requested, unit) {
    if (requested == null || actual == null) return "";
    const difference = Number(actual) - Number(requested);
    const sign = difference >= 0 ? "+" : "-";
    return `${sign}${fmt(Math.abs(difference))} ${unit}`;
  }

  function matchDeltaBlock(machine, requestedFilters = {}) {
    const items = [];
    const heightDelta = deltaText(machine.workingHeightM, requestedFilters.workingHeight, "m");
    const outreachDelta = deltaText(machine.outreachM, requestedFilters.outreach, "m");
    const capacityDelta = deltaText(machine.capacityKg, requestedFilters.minCapacity, "kg");
    const weightDelta = requestedFilters.maxWeight != null && machine.weightKg != null
      ? deltaText(requestedFilters.maxWeight, machine.weightKg, "kg")
      : "";

    if (heightDelta) items.push(`<span><em>Výška</em><strong>${heightDelta}</strong></span>`);
    if (outreachDelta) items.push(`<span><em>Dosah</em><strong>${outreachDelta}</strong></span>`);
    if (capacityDelta) items.push(`<span><em>Nosnost</em><strong>${capacityDelta}</strong></span>`);
    if (weightDelta) items.push(`<span><em>Hmotnost do</em><strong>${weightDelta}</strong></span>`);
    if (!items.length) return "";

    return `<div class="match-delta">
      <p>Rozdíl oproti zadání</p>
      <div>${items.join("")}</div>
    </div>`;
  }

  function transportHeightLabel(machine) {
    return machine.foldedHeightText || machine.foldedHeightM != null
      ? "Výška se sklopeným zábradlím"
      : "Transportní výška";
  }

  function transportHeightText(machine) {
    if (machine.foldedHeightText) return machine.foldedHeightText;
    if (machine.foldedHeightM != null) return `${fmt(machine.foldedHeightM)} m`;
    if (machine.dimensions?.heightM != null) return `${fmt(machine.dimensions.heightM)} m`;
    return "Neuvedeno";
  }

  function chassisTiltText(machine) {
    const text = String(machine.maxChassisTiltText || "").trim();
    if (!text) return "Neuvedeno";
    const values = text.split("/").map(value => value.trim()).filter(Boolean);
    if (values.length >= 2 && values.slice(0, 2).every(value => /°/.test(value))) {
      return `${values[0]} / ${values[1]}`;
    }
    return text;
  }

  function offerSpecRows(machine) {
    const rows = [
      ["Pracovní výška", machine.workingHeightM != null ? `${fmt(machine.workingHeightM)} m` : "Neuvedeno"],
      ["Nosnost koše", Number(machine.capacityKg) > 0 ? (machine.capacityText || `${fmt(machine.capacityKg)} kg`) : (machine.capacityText || "Neuvedeno")],
      ["Boční dosah", machine.outreachM != null ? `${fmt(machine.outreachM)} m` : "Neuvedeno"],
      ["Hmotnost", machine.weightKg != null ? `${fmt(machine.weightKg)} kg` : "Neuvedeno"],
      ["Pohon", machine.drive || "Neuvedeno"],
      ["Délka", machine.dimensions?.lengthM != null ? `${fmt(machine.dimensions.lengthM)} m` : "Neuvedeno"],
      ["Šířka", machine.dimensions?.widthM != null ? `${fmt(machine.dimensions.widthM)} m` : "Neuvedeno"],
      [transportHeightLabel(machine), transportHeightText(machine)],
      ...(machine.platformText && !/neuvedeno/i.test(machine.platformText) ? [["Rozměr koše", machine.platformText]] : []),
      ["Max. náklon podvozku (boční / čelní)", chassisTiltText(machine)],
      ["Stabilizátory", machineHasStabilizers(machine) ? "Ano" : "Ne"]
    ];
    return rows;
  }

  function offerHtml(machine) {
    const documentUrl = getTechnicalDocumentUrl(machine);
    const image = imageUrl(machine) || "assets/images/placeholder.svg";
    const capacity = Number(machine.capacityKg) > 0 ? (machine.capacityText || `${fmt(machine.capacityKg)} kg`) : (machine.capacityText || "Neuvedeno");
    const priceRows = [machine.priceShort ? ["Krátkodobě", machine.priceShort] : null, machine.priceLong ? ["Dlouhodobě", machine.priceLong] : null].filter(Boolean);
    const specs = offerSpecRows(machine).map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join("");
    const prices = priceRows.length
      ? `<section><h2>Cena půjčení</h2><table>${priceRows.map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join("")}</table></section>`
      : "";
    const sourceLinks = `<section class="links"><h2>Odkazy</h2>
      ${machine.sourceUrl ? `<p><a href="${esc(machine.sourceUrl)}">Zeppelin CZ - detail stroje</a></p>` : ""}
      ${documentUrl ? `<p><a href="${esc(documentUrl)}">Technický list</a></p>` : ""}
    </section>`;

    return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>${esc(machine.manufacturer)} ${esc(machine.model)} - nabídka</title>
      <style>
        @page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#17191d;margin:0;background:#f3f5f7}.page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;padding:12mm}.top{display:flex;justify-content:space-between;gap:14px;border-bottom:4px solid #f5b400;padding-bottom:10px}.brand{font-weight:900;font-size:13px;letter-spacing:.04em}.date{font-size:11px;color:#66717d;text-align:right}.hero{display:grid;grid-template-columns:.95fr 1.15fr;gap:14px;margin-top:14px;align-items:center}.photo{border:1px solid #dfe3e8;border-radius:9px;background:#fff;height:52mm;display:flex;align-items:center;justify-content:center;overflow:hidden}.photo img{max-width:100%;max-height:100%;object-fit:contain}h1{font-size:24px;margin:0 0 6px;line-height:1.12}h2{font-size:13px;margin:14px 0 6px;text-transform:uppercase;letter-spacing:.05em}.muted{color:#66717d;margin:0}.chips{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:10px}.chip{background:#f4f5f7;border-radius:8px;padding:7px}.chip span{display:block;font-size:10px;color:#66717d}.chip strong{font-size:14px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border-bottom:1px solid #e5e8ec;padding:5px 0;text-align:left;vertical-align:top}th{width:45%;color:#66717d;font-weight:700}.links a{color:#17191d;font-weight:700}.links p{margin:4px 0}.note{margin-top:12px;padding:9px;border:1px solid #f0d77a;background:#fff8df;border-radius:8px;font-size:11px;line-height:1.35;color:#4a4227}@media print{body{background:#fff}.page{margin:0;width:auto;min-height:auto;padding:0}a{color:#17191d;text-decoration:none}}
      </style></head><body><main class="page">
      <header class="top"><div><div class="brand">Zeppelin CZ | nabídka pracovní plošiny</div><p class="muted">Orientační technický list pro zaslání zákazníkovi</p></div><div class="date">Vygenerováno: ${esc(new Date().toLocaleDateString("cs-CZ"))}</div></header>
      <section class="hero"><div class="photo"><img src="${esc(image)}" alt="${esc(`${machine.manufacturer} ${machine.model}`)}"></div><div><h1>${esc(machine.manufacturer)} ${esc(machine.model)}</h1><p class="muted">${esc(machine.sourceCategory || "")}</p><div class="chips"><div class="chip"><span>Pracovní výška</span><strong>${fmt(machine.workingHeightM)} m</strong></div><div class="chip"><span>Nosnost koše</span><strong>${esc(capacity)}</strong></div><div class="chip"><span>Boční dosah</span><strong>${fmt(machine.outreachM)} m</strong></div><div class="chip"><span>Hmotnost</span><strong>${fmt(machine.weightKg)} kg</strong></div></div></div></section>
      <section><h2>Technická data</h2><table>${specs}</table></section>${prices}${sourceLinks}<div class="note"><strong>Poznámka:</strong> Uvedené hodnoty slouží pro orientační porovnání vybraného typu plošiny. U konkrétního stroje se některé údaje, zejména hmotnost, rozměry nebo dovolený náklon, mohou lišit podle roku výroby a provedení.</div>
      </main></body></html>`;
  }

  function equipmentDocumentUrl(item) {
    return item.documentUrl || item.datasheetUrl || item.sourceUrl || "";
  }

  function equipmentPriceBlock(item) {
    const price = item.price || item.priceShort || item.priceText || "";
    if (price) {
      return `<div class="price-box"><span>Cena půjčení</span><div><strong>${esc(price)}</strong></div></div>`;
    }
    return `<div class="price-box"><span>Cena půjčení</span><div><small>Ověřit podle aktuální pobočky a délky pronájmu</small></div></div>`;
  }

  function equipmentOfferHtml(item) {
    const image = equipmentImageUrl(item);
    const specs = Array.isArray(item.specs) && item.specs.length
      ? item.specs.map(row => `<tr><th>${esc(row.label)}</th><td>${esc(row.value)}</td></tr>`).join("")
      : `<tr><th>Technická data</th><td>Detail je dostupný v katalogu Zeppelin CZ.</td></tr>`;
    const price = item.price || item.priceShort || item.priceText || "Cena bude potvrzena podle pobočky a délky pronájmu.";
    const documentUrl = equipmentDocumentUrl(item);

    return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>${esc(item.title)} - nabídka</title>
      <style>
        @page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#17191d;margin:0;background:#f3f5f7}.page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;padding:12mm}.top{display:flex;justify-content:space-between;gap:14px;border-bottom:4px solid #f5b400;padding-bottom:10px}.brand{font-weight:900;font-size:13px;letter-spacing:.04em}.date{font-size:11px;color:#66717d;text-align:right}.hero{display:grid;grid-template-columns:.95fr 1.15fr;gap:14px;margin-top:14px;align-items:center}.photo{border:1px solid #dfe3e8;border-radius:9px;background:#fff;height:56mm;display:flex;align-items:center;justify-content:center;overflow:hidden}.photo img{max-width:100%;max-height:100%;object-fit:contain}h1{font-size:24px;margin:0 0 6px;line-height:1.12}h2{font-size:13px;margin:14px 0 6px;text-transform:uppercase;letter-spacing:.05em}.muted{color:#66717d;margin:0}.chip{background:#f4f5f7;border-radius:8px;padding:8px;margin-top:10px}.chip span{display:block;font-size:10px;color:#66717d}.chip strong{font-size:14px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border-bottom:1px solid #e5e8ec;padding:5px 0;text-align:left;vertical-align:top}th{width:45%;color:#66717d;font-weight:700}.links a{color:#17191d;font-weight:700}.links p{margin:4px 0}.note{margin-top:12px;padding:9px;border:1px solid #f0d77a;background:#fff8df;border-radius:8px;font-size:11px;line-height:1.35;color:#4a4227}@media print{body{background:#fff}.page{margin:0;width:auto;min-height:auto;padding:0}a{color:#17191d;text-decoration:none}}
      </style></head><body><main class="page">
      <header class="top"><div><div class="brand">Zeppelin CZ | nabídka techniky</div><p class="muted">Orientační technický přehled pro zákazníka</p></div><div class="date">Vygenerováno: ${esc(new Date().toLocaleDateString("cs-CZ"))}</div></header>
      <section class="hero"><div class="photo"><img src="${esc(image)}" alt="${esc(item.title)}"></div><div><h1>${esc(item.title)}</h1><p class="muted">${esc(globalCategoryLabel(equipmentCategory(item)))} · ${esc(item.source || "Zeppelin CZ")}</p><div class="chip"><span>Cena půjčení</span><strong>${esc(price)}</strong></div></div></section>
      <section><h2>Technická data</h2><table>${specs}</table></section>
      <section class="links"><h2>Odkazy</h2>${documentUrl ? `<p><a href="${esc(documentUrl)}">Technická data / detail Zeppelin CZ</a></p>` : ""}</section>
      <div class="note"><strong>Poznámka:</strong> Uvedené hodnoty slouží pro orientační porovnání vybraného typu techniky. U konkrétního stroje se některé údaje mohou lišit podle roku výroby, výbavy a provedení.</div>
      </main></body></html>`;
  }

  function ensureOfferPreviewStyles() {
    if (document.getElementById("offerPreviewStyles")) return;
    const style = document.createElement("style");
    style.id = "offerPreviewStyles";
    style.textContent = ".offer-preview-host{position:fixed;inset:0;z-index:1000;background:rgba(23,25,29,.72);display:grid;grid-template-rows:auto 1fr;padding:18px}.offer-preview-bar{background:#fff;border-radius:13px 13px 0 0;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,.18)}.offer-preview-actions{display:flex;gap:8px;flex-wrap:wrap}.offer-preview-frame{width:100%;height:100%;border:0;background:#fff;border-radius:0 0 13px 13px;box-shadow:0 8px 24px rgba(0,0,0,.18)}@media(max-width:720px){.offer-preview-host{padding:8px}.offer-preview-bar{align-items:flex-start;flex-direction:column}.offer-preview-actions .secondary-button,.offer-preview-actions .primary-button{width:auto}}@media print{.offer-preview-host{position:static;display:block;background:#fff;padding:0}.offer-preview-bar{display:none}.offer-preview-frame{height:100vh;box-shadow:none;border-radius:0}}";
    document.head.appendChild(style);
  }

  function closeOfferPreview() {
    document.getElementById("offerPreviewHost")?.remove();
  }
  window.closeOfferPreview = closeOfferPreview;

  function openOfferPdf(machineId) {
    const machine = machines.find(item => item.id === machineId);
    const equipment = machine ? null : equipmentItems.find(item => item.id === machineId);
    if (!machine && !equipment) return;
    ensureOfferPreviewStyles();
    closeOfferPreview();
    const title = machine ? `${machine.manufacturer} ${machine.model}` : equipment.title;
    const html = machine ? offerHtml(machine) : equipmentOfferHtml(equipment);

    const host = document.createElement("div");
    host.id = "offerPreviewHost";
    host.className = "offer-preview-host";
    host.innerHTML = '<div class="offer-preview-bar"><strong>PDF nabídka: '
      + esc(title)
      + '</strong><div class="offer-preview-actions">'
      + '<button class="primary-button" type="button" data-print-offer-preview>Uložit jako PDF</button>'
      + '<button class="secondary-button" type="button" data-close-offer-preview>Zavřít náhled</button>'
      + '</div></div><iframe class="offer-preview-frame" title="PDF nabídka"></iframe>';
    document.body.appendChild(host);

    const frame = host.querySelector("iframe");
    frame.srcdoc = html;
    host.querySelector("[data-close-offer-preview]").addEventListener("click", closeOfferPreview);
    host.querySelector("[data-print-offer-preview]").addEventListener("click", () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    });
  }
  function machineCard(machine, index, requestedFilters = {}) {
    const documentUrl = getTechnicalDocumentUrl(machine);
    const documentButton = documentUrl
      ? `<a class="link-button secondary" target="_blank" rel="noopener" href="${esc(documentUrl)}">Technický list</a>`
      : "";
    const capacity = Number(machine.capacityKg) > 0
      ? (machine.capacityText || `${fmt(machine.capacityKg)} kg`)
      : (machine.capacityText || "Neuvedeno");

    return `<article class="machine-card">
      <div class="machine-image-wrap">
        <img class="machine-image" src="${esc(imageUrl(machine))}" alt="${esc(`${machine.manufacturer} ${machine.model}`)}" onerror="this.src='assets/images/placeholder.svg'">
      </div>
      <div class="machine-content">
        <h3 class="machine-title">${esc(machine.manufacturer)} ${esc(machine.model)}</h3>
        <p class="muted">${esc(machine.sourceCategory || "")}</p>
        <div class="key-specs">
          <div class="key-spec"><span>Pracovní výška</span><strong>${fmt(machine.workingHeightM)} m</strong></div>
          <div class="key-spec"><span>Nosnost koše</span><strong>${esc(capacity)}</strong></div>
          <div class="key-spec"><span>Boční dosah</span><strong>${fmt(machine.outreachM)} m</strong></div>
          <div class="key-spec"><span>Hmotnost</span><strong>${fmt(machine.weightKg)} kg</strong></div>
        </div>
        ${priceBlock(machine)}
        ${matchDeltaBlock(machine, requestedFilters)}
        <div class="spec-panel">
          <h4>Technické údaje</h4>
          <div class="spec-row"><span>Pohon</span><strong>${esc(machine.drive || "Neuvedeno")}</strong></div>
          <div class="spec-row"><span>Délka</span><strong>${fmt(machine.dimensions?.lengthM)} m</strong></div>
          <div class="spec-row"><span>Šířka</span><strong>${fmt(machine.dimensions?.widthM)} m</strong></div>
          <div class="spec-row"><span>${esc(transportHeightLabel(machine))}</span><strong>${esc(transportHeightText(machine))}</strong></div>
          <div class="spec-row"><span>Rozměr koše</span><strong>${esc(machine.platformText || "Neuvedeno")}</strong></div>
          <div class="spec-row"><span>Náklon (boční / čelní)</span><strong>${esc(chassisTiltText(machine))}</strong></div>
        </div>
        <div class="machine-actions">
          <a class="link-button primary" target="_blank" rel="noopener" href="${esc(machine.sourceUrl || "#")}">Zeppelin.cz ↗</a>
          ${documentButton}
          <button class="link-button secondary" type="button" data-offer-pdf="${esc(machine.id)}">PDF nabídka</button>
        </div>
      </div>
    </article>`;
  }

  function equipmentImageUrl(item) {
    if (!item.image) {
      const title = normalize(item.title);
      if (/manitoumrt/.test(title)) return "https://www.zeppelin.cz/fileadmin/helios_files/JPG/Rent/MT932_a_MT1440.thumb.webp";
      if (/manitoumt(835|933|935)/.test(title)) return "https://www.zeppelin.cz/fileadmin/helios_files/JPG/Rent/MT932_a_MT1440.thumb.webp";
      if (/manitoupse/.test(title)) return "https://www.zeppelin.cz/fileadmin/helios_files/JPG/Rent/MT625_1.thumb.webp";
      return "assets/images/placeholder.svg";
    }
    return item.image;
  }

  function equipmentMatches(item, selectedFilters = {}) {
    const text = normalize(`${item.title || ""} ${item.sourceCategory || ""} ${item.searchText || ""}`);
    if (selectedFilters.maxWeight != null) {
      const weightMatch = `${item.searchText || ""}`.match(/hmotnost\s+([0-9.,]+)/i);
      if (weightMatch) {
        const weightKg = Number(weightMatch[1].replace(".", "").replace(",", "."));
        if (weightKg > selectedFilters.maxWeight) return false;
      }
    }
    if (selectedFilters.drive === "electric" && !/(elektr|bateri|aku|230|400)/.test(text)) return false;
    if (selectedFilters.drive === "diesel" && !/(diesel|nafta|motor)/.test(text)) return false;
    return true;
  }

  function equipmentSearchMatches(item, query) {
    const compact = normalize(query);
    if (!compact) return true;
    const text = `${item.title || ""} ${item.sourceCategory || ""} ${item.searchText || ""} ${item.group || ""} ${equipmentCategory(item) || ""}`;
    return normalize(text).includes(compact);
  }

  function equipmentCard(item, index) {
    const specs = Array.isArray(item.specs) ? item.specs.slice(0, 7) : [];
    const documentUrl = equipmentDocumentUrl(item);
    const documentButton = documentUrl
      ? `<a class="link-button secondary" target="_blank" rel="noopener" href="${esc(documentUrl)}">Technická data</a>`
      : "";
    return `<article class="machine-card equipment-card">
      <div class="machine-image-wrap">
        <img class="machine-image" src="${esc(equipmentImageUrl(item))}" alt="" onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
      </div>
      <div class="machine-content">
        <h3 class="machine-title">${esc(item.title)}</h3>
        <p class="muted">${esc(globalCategoryLabel(equipmentCategory(item)))} · ${esc(item.source || "Zeppelin CZ")}</p>
        ${equipmentPriceBlock(item)}
        <div class="spec-panel always-open">
          <h4>Technické údaje</h4>
          ${specs.length
            ? specs.map(row => `<div class="spec-row"><span>${esc(row.label)}</span><strong>${esc(row.value)}</strong></div>`).join("")
            : `<div class="spec-row"><span>Parametry</span><strong>Načíst na Zeppelin.cz</strong></div>`}
        </div>
        <div class="machine-actions">
          <a class="link-button primary" target="_blank" rel="noopener" href="${esc(item.sourceUrl || "#")}">Zeppelin.cz ↗</a>
          ${documentButton}
          <button class="link-button secondary" type="button" data-offer-pdf="${esc(item.id)}">PDF nabídka</button>
        </div>
      </div>
    </article>`;
  }

  function renderEquipment(list, title, description, status = "", options = {}) {
    el("resultsSection").classList.remove("hidden");
    el("resultsStatus").textContent = status || `${list.length} výsledků`;
    el("resultsTitle").textContent = title;
    el("resultsDescription").textContent = description;
    el("resultsGrid").innerHTML = list.length
      ? list.map((item, index) => equipmentCard(item, index)).join("")
      : emptyAssortmentState();
    if (options.scroll !== false) el("resultsSection").scrollIntoView({ behavior: "smooth" });
  }

  function render(list, title, description, customHtml = "", context = {}) {
    el("resultsSection").classList.remove("hidden");
    el("resultsStatus").textContent = context.status || (customHtml ? "Chytré vyhledávání" : `${list.length} výsledků`);
    el("resultsTitle").textContent = title;
    el("resultsDescription").textContent = description;
    el("resultsGrid").innerHTML = customHtml || (list.length
      ? list.map((machine, index) => machineCard(machine, index, context.filters || {})).join("")
      : `<div class="empty">Nebyla nalezena odpovídající plošina.</div>`);
    el("resultsSection").scrollIntoView({ behavior: "smooth" });
  }

  function emptyAssortmentState() {
    const group = activeGroup();
    const categories = selectedCategory ? visibleCategories().filter(category => category.id === selectedCategory) : visibleCategories();
    const filterItems = categories
      .flatMap(category => (category.filters || []).map(filter => `${category.label}: ${filter}`))
      .slice(0, 8);
    return `<div class="empty">
      <strong>Pro zadané parametry nebyla nalezena položka.</strong>
      Zkuste zrušit podkategorii, zadat kratší název modelu nebo otevřít související skupinu na webu Zeppelin CZ.
      ${filterItems.length ? `<ul>${filterItems.map(item => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
    </div>`;
  }

  function findAssortmentTarget(query) {
    const normalizedQuery = normalize(query);
    for (const group of assortmentGroups) {
      if (normalize(group.label) && normalizedQuery.includes(normalize(group.label))) return { group, category: null };
      const category = (group.categories || []).find(item => {
        const label = normalize(item.label);
        const id = normalize(item.id);
        return (label && (normalizedQuery.includes(label) || label.includes(normalizedQuery)))
          || (id && normalizedQuery.includes(id));
      });
      if (category) return { group, category };
    }
    const aliases = [
      ["rypadl", "work-machines", "tracked-excavators"],
      ["kladiv", "work-machines", "excavator-attachments"],
      ["nakladac", "work-machines", "wheel-loaders"],
      ["manipulator", "work-machines", "telehandlers"],
      ["minidumper", "work-machines", "wheeled-dumpers"],
      ["minidamper", "work-machines", "wheeled-dumpers"],
      ["kompaktnidempr", "work-machines", "wheeled-dumpers"],
      ["pasovydumper", "work-machines", "tracked-dumpers"],
      ["pasovedumper", "work-machines", "tracked-dumpers"],
      ["kolovydumper", "work-machines", "wheeled-dumpers"],
      ["kolovedumper", "work-machines", "wheeled-dumpers"],
      ["dumper", "work-machines", "wheeled-dumpers"],
      ["valec", "work-machines", "rollers"],
      ["dozer", "work-machines", "dozers"],
      ["elektrocentral", "energy", "generators"],
      ["kompresor", "energy", "compressors"],
      ["svetelnavez", "energy", "light-towers"],
      ["osvetlovac", "energy", "light-towers"],
      ["rozvadec", "energy", "distribution-boards"],
      ["cerpadl", "pumps", "pumps"],
      ["hadic", "pumps", "hoses"],
      ["odvlhcovac", "climate", "dehumidifiers"],
      ["klimatizac", "climate", "air-conditioning"],
      ["ohrivac", "climate", "heaters"],
      ["ventilator", "climate", "fans"],
      ["prives", "other", "trailers"],
      ["kontejner", "other", "containers"],
      ["vibrac", "other", "compaction"],
      ["stepkovac", "other", "landscape"],
      ["parez", "other", "landscape"],
      ["drtic", "other", "crushing-screening"],
      ["tridic", "other", "crushing-screening"],
      ["cistic", "other", "cleaning"],
      ["leseni", "other", "scaffolding"],
      ["adapter", "other", "adapters"],
      ["prislusenstvi", "other", "accessories"]
    ];
    const match = aliases.find(([alias]) => normalizedQuery.includes(alias));
    if (!match) return null;
    const group = assortmentGroups.find(item => item.id === match[1]);
    const category = group?.categories.find(item => item.id === match[2]) || null;
    return group ? { group, category } : null;
  }

  function runSearch(options = {}) {
    if (!isPlatformGroup()) {
      const title = selectedCategory ? categoryLabel(selectedCategory) : activeGroup().label;
      const allowedCategories = new Set(visibleCategories().map(category => category.id));
      const selectedEquipmentFilters = equipmentFilters();
      const list = groupEquipment()
        .filter(item => selectedCategory ? equipmentCategory(item) === selectedCategory : allowedCategories.has(equipmentCategory(item)))
        .filter(item => equipmentMatchesFilters(item, selectedEquipmentFilters))
        .sort(equipmentSort);
      renderEquipment(list, title, "Výsledky jsou načtené z veřejného katalogu půjčovny Zeppelin CZ. Filtry níže jsou jen volitelné zpřesnění.", `${list.length} položek`, options);
      return;
    }
    const selectedFilters = filters();
    const list = machines
      .filter(machine => !selectedCategory || inCategory(machine, selectedCategory))
      .filter(machine => match(machine, selectedFilters))
      .sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999));
    const title = selectedCategory
      ? `Vhodné ${categoryLabel(selectedCategory).toLowerCase()} plošiny`
      : "Vhodné plošiny napříč kategoriemi";
    const description = selectedCategory
      ? "Výsledky jsou řazené od nejmenší pracovní výšky."
      : "Kategorie není povinná; typ plošiny se odvozuje z vyplněných parametrů a druhu práce.";
    render(list, title, description, "", { filters: selectedFilters });
  }

  function modelMatchesQuery(machine, query) {
    const compactQuery = normalize(query);
    const compactModel = normalize(machine.model);
    const compactWithoutDrive = compactModel.replace(/dc$|rt$|jrt$|jdc$/i, "");
    return compactQuery.includes(compactModel) || (compactWithoutDrive.length >= 4 && compactQuery.includes(compactWithoutDrive));
  }

  function findMachineForWeightQuery(query) {
    const matches = machines.filter(machine => modelMatchesQuery(machine, query));
    if (matches.length <= 1) return matches[0] || null;
    const compactQuery = normalize(query);
    return matches
      .sort((a, b) => normalize(b.model).length - normalize(a.model).length)
      .find(machine => compactQuery.includes(normalize(machine.model))) || matches[0];
  }

  function extractSerialCandidate(query, machine = null) {
    const normalizedQuery = normalize(query);
    const directMatch = normalizedQuery.match(/(?:vc|sn|vyrobnicislo)([a-z0-9]{3,})/);
    if (directMatch) return directMatch[1];

    const ignored = new Set([
      "hmotnost", "vaha", "vazi", "kolik", "kg", "stroj", "stroje", "vyrobni", "cislo", "vc", "sn"
    ]);
    if (machine) {
      ignored.add(normalize(machine.manufacturer));
      ignored.add(normalize(machine.model));
      ignored.add(normalize(machine.model).replace(/dc$|rt$|jrt$|jdc$/i, ""));
    }
    const hasSerialKeyword = /(?:vc|vyrobni|sn)/i.test(normalizedQuery);
    const tokens = query
      .replace(/[^0-9a-zA-Z]+/g, " ")
      .split(/\s+/)
      .map(token => ({ raw: token, normalized: normalize(token) }))
      .filter(token => token.normalized && !ignored.has(token.normalized));

    const candidates = tokens.filter(token => {
      const value = token.normalized;
      const hasDigit = /\d/.test(value);
      const hasLetter = /[a-z]/.test(value);
      return (hasSerialKeyword && hasDigit && value.length >= 3)
        || (hasDigit && hasLetter && value.length >= 6)
        || /^\d{6,}$/.test(value);
    });
    return candidates.length ? candidates[candidates.length - 1].raw : "";
  }

  function unitRecords(machine) {
    return Array.isArray(machine.units) ? machine.units.filter(unit => unit && unit.weightKg != null) : [];
  }

  function serialMatches(candidate, serialNumber) {
    const normalizedCandidate = normalize(candidate);
    const normalizedSerial = normalize(serialNumber);
    return normalizedCandidate
      && normalizedSerial
      && (normalizedSerial === normalizedCandidate || normalizedSerial.endsWith(normalizedCandidate));
  }

  function findUnitBySerial(serialCandidate) {
    for (const machine of machines) {
      const unit = unitRecords(machine).find(item => serialMatches(serialCandidate, item.serialNumber));
      if (unit) return { machine, unit };
    }
    return null;
  }

  function groupWeights(machine) {
    const units = unitRecords(machine);
    if (units.length) {
      const groups = new Map();
      units.forEach(unit => {
        const weight = Number(unit.weightKg);
        if (!groups.has(weight)) groups.set(weight, []);
        groups.get(weight).push(unit.serialNumber || "");
      });
      return [...groups.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([weightKg, serialNumbers]) => ({ weightKg, serialNumbers: serialNumbers.filter(Boolean) }));
    }
    if (Array.isArray(machine.weightGroups) && machine.weightGroups.length) return machine.weightGroups;
    return machine.weightKg != null ? [{ weightKg: machine.weightKg, serialNumbers: [] }] : [];
  }

  function weightGroupHtml(machine, groups) {
    return `<article class="weight-result-card">
      <div class="weight-result-heading">
        <div><span class="weight-kicker">${esc(machine.manufacturer)}</span><h3>${esc(machine.model)}</h3></div>
        <span class="weight-count">${groups.length} ${groups.length === 1 ? "skupina" : groups.length < 5 ? "skupiny" : "skupin"}</span>
      </div>
      <div class="weight-groups">
        ${groups.map(group => `<div class="weight-group">
          <strong>${fmt(group.weightKg)} kg</strong>
          ${group.serialNumbers?.length
            ? `<span>${group.serialNumbers.length} ${group.serialNumbers.length === 1 ? "stroj" : group.serialNumbers.length < 5 ? "stroje" : "strojů"}</span><small>${esc(group.serialNumbers.join(", "))}</small>`
            : `<span>V této verzi nejsou přiřazena výrobní čísla.</span>`}
        </div>`).join("")}
      </div>
    </article>`;
  }

  function firstNumberFromQuery(query) {
    const match = String(query || "").replace(",", ".").match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  }

  function smartParameterFilters(query) {
    const normalizedQuery = normalize(query);
    const value = firstNumberFromQuery(query);
    const selectedFilters = {
      environment: /vnitr|hala|interier/.test(normalizedQuery) ? "indoor" : /venk|teren|terenn/.test(normalizedQuery) ? "outdoor" : "any",
      workType: /prekaz|kloub/.test(normalizedQuery) ? "obstacle" : /dosah|bok|stran/.test(normalizedQuery) ? "outreach" : /uzk|kompakt|toucan|anten/.test(normalizedQuery) ? "narrow" : /teren|diesel|venk/.test(normalizedQuery) ? "rough" : "any",
      workingHeight: /vyska|zdvih|metru|metr/.test(normalizedQuery) ? value : null,
      minCapacity: /nosnost|kos/.test(normalizedQuery) ? value : null,
      outreach: /dosah|bok|stran/.test(normalizedQuery) ? value : null,
      drive: /diesel/.test(normalizedQuery) ? "diesel" : /bateri|elektr|aku/.test(normalizedQuery) ? "electric" : "any",
      maxWeight: /hmotnostdo|vahado/.test(normalizedQuery) ? value : null,
      requiresStabilizers: /stabiliz|opera|opery/.test(normalizedQuery)
    };
    const hasParameter = selectedFilters.workingHeight != null
      || selectedFilters.minCapacity != null
      || selectedFilters.outreach != null
      || selectedFilters.maxWeight != null
      || selectedFilters.environment !== "any"
      || selectedFilters.workType !== "any"
      || selectedFilters.drive !== "any"
      || selectedFilters.requiresStabilizers;
    return hasParameter ? selectedFilters : null;
  }

  function renderWeightLookup(query) {
    const serialCandidate = extractSerialCandidate(query);
    const serialMatch = serialCandidate ? findUnitBySerial(serialCandidate) : null;
    const requestedMachine = findMachineForWeightQuery(query);

    if (serialMatch) {
      const { machine, unit } = serialMatch;
      const mismatchNote = requestedMachine && requestedMachine.id !== machine.id
        ? `<div class="search-warning">Zadane vyrobni cislo odpovida modelu <strong>${esc(machine.manufacturer)} ${esc(machine.model)}</strong>, ne modelu <strong>${esc(requestedMachine.manufacturer)} ${esc(requestedMachine.model)}</strong>.</div>`
        : "";
      const html = `${mismatchNote}<article class="weight-result-card exact-weight">
        <span class="weight-kicker">Nalezen konkretni stroj</span>
        <h3>${esc(machine.manufacturer)} ${esc(machine.model)}</h3>
        <div class="exact-weight-value">${fmt(unit.weightKg)} kg</div>
        <div class="spec-row"><span>Vyrobni cislo</span><strong>${esc(unit.serialNumber)}</strong></div>
      </article>`;
      render([], "Hmotnost konkretniho stroje", `Vyrobni cislo ${serialCandidate}`, html);
      return;
    }

    const machine = requestedMachine;
    if (!machine) {
      render([], "Hmotnost stroje", "", `<div class="empty">Model z dotazu nebyl nalezen. Zadejte napriklad hmotnost GS-3246.</div>`);
      return;
    }

    const groups = groupWeights(machine);
    const missingSerial = serialCandidate
      ? `<div class="search-warning">Vyrobni cislo <strong>${esc(serialCandidate)}</strong> neni v aktualnich kusovych datech. Nize jsou vsechny evidovane skupiny hmotnosti tohoto modelu.</div>`
      : "";
    const html = `${missingSerial}${groups.length
      ? weightGroupHtml(machine, groups)
      : `<div class="empty">U modelu ${esc(machine.manufacturer)} ${esc(machine.model)} zatim neni evidovana hmotnost.</div>`}`;
    render([], `Hmotnosti ${machine.manufacturer} ${machine.model}`, serialCandidate ? "Konkretni vyrobni cislo nebylo nalezeno." : "Prehled evidovanych hmotnosti podle provedeni.", html);
  }

  function smartSearch(query) {
    const raw = query.trim();
    const normalizedQuery = normalize(raw);
    if (!raw) {
      render([], "Chytré vyhledávání", "", `<div class="empty">Zadejte model nebo požadovaný údaj.</div>`);
      return;
    }

    const assortmentTarget = findAssortmentTarget(raw);
    if (assortmentTarget && assortmentTarget.group.id !== "platforms") {
      setSelectedGroup(assortmentTarget.group.id);
      if (assortmentTarget.category) setSelectedCategory(assortmentTarget.category.id);
      const constraints = equipmentQueryConstraints(raw);
      const constraintDescription = equipmentConstraintDescription(raw);
      const list = equipmentItems
        .filter(item => item.group === assortmentTarget.group.id)
        .filter(item => !assortmentTarget.category || equipmentCategory(item) === assortmentTarget.category.id)
        .filter(item => equipmentMatchesQueryConstraints(item, constraints))
        .sort(equipmentSort);
      renderEquipment(list, assortmentTarget.category?.label || assortmentTarget.group.label, constraintDescription ? `Dotaz: ${raw} · ${constraintDescription}` : `Dotaz: ${raw}`, `${list.length} položek`);
      return;
    }

    if (/hmotnostdo|vahado/.test(normalizedQuery)) {
      const parameterFilters = smartParameterFilters(raw);
      const list = machines.filter(machine => match(machine, parameterFilters)).sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999));
      render(list, "Výsledky podle chytrého zadání", `Dotaz: ${raw}`, "", { filters: parameterFilters });
      return;
    }

    if (/hmotnost|vaha|vazi/.test(normalizedQuery)) {
      renderWeightLookup(raw);
      return;
    }

    const parameterFilters = smartParameterFilters(raw);
    if (parameterFilters) {
      const list = machines
        .filter(machine => match(machine, parameterFilters))
        .sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999));
      render(list, "Výsledky podle chytrého zadání", `Dotaz: ${raw}`, "", { filters: parameterFilters });
      return;
    }

    const compact = normalize(raw);
    let list = machines.filter(machine => {
      const text = `${machine.manufacturer} ${machine.model} ${machine.sourceCategory} ${machine.drive}`.toLowerCase();
      return text.includes(raw.toLowerCase())
        || normalize(text).includes(compact)
        || compact.includes(normalize(machine.model));
    });

    if (/diesel/.test(normalizedQuery)) list = list.filter(machine => machine.driveGroup === "diesel");
    if (/toucan|anten|stoz|vertik/.test(normalizedQuery)) list = list.filter(isMast);
    if (/vlec|omme/.test(normalizedQuery)) list = list.filter(machine => machine.category === "trailer");

    if (!list.length) {
      const constraints = equipmentQueryConstraints(raw);
      const equipmentList = equipmentItems
        .filter(item => equipmentSearchMatches(item, raw))
        .filter(item => equipmentMatchesQueryConstraints(item, constraints))
        .sort(equipmentSort);
      if (equipmentList.length) {
        const constraintDescription = equipmentConstraintDescription(raw);
        renderEquipment(equipmentList, "Výsledky chytrého hledání", constraintDescription ? `Dotaz: ${raw} · ${constraintDescription}` : `Dotaz: ${raw}`, `${equipmentList.length} položek`);
        return;
      }
    }

    render(
      list.sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999)),
      "Výsledky chytrého hledání",
      `Dotaz: ${raw}`
    );
  }

  function init() {
    machines = (window.MACHINE_CATALOG?.machines || []).filter(machine => machine.active !== false);
    equipmentItems = (window.EQUIPMENT_CATALOG?.items || []);
    renderIntents();
    el("categorySection").classList.add("hidden");
    el("filterSection").classList.add("hidden");
    el("resultsSection").classList.add("hidden");

    el("intentGrid").addEventListener("click", event => {
      const button = event.target.closest("[data-intent]");
      if (button) chooseIntent(button.dataset.intent);
    });
    el("categoryGrid").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (button) chooseCategory(button.dataset.category);
    });
    el("showAllButton").addEventListener("click", () => {
      setSelectedCategory(null);
      el("filterSection").classList.remove("hidden");
      if (isPlatformGroup()) {
        el("resultsSection").classList.add("hidden");
      } else {
        runSearch({ scroll: false });
      }
      el("filterSection").scrollIntoView({ behavior: "smooth" });
    });
    el("changeGroupButton").addEventListener("click", () => {
      el("resultsSection").classList.add("hidden");
      el("intentSection").scrollIntoView({ behavior: "smooth" });
    });
    el("changeCategoryButton").addEventListener("click", () => {
      setSelectedCategory(null);
      el("resultsSection").classList.add("hidden");
      el("categorySection").scrollIntoView({ behavior: "smooth" });
    });
    el("resultsGrid").addEventListener("click", event => {
      const button = event.target.closest("[data-offer-pdf]");
      if (button) openOfferPdf(button.dataset.offerPdf);
    });
    el("filterForm").addEventListener("submit", event => {
      event.preventDefault();
      runSearch();
    });
    el("clearFiltersButton").addEventListener("click", () => {
      el("filterForm").reset();
      el("resultsSection").classList.add("hidden");
    });
    el("smartSearchForm").addEventListener("submit", event => {
      event.preventDefault();
      smartSearch(el("smartSearchInput").value);
    });
  }

  window.addEventListener("catalog-ready", init, { once: true });
  if (window.MACHINE_CATALOG) init();
})();
