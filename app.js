(() => {
  "use strict";

  const catalog = window.MACHINE_CATALOG || { version: "?", updatedAt: "", machines: [] };
  const machines = catalog.machines.filter((machine) => machine.active !== false);

  const categories = [
    { id: "scissor", label: "Nůžkové", icon: iconScissor(), description: "Rovná plocha, sklad, hala, montáže" },
    { id: "articulated", label: "Kloubové", icon: iconArticulated(), description: "Přes překážku a do stran" },
    { id: "telescopic", label: "Teleskopické", icon: iconTelescopic(), description: "Velký boční dosah" },
    { id: "trailer", label: "Vlečné", icon: iconTrailerOmme(), description: "Vlečné plošiny typu OMME" },
    { id: "mast", label: "Anténní", icon: iconMast(), description: "Stožárové plošiny typu Toucan" }
  ];

  const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));
  const placeholderMap = {
    scissor: "assets/images/placeholder-scissor.svg",
    articulated: "assets/images/placeholder-articulated.svg",
    telescopic: "assets/images/placeholder-telescopic.svg",
    trailer: "assets/images/placeholder-trailer.svg",
    mast: "assets/images/placeholder-mast.svg"
  };


  function iconScissor() {
    return `<svg viewBox="0 0 120 90" class="icon-drawing line" role="img"><path d="M26 72h62M36 72a5 5 0 1 0 .1 0M78 72a5 5 0 1 0 .1 0M42 66l30-36M72 66L42 30M30 20h58v12H30zM39 20v12M58 20v12M77 20v12"/></svg>`;
  }
  function iconArticulated() {
    return `<svg viewBox="0 0 120 90" class="icon-drawing line" role="img"><path d="M21 72h44M31 72a5 5 0 1 0 .1 0M56 72a5 5 0 1 0 .1 0M40 66l19-27 19 12M59 39l17-18 20 8M94 28h16v14H94z"/></svg>`;
  }
  function iconTelescopic() {
    return `<svg viewBox="0 0 120 90" class="icon-drawing line" role="img"><path d="M22 72h46M32 72a5 5 0 1 0 .1 0M58 72a5 5 0 1 0 .1 0M40 66l18-18 39-24M55 50l42-26M94 20h16v14H94z"/></svg>`;
  }
  function iconTrailerOmme() {
    return `<svg viewBox="0 0 120 90" class="icon-drawing line" role="img"><path d="M18 72h76M66 72a6 6 0 1 0 .1 0M20 72l-12 7M90 72l12 7M18 66h50M18 66l-12-7M68 66l14-7M36 64l26-25M62 39l25 16M39 58h38M88 54h21"/></svg>`;
  }
  function iconMast() {
    return `<svg viewBox="0 0 120 90" class="icon-drawing line" role="img"><path d="M34 74h38M43 74a5 5 0 1 0 .1 0M63 74a5 5 0 1 0 .1 0M39 68h32M48 68V24M56 68V24M46 24h12M46 64h12M56 28l18 10M74 38l12 10M85 44h21v16H85z"/></svg>`;
  }

  const terrainLabels = {
    solid: "rovná pevná podlaha",
    paved: "rovná dostatečně únosná plocha",
    rough: "dostatečně únosná venkovní plocha"
  };

  const elements = {
    appVersion: document.querySelector("#appVersion"),
    catalogMeta: document.querySelector("#catalogMeta"),
    categoryGrid: document.querySelector("#categoryGrid"),
    categorySection: document.querySelector("#categorySection"),
    filterSection: document.querySelector("#filterSection"),
    selectedCategoryLabel: document.querySelector("#selectedCategoryLabel"),
    showAllButton: document.querySelector("#showAllButton"),
    changeCategoryButton: document.querySelector("#changeCategoryButton"),
    filterForm: document.querySelector("#filterForm"),
    clearFiltersButton: document.querySelector("#clearFiltersButton"),
    resultsSection: document.querySelector("#resultsSection"),
    resultsStatus: document.querySelector("#resultsStatus"),
    resultsTitle: document.querySelector("#resultsTitle"),
    resultsDescription: document.querySelector("#resultsDescription"),
    resultsGrid: document.querySelector("#resultsGrid"),
    editFiltersButton: document.querySelector("#editFiltersButton")
  };

  let selectedCategory = null;

  function init() {
    if (elements.appVersion) elements.appVersion.textContent = catalog.version || "0.1.0";
    if (elements.catalogMeta) elements.catalogMeta.textContent = `${machines.length} strojů · aktualizace ${formatDate(catalog.updatedAt)}`;
    renderCategories();
    bindEvents();
  }

  function bindEvents() {
    elements.categoryGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (button) chooseCategory(button.dataset.category);
    });

    elements.showAllButton.addEventListener("click", () => {
      selectedCategory = "all";
      elements.filterSection.classList.add("hidden");
      renderAllCatalog();
    });

    elements.changeCategoryButton.addEventListener("click", () => {
      selectedCategory = null;
      document.querySelectorAll(".category-button").forEach((button) => button.classList.remove("active"));
      elements.filterSection.classList.add("hidden");
      elements.resultsSection.classList.add("hidden");
      elements.categorySection.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    elements.filterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch();
    });

    elements.clearFiltersButton.addEventListener("click", () => {
      elements.filterForm.reset();
      elements.resultsSection.classList.add("hidden");
      document.querySelector("#workingHeight").focus();
    });

    elements.editFiltersButton.addEventListener("click", () => {
      if (selectedCategory === "all") {
        elements.categorySection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        elements.filterSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function renderCategories() {
    elements.categoryGrid.innerHTML = categories.map((category) => {
      const count = getMachinesForCategory(category.id).length;
      return `
        <button class="category-button" type="button" data-category="${category.id}" aria-label="${escapeHtml(category.label)}, ${count} strojů">
          <span class="category-icon" aria-hidden="true">${category.icon}</span>
          <span class="category-label">${escapeHtml(category.label)}</span>
          <span class="category-count">${count} ${pluralizeMachines(count)} · ${escapeHtml(category.description)}</span>
        </button>`;
    }).join("");
  }


  function getMachinesForCategory(categoryId) {
    if (categoryId === "mast") {
      return machines.filter((machine) => machine.category === "mast" || (machine.category === "articulated" && isMastMachine(machine)));
    }
    if (categoryId === "articulated") {
      return machines.filter((machine) => machine.category === "articulated" && !isMastMachine(machine));
    }
    return machines.filter((machine) => machine.category === categoryId);
  }

  function isMastMachine(machine) {
    const text = normalizeSearchText(`${machine.manufacturer || ""} ${machine.model || ""} ${machine.sourceCategory || ""} ${machine.id || ""}`);
    return ["toucan", "star", "mast", "stozar", "stozarov", "vertik"].some((term) => text.includes(term));
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function isDieselMachine(machine) {
    return machine.driveGroup === "diesel" || /diesel/i.test(machine.drive || "");
  }

  function supportsEnvironment(machine, environment) {
    if (environment === "indoor") return Boolean(machine.indoor) && !isDieselMachine(machine);
    if (environment === "outdoor") return Boolean(machine.outdoor);
    return true;
  }

  function matchesRequestedEnvironment(machine, filters) {
    if (!filters.environment || filters.environment === "any") return true;
    return supportsEnvironment(machine, filters.environment);
  }

  function chooseCategory(categoryId) {
    selectedCategory = categoryId;
    document.querySelectorAll(".category-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.category === categoryId);
    });
    const category = categoryMap[categoryId];
    elements.selectedCategoryLabel.textContent = `Vybraná kategorie: ${category.label}`;
    elements.filterSection.classList.remove("hidden");
    elements.resultsSection.classList.add("hidden");
    elements.filterSection.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => document.querySelector("#workingHeight").focus(), 250);
  }

  function runSearch() {
    if (!selectedCategory || selectedCategory === "all") return;

    const filters = readFilters();
    const categoryMachines = getMachinesForCategory(selectedCategory);
    const evaluated = categoryMachines.map((machine) => evaluateMachine(machine, filters));
    const exact = evaluated.filter((item) => item.failures.length === 0).sort((a, b) => a.score - b.score);

    if (exact.length) {
      renderResults(exact, false, filters);
    } else {
      const nearest = evaluated
        .filter((item) => matchesRequestedEnvironment(item.machine, filters))
        .sort((a, b) => a.penalty - b.penalty || a.score - b.score)
        .slice(0, Math.min(5, evaluated.length));
      renderResults(nearest, true, filters);
    }
  }

  function readFilters() {
    return {
      environment: value("environment"),
      workingHeight: numberValue("workingHeight"),
      outreach: numberValue("outreach"),
      maxWidth: numberValue("maxWidth"),
      maxLength: numberValue("maxLength"),
      maxMachineHeight: numberValue("maxMachineHeight"),
      drive: value("drive"),
      terrain: value("terrain")
    };
  }

  function evaluateMachine(machine, filters) {
    const failures = [];
    let penalty = 0;

    if (filters.environment === "indoor" && !supportsEnvironment(machine, "indoor")) addFailure("není určen pro vnitřní provoz", 1500);
    if (filters.environment === "outdoor" && !supportsEnvironment(machine, "outdoor")) addFailure("není určen pro venkovní provoz", 1500);

    compareMinimum(machine.workingHeightM, filters.workingHeight, "pracovní výška", "m", 450);
    compareMinimum(machine.outreachM, filters.outreach, "boční dosah", "m", 350, true);
    compareMaximum(machine.dimensions?.widthM, filters.maxWidth, "šířka stroje", "m", 500, true);
    compareMaximum(machine.dimensions?.lengthM, filters.maxLength, "délka stroje", "m", 250, true);
    compareMaximum(machine.dimensions?.heightM, filters.maxMachineHeight, "výška stroje", "m", 500, true);

    if (filters.drive !== "any" && machine.driveGroup !== filters.drive) {
      addFailure(`jiný pohon (${machine.drive})`, 900);
    }
    if (filters.terrain !== "any" && !machine.terrain.includes(filters.terrain)) {
      addFailure(`není určen pro povrch „${terrainLabels[filters.terrain]}“`, 1000);
    }

    const heightSurplus = filters.workingHeight == null ? machine.workingHeightM : Math.max(0, machine.workingHeightM - filters.workingHeight);
    const footprint = (machine.dimensions?.lengthM ?? 20) * (machine.dimensions?.widthM ?? 5);
    const weightFactor = (machine.weightKg ?? 50000) / 10000;
    const score = heightSurplus * 100 + footprint * 8 + weightFactor;

    return { machine, failures, penalty, score };

    function addFailure(text, points) {
      failures.push(text);
      penalty += points;
    }

    function compareMinimum(actual, required, label, unit, multiplier, unknownFails = false) {
      if (required == null) return;
      if (actual == null) {
        if (unknownFails) addFailure(`${label} není na webu uveden`, 1300);
        return;
      }
      if (actual < required) {
        const gap = required - actual;
        addFailure(`${label} je ${formatNumber(actual)} ${unit}, požadováno ${formatNumber(required)} ${unit}`, 700 + gap * multiplier);
      }
    }

    function compareMaximum(actual, maximum, label, unit, multiplier, unknownFails = false) {
      if (maximum == null) return;
      if (actual == null) {
        if (unknownFails) addFailure(`${label} není na webu uvedena`, 1300);
        return;
      }
      if (actual > maximum) {
        const gap = actual - maximum;
        addFailure(`${label} je ${formatNumber(actual)} ${unit}, maximum ${formatNumber(maximum)} ${unit}`, 700 + gap * multiplier);
      }
    }
  }

  function renderResults(items, nearestOnly, filters) {
    const category = categoryMap[selectedCategory];
    elements.resultsSection.classList.remove("hidden");
    elements.resultsStatus.textContent = nearestOnly ? "NEBYLA NALEZENA PŘESNÁ SHODA" : `${items.length} ${pluralizeResults(items.length)}`;
    elements.resultsTitle.textContent = nearestOnly ? "Nejbližší dostupné varianty" : `Vhodné ${category.label.toLowerCase()} plošiny`;
    elements.resultsDescription.textContent = nearestOnly
      ? "U každé varianty je uvedeno, který požadavek nesplňuje. Před nabídkou je nutné parametry ověřit."
      : "Výsledky jsou řazené od nejmenšího stroje, který splňuje zadané podmínky.";
    elements.resultsGrid.innerHTML = items.length
      ? items.map((item, index) => renderMachineCard(item, filters, nearestOnly, index)).join("")
      : `<div class="empty-state">${nearestOnly ? "V této kategorii není kompatibilní stroj pro zadané provozní podmínky." : "V této kategorii zatím není žádný stroj v lokálním katalogu."}</div>`;
    elements.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderAllCatalog() {
    const items = machines
      .slice()
      .sort((a, b) => a.category.localeCompare(b.category) || a.workingHeightM - b.workingHeightM)
      .map((machine) => ({ machine, failures: [], penalty: 0, score: 0 }));

    elements.resultsSection.classList.remove("hidden");
    elements.resultsStatus.textContent = `${items.length} ${pluralizeResults(items.length)}`;
    elements.resultsTitle.textContent = "Celý katalog plošin";
    elements.resultsDescription.textContent = "Katalog je řazen podle kategorie a pracovní výšky.";
    elements.resultsGrid.innerHTML = items.map((item, index) => renderMachineCard(item, {}, false, index, true)).join("");
    elements.resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function displayCategoryForMachine(machine) {
    if ((selectedCategory === "mast" || machine.category === "mast") && isMastMachine(machine)) return categoryMap.mast;
    return categoryMap[machine.category] || { label: machine.category || "Plošina" };
  }

  function renderMachineCard(item, filters, nearestOnly, index, wholeCatalog = false) {
    const machine = item.machine;
    const category = displayCategoryForMachine(machine);
    const isNear = nearestOnly && item.failures.length > 0;
    const reason = wholeCatalog ? "Zobrazeno v úplném katalogu." : buildReason(machine, filters, item.failures);
    const dimensions = dimensionText(machine.dimensions);
    const environment = [supportsEnvironment(machine, "indoor") && "vnitřní", supportsEnvironment(machine, "outdoor") && "venkovní"].filter(Boolean).join(" i ") || "Neuvedeno";
    const terrain = terrainText(machine);
    const price = machine.priceShort || "Cena neuvedena";
    const priceSecondary = machine.priceLong ? `dlouhodobě ${machine.priceLong}` : "";
    const fallback = placeholderMap[machine.category];

    return `
      <article class="machine-card">
        <div class="machine-image-wrap">
          <span class="match-badge ${isNear ? "near" : ""}">${isNear ? "Nejbližší varianta" : (wholeCatalog ? category.label : `Shoda č. ${index + 1}`)}</span>
          <img class="machine-image" src="${escapeAttribute(machine.image || fallback)}" alt="${escapeAttribute(`${machine.manufacturer} ${machine.model}`)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">
        </div>
        <div class="machine-content">
          <div class="machine-head">
            <div>
              <h3 class="machine-title">${escapeHtml(machine.manufacturer)} ${escapeHtml(machine.model)}</h3>
              <p class="machine-category">${escapeHtml(category.label)} · ${escapeHtml(machine.sourceCategory || "")}</p>
            </div>
            <div class="price-box">
              <strong>${escapeHtml(price)}</strong>
              ${priceSecondary ? `<span>${escapeHtml(priceSecondary)}</span>` : ""}
            </div>
          </div>

          <div class="key-specs">
            ${keySpec("Pracovní výška", metric(machine.workingHeightM, "m"))}
            ${keySpec("Nosnost koše", machine.capacityText || metric(machine.capacityKg, "kg"))}
            ${keySpec("Boční dosah", metric(machine.outreachM, "m"))}
            ${keySpec("Rozměry stroje", dimensions)}
          </div>

          <div class="match-reason ${isNear ? "near" : ""}">
            <strong>${isNear ? "Nesplňuje všechny požadavky:" : "Proč je ve výsledku:"}</strong>
            <div>${escapeHtml(reason)}</div>
            ${isNear ? `<ul class="failure-list">${item.failures.map((failure) => `<li>${escapeHtml(failure)}</li>`).join("")}</ul>` : ""}
          </div>

          <details class="machine-details">
            <summary>Technické údaje</summary>
            <div class="spec-table">
              ${specRow("Výška podlahy koše", metric(machine.platformHeightM, "m"))}
              ${specRow("Max. počet osob", machine.maxPersons == null ? "Neuvedeno na webu" : String(machine.maxPersons))}
              ${specRow("Pohon", machine.drive || "Neuvedeno")}
              ${specRow("Použití", environment)}
              ${specRow("Vhodný povrch", terrain)}
              ${machine.maxChassisTiltDeg == null ? "" : specRow("Max. náklon podvozku", metric(machine.maxChassisTiltDeg, "\u00b0"))}
              ${specRow("Délka stroje", metric(machine.dimensions?.lengthM, "m"))}
              ${specRow("Šířka stroje", metric(machine.dimensions?.widthM, "m"))}
              ${specRow("Výška stroje", metric(machine.dimensions?.heightM, "m"))}
              ${specRow("Výška se sklopeným zábradlím", metric(machine.foldedHeightM, "m"))}
              ${specRow("Rozměr koše", machine.platformText || "Neuvedeno")}
              ${specRow("Hmotnost stroje", metric(machine.weightKg, "kg", 0))}
              ${specRow("Aktualizace katalogu", formatDate(catalog.updatedAt))}
            </div>
          </details>

          <div class="machine-actions">
            <a class="link-button primary" href="${escapeAttribute(machine.sourceUrl)}" target="_blank" rel="noopener noreferrer">Zobrazit na Zeppelin.cz ↗</a>
            <button class="link-button secondary" type="button" onclick="this.closest('.machine-content').querySelector('details').open=true; this.closest('.machine-content').querySelector('details').scrollIntoView({behavior:'smooth',block:'nearest'})">Technické údaje</button>
          </div>
        </div>
      </article>`;
  }

  function buildReason(machine, filters, failures) {
    if (failures.length) return "Jde o jednu z parametricky nejbližších variant v dané kategorii.";
    const parts = [];
    if (filters.workingHeight != null) {
      parts.push(`pracovní výška ${formatNumber(machine.workingHeightM)} m má rezervu ${formatNumber(machine.workingHeightM - filters.workingHeight)} m`);
    }
    if (filters.outreach != null && machine.outreachM != null) {
      parts.push(`boční dosah ${formatNumber(machine.outreachM)} m splňuje minimum ${formatNumber(filters.outreach)} m`);
    }
    if (filters.maxWidth != null && machine.dimensions?.widthM != null) {
      parts.push(`šířka ${formatNumber(machine.dimensions.widthM)} m se vejde do limitu ${formatNumber(filters.maxWidth)} m`);
    }
    if (!parts.length) return "Stroj odpovídá vybrané kategorii a zadaným provozním podmínkám.";
    return capitalize(parts.join("; ")) + ".";
  }

  function keySpec(label, value) {
    return `<div class="key-spec"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  function specRow(label, value) {
    return `<div class="spec-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  function terrainText(machine) {
    if (!machine.terrain?.length) return "Neuvedeno";
    if (machine.terrain.includes("rough")) return terrainLabels.rough;
    return machine.terrain.map((value) => terrainLabels[value]).filter(Boolean).join(", ") || "Neuvedeno";
  }

  function dimensionText(dimensions) {
    if (!dimensions || [dimensions.lengthM, dimensions.widthM, dimensions.heightM].some((value) => value == null)) return "Neuvedeno";
    return `${formatNumber(dimensions.lengthM)} × ${formatNumber(dimensions.widthM)} × ${formatNumber(dimensions.heightM)} m`;
  }

  function metric(value, unit, decimals = 1) {
    if (value == null || Number.isNaN(value)) return "Neuvedeno";
    return `${formatNumber(value, decimals)} ${unit}`;
  }

  function formatNumber(value, maximumFractionDigits = 2) {
    return new Intl.NumberFormat("cs-CZ", { maximumFractionDigits }).format(value);
  }

  function formatDate(value) {
    if (!value) return "neuvedena";
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("cs-CZ").format(date);
  }

  function value(id) {
    return document.querySelector(`#${id}`).value;
  }

  function numberValue(id) {
    const raw = document.querySelector(`#${id}`).value.trim().replace(",", ".");
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  function pluralizeMachines(count) {
    if (count === 1) return "stroj";
    if (count >= 2 && count <= 4) return "stroje";
    return "strojů";
  }

  function pluralizeResults(count) {
    if (count === 1) return "nalezený stroj";
    if (count >= 2 && count <= 4) return "nalezené stroje";
    return "nalezených strojů";
  }

  function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  init();
})();


