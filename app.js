(() => {
  "use strict";

  const categories = [
    { id: "scissor", label: "Nůžkové", image: "assets/images/genie-gs-4046.webp", description: "Rovná plocha, sklad, hala" },
    { id: "articulated", label: "Kloubové", image: "assets/images/genie-z-45xc.webp", description: "Přes překážku a do stran" },
    { id: "telescopic", label: "Teleskopické", image: "assets/images/jlg-660-sj.webp", description: "Velký boční dosah" },
    { id: "trailer", label: "Vlečné", image: "assets/images/ommelift-1700-exbp.webp", description: "Vlečné plošiny OMME" },
    { id: "mast", label: "Anténní", image: "assets/images/jlg-toucan-12e.webp", description: "Toucan a stožárové plošiny" }
  ];

  let machines = [];
  let selectedCategory = null;

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
    return `https://bartovaschranka-create.github.io/pomoc-infolince-plosiny/${machine.image}`;
  }

  function renderCategories() {
    el("categoryGrid").innerHTML = categories.map(category => {
      const count = machines.filter(machine => inCategory(machine, category.id)).length;
      return `<button class="category-button" data-category="${category.id}" type="button">
        <span class="category-icon"><img class="category-photo" src="${esc(category.image)}" alt="${esc(category.label)} plošina" loading="lazy"></span>
        <span class="category-label">${category.label}</span>
        <span class="category-count">${count} strojů · ${category.description}</span>
      </button>`;
    }).join("");
  }

  function chooseCategory(categoryId) {
    selectedCategory = categoryId;
    document.querySelectorAll(".category-button").forEach(button => {
      button.classList.toggle("active", button.dataset.category === categoryId);
    });
    el("selectedCategoryLabel").textContent = `Vybraná kategorie: ${categories.find(category => category.id === categoryId).label}`;
    el("filterSection").classList.remove("hidden");
    el("resultsSection").classList.add("hidden");
    el("filterSection").scrollIntoView({ behavior: "smooth" });
  }

  function filters() {
    return {
      environment: el("environment").value,
      workingHeight: num("workingHeight"),
      outreach: num("outreach"),
      drive: el("drive").value
    };
  }

  function match(machine, selectedFilters) {
    if (selectedFilters.environment === "indoor" && (!machine.indoor || machine.driveGroup === "diesel")) return false;
    if (selectedFilters.environment === "outdoor" && !machine.outdoor) return false;
    if (selectedFilters.workingHeight != null && Number(machine.workingHeightM || 0) < selectedFilters.workingHeight) return false;
    if (selectedFilters.outreach != null && Number(machine.outreachM || 0) < selectedFilters.outreach) return false;
    if (selectedFilters.drive !== "any" && machine.driveGroup !== selectedFilters.drive) return false;
    return true;
  }

  function getOfficialDocumentUrl(machine) {
    const candidates = [machine.officialDocumentUrl, machine.datasheetSourceUrl, machine.datasheetUrl];
    return candidates.find(value => {
      const url = String(value || "").trim();
      if (!url) return false;
      const normalizedUrl = url.toLowerCase();

      // Nikdy nezobrazovat dříve vytvořené technické souhrny.
      if (normalizedUrl.includes("technicky-souhrn") || normalizedUrl.includes("/assets/datasheets/")) return false;
      if (normalizedUrl.includes("raw.githubusercontent.com/bartovaschranka-create/pomoc-infolince-plosiny")) return false;

      // Lokálně smí být pouze nezměněný originální dokument výrobce.
      if (normalizedUrl.startsWith("assets/manufacturer-docs/")) return true;
      return /^https?:\/\//i.test(url);
    }) || "";
  }

  function machineCard(machine, index) {
    const documentUrl = getOfficialDocumentUrl(machine);
    const documentButton = documentUrl
      ? `<a class="link-button secondary" target="_blank" rel="noopener" href="${esc(documentUrl)}">Originální dokument</a>`
      : "";
    const capacity = Number(machine.capacityKg) > 0
      ? (machine.capacityText || `${fmt(machine.capacityKg)} kg`)
      : (machine.capacityText || "Neuvedeno");

    return `<article class="machine-card">
      <div class="machine-image-wrap">
        <span class="badge">Shoda č. ${index + 1}</span>
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
        <details>
          <summary>Technické údaje</summary>
          <div class="spec-row"><span>Pohon</span><strong>${esc(machine.drive || "Neuvedeno")}</strong></div>
          <div class="spec-row"><span>Délka</span><strong>${fmt(machine.dimensions?.lengthM)} m</strong></div>
          <div class="spec-row"><span>Šířka</span><strong>${fmt(machine.dimensions?.widthM)} m</strong></div>
          <div class="spec-row"><span>Výška</span><strong>${fmt(machine.dimensions?.heightM)} m</strong></div>
          <div class="spec-row"><span>Rozměr koše</span><strong>${esc(machine.platformText || "Neuvedeno")}</strong></div>
          <div class="spec-row"><span>Náklon</span><strong>${esc(machine.maxChassisTiltText || "Neuvedeno")}</strong></div>
        </details>
        <div class="machine-actions">
          <a class="link-button primary" target="_blank" rel="noopener" href="${esc(machine.sourceUrl || "#")}">Zeppelin.cz ↗</a>
          ${documentButton}
        </div>
      </div>
    </article>`;
  }

  function render(list, title, description, customHtml = "") {
    el("resultsSection").classList.remove("hidden");
    el("resultsStatus").textContent = customHtml ? "Chytré vyhledávání" : `${list.length} výsledků`;
    el("resultsTitle").textContent = title;
    el("resultsDescription").textContent = description;
    el("resultsGrid").innerHTML = customHtml || (list.length
      ? list.map(machineCard).join("")
      : `<div class="empty">Nebyla nalezena odpovídající plošina.</div>`);
    el("resultsSection").scrollIntoView({ behavior: "smooth" });
  }

  function runSearch() {
    const selectedFilters = filters();
    const list = machines
      .filter(machine => inCategory(machine, selectedCategory))
      .filter(machine => match(machine, selectedFilters))
      .sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999));
    const category = categories.find(item => item.id === selectedCategory);
    render(list, `Vhodné ${category.label.toLowerCase()} plošiny`, "Výsledky jsou řazené od nejmenší pracovní výšky.");
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

  function extractSerialCandidate(query, machine) {
    const ignored = new Set([
      "hmotnost", "vaha", "vazi", "kolik", "kg", "stroj", "stroje", "vyrobni", "cislo", "vc", "sn",
      normalize(machine.manufacturer), normalize(machine.model), normalize(machine.model).replace(/dc$|rt$|jrt$|jdc$/i, "")
    ]);
    const tokens = query
      .replace(/[,:;()]/g, " ")
      .split(/\s+/)
      .map(token => ({ raw: token, normalized: normalize(token) }))
      .filter(token => token.normalized && !ignored.has(token.normalized));

    const candidates = tokens.filter(token => {
      const value = token.normalized;
      const hasDigit = /\d/.test(value);
      const hasLetter = /[a-z]/.test(value);
      return (hasDigit && hasLetter && value.length >= 6) || /^\d{6,}$/.test(value);
    });
    return candidates.length ? candidates[candidates.length - 1].raw : "";
  }

  function unitRecords(machine) {
    return Array.isArray(machine.units) ? machine.units.filter(unit => unit && unit.weightKg != null) : [];
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

  function renderWeightLookup(query) {
    const machine = findMachineForWeightQuery(query);
    if (!machine) {
      render([], "Hmotnost stroje", "", `<div class="empty">Model z dotazu nebyl nalezen. Zadejte například „hmotnost GS-3246“.</div>`);
      return;
    }

    const serialCandidate = extractSerialCandidate(query, machine);
    const units = unitRecords(machine);
    const normalizedSerial = normalize(serialCandidate);
    const unit = normalizedSerial
      ? units.find(item => normalize(item.serialNumber) === normalizedSerial)
      : null;

    if (serialCandidate && unit) {
      const html = `<article class="weight-result-card exact-weight">
        <span class="weight-kicker">Nalezen konkrétní stroj</span>
        <h3>${esc(machine.manufacturer)} ${esc(machine.model)}</h3>
        <div class="exact-weight-value">${fmt(unit.weightKg)} kg</div>
        <div class="spec-row"><span>Výrobní číslo</span><strong>${esc(unit.serialNumber)}</strong></div>
      </article>`;
      render([], "Hmotnost konkrétního stroje", `Výrobní číslo ${serialCandidate}`, html);
      return;
    }

    const groups = groupWeights(machine);
    const missingSerial = serialCandidate
      ? `<div class="search-warning">Výrobní číslo <strong>${esc(serialCandidate)}</strong> není v aktuálních datech. Níže jsou všechny evidované skupiny hmotností tohoto modelu.</div>`
      : "";
    const html = `${missingSerial}${groups.length
      ? weightGroupHtml(machine, groups)
      : `<div class="empty">U modelu ${esc(machine.manufacturer)} ${esc(machine.model)} zatím není evidována hmotnost.</div>`}`;
    render([], `Hmotnosti ${machine.manufacturer} ${machine.model}`, serialCandidate ? "Konkrétní výrobní číslo nebylo nalezeno." : "Přehled evidovaných hmotností podle provedení.", html);
  }

  function smartSearch(query) {
    const raw = query.trim();
    const normalizedQuery = normalize(raw);
    if (!raw) {
      render([], "Chytré vyhledávání", "", `<div class="empty">Zadejte model nebo požadovaný údaj.</div>`);
      return;
    }

    if (/hmotnost|vaha|vazi|kg/.test(normalizedQuery)) {
      renderWeightLookup(raw);
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

    render(
      list.sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999)),
      "Výsledky chytrého hledání",
      `Dotaz: ${raw}`
    );
  }

  function init() {
    machines = (window.MACHINE_CATALOG?.machines || []).filter(machine => machine.active !== false);
    renderCategories();

    el("categoryGrid").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (button) chooseCategory(button.dataset.category);
    });
    el("showAllButton").addEventListener("click", () => render(
      [...machines].sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999)),
      "Celý katalog plošin",
      "Katalog je řazen podle pracovní výšky."
    ));
    el("changeCategoryButton").addEventListener("click", () => {
      el("filterSection").classList.add("hidden");
      el("resultsSection").classList.add("hidden");
      el("categorySection").scrollIntoView({ behavior: "smooth" });
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
