(() => {
  "use strict";

  const categories = [
    { id: "scissor", label: "Nůžkové", image: "assets/images/category-scissor.webp", description: "Rovná plocha, sklad, hala" },
    { id: "articulated", label: "Kloubové", image: "assets/images/category-articulated.webp", description: "Přes překážku a do stran" },
    { id: "telescopic", label: "Teleskopické", image: "assets/images/category-telescopic.webp", description: "Velký boční dosah" },
    { id: "trailer", label: "Vlečné", image: "assets/images/category-trailer.webp", description: "Vlečné plošiny OMME" },
    { id: "mast", label: "Anténní", image: "assets/images/category-mast.webp", description: "Toucan a stožárové plošiny" }
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

  function categoryLabel(categoryId) {
    return categories.find(category => category.id === categoryId)?.label || "Všechny";
  }

  function setSelectedCategory(categoryId) {
    selectedCategory = categoryId || null;
    document.querySelectorAll(".category-button").forEach(button => {
      button.classList.toggle("active", selectedCategory && button.dataset.category === selectedCategory);
    });
    el("selectedCategoryLabel").textContent = selectedCategory
      ? `Vybraná kategorie: ${categoryLabel(selectedCategory)}`
      : "Kategorie: všechny plošiny";
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
    setSelectedCategory(categoryId);
    el("filterSection").classList.remove("hidden");
    el("resultsSection").classList.add("hidden");
    el("filterSection").scrollIntoView({ behavior: "smooth" });
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

  function offerSpecRows(machine) {
    const rows = [
      ["Pracovní výška", machine.workingHeightM != null ? `${fmt(machine.workingHeightM)} m` : "Neuvedeno"],
      ["Nosnost koše", Number(machine.capacityKg) > 0 ? (machine.capacityText || `${fmt(machine.capacityKg)} kg`) : (machine.capacityText || "Neuvedeno")],
      ["Boční dosah", machine.outreachM != null ? `${fmt(machine.outreachM)} m` : "Neuvedeno"],
      ["Hmotnost", machine.weightKg != null ? `${fmt(machine.weightKg)} kg` : "Neuvedeno"],
      ["Pohon", machine.drive || "Neuvedeno"],
      ["Délka", machine.dimensions?.lengthM != null ? `${fmt(machine.dimensions.lengthM)} m` : "Neuvedeno"],
      ["Šířka", machine.dimensions?.widthM != null ? `${fmt(machine.dimensions.widthM)} m` : "Neuvedeno"],
      ["Výška stroje", machine.dimensions?.heightM != null ? `${fmt(machine.dimensions.heightM)} m` : "Neuvedeno"],
      ["Výška se sklopeným zábradlím", machine.foldedHeightText || (machine.foldedHeightM != null ? `${fmt(machine.foldedHeightM)} m` : "Neuvedeno")],
      ["Rozměr koše", machine.platformText || "Neuvedeno"],
      ["Max. náklon podvozku", machine.maxChassisTiltText || "Neuvedeno"],
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
        *{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#17191d;margin:0;background:#f3f5f7}.page{width:210mm;min-height:297mm;margin:0 auto;background:#fff;padding:18mm}.top{display:flex;justify-content:space-between;gap:18px;border-bottom:4px solid #f5b400;padding-bottom:14px}.brand{font-weight:900;font-size:14px;letter-spacing:.04em}.date{font-size:12px;color:#66717d;text-align:right}.hero{display:grid;grid-template-columns:1fr 1.1fr;gap:18px;margin-top:20px;align-items:center}.photo{border:1px solid #dfe3e8;border-radius:10px;background:#fff;height:72mm;display:flex;align-items:center;justify-content:center;overflow:hidden}.photo img{max-width:100%;max-height:100%;object-fit:contain}h1{font-size:30px;margin:0 0 8px}h2{font-size:15px;margin:22px 0 8px;text-transform:uppercase;letter-spacing:.05em}.muted{color:#66717d;margin:0}.chips{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:14px}.chip{background:#f4f5f7;border-radius:8px;padding:9px}.chip span{display:block;font-size:11px;color:#66717d}.chip strong{font-size:16px}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #e5e8ec;padding:8px 0;text-align:left;vertical-align:top}th{width:45%;color:#66717d;font-weight:700}.links a{color:#17191d;font-weight:700}.note{margin-top:20px;padding:12px;border:1px solid #f0d77a;background:#fff8df;border-radius:9px;font-size:12px;color:#4a4227}.actions{position:fixed;right:18px;top:18px;display:flex;gap:8px}.actions button{border:0;border-radius:9px;padding:10px 12px;font-weight:800;cursor:pointer}.print{background:#f5b400;color:#17191d}.close{background:#17191d;color:#fff}@media print{body{background:#fff}.page{margin:0;width:auto;min-height:auto}.actions{display:none}a{color:#17191d;text-decoration:none}}
      </style></head><body><div class="actions"><button class="print" onclick="window.print()">Uložit jako PDF</button><button class="close" onclick="window.parent.closeOfferPreview ? window.parent.closeOfferPreview() : window.close()">Zavřít</button></div><main class="page">
      <header class="top"><div><div class="brand">Zeppelin CZ | nabídka pracovní plošiny</div><p class="muted">Orientační technický list pro zaslání zákazníkovi</p></div><div class="date">Vygenerováno: ${esc(new Date().toLocaleDateString("cs-CZ"))}</div></header>
      <section class="hero"><div class="photo"><img src="${esc(image)}" alt="${esc(`${machine.manufacturer} ${machine.model}`)}"></div><div><h1>${esc(machine.manufacturer)} ${esc(machine.model)}</h1><p class="muted">${esc(machine.sourceCategory || "")}</p><div class="chips"><div class="chip"><span>Pracovní výška</span><strong>${fmt(machine.workingHeightM)} m</strong></div><div class="chip"><span>Nosnost koše</span><strong>${esc(capacity)}</strong></div><div class="chip"><span>Boční dosah</span><strong>${fmt(machine.outreachM)} m</strong></div><div class="chip"><span>Hmotnost</span><strong>${fmt(machine.weightKg)} kg</strong></div></div></div></section>
      <section><h2>Technická data</h2><table>${specs}</table></section>${prices}${sourceLinks}<div class="note"><strong>Poznámka:</strong> Tento list shrnuje základní technické parametry vybraného typu plošiny. Finální rozsah pronájmu a termín budou potvrzeny půjčovnou Zeppelin CZ.</div>
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
    if (!machine) return;
    ensureOfferPreviewStyles();
    closeOfferPreview();

    const host = document.createElement("div");
    host.id = "offerPreviewHost";
    host.className = "offer-preview-host";
    host.innerHTML = '<div class="offer-preview-bar"><strong>PDF nabídka: '
      + esc(machine.manufacturer) + ' ' + esc(machine.model)
      + '</strong><div class="offer-preview-actions">'
      + '<button class="primary-button" type="button" data-print-offer-preview>Uložit jako PDF</button>'
      + '<button class="secondary-button" type="button" data-close-offer-preview>Zavřít náhled</button>'
      + '</div></div><iframe class="offer-preview-frame" title="PDF nabídka"></iframe>';
    document.body.appendChild(host);

    const frame = host.querySelector("iframe");
    frame.srcdoc = offerHtml(machine);
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
        ${priceBlock(machine)}
        ${matchDeltaBlock(machine, requestedFilters)}
        <div class="spec-panel">
          <h4>Technické údaje</h4>
          <div class="spec-row"><span>Pohon</span><strong>${esc(machine.drive || "Neuvedeno")}</strong></div>
          <div class="spec-row"><span>Délka</span><strong>${fmt(machine.dimensions?.lengthM)} m</strong></div>
          <div class="spec-row"><span>Šířka</span><strong>${fmt(machine.dimensions?.widthM)} m</strong></div>
          <div class="spec-row"><span>Výška</span><strong>${fmt(machine.dimensions?.heightM)} m</strong></div>
          <div class="spec-row"><span>Rozměr koše</span><strong>${esc(machine.platformText || "Neuvedeno")}</strong></div>
          <div class="spec-row"><span>Náklon</span><strong>${esc(machine.maxChassisTiltText || "Neuvedeno")}</strong></div>
        </div>
        <div class="machine-actions">
          <a class="link-button primary" target="_blank" rel="noopener" href="${esc(machine.sourceUrl || "#")}">Zeppelin.cz ↗</a>
          ${documentButton}
          <button class="link-button secondary" type="button" data-offer-pdf="${esc(machine.id)}">PDF nabídka</button>
        </div>
      </div>
    </article>`;
  }

  function render(list, title, description, customHtml = "", context = {}) {
    el("resultsSection").classList.remove("hidden");
    el("resultsStatus").textContent = customHtml ? "Chytré vyhledávání" : `${list.length} výsledků`;
    el("resultsTitle").textContent = title;
    el("resultsDescription").textContent = description;
    el("resultsGrid").innerHTML = customHtml || (list.length
      ? list.map((machine, index) => machineCard(machine, index, context.filters || {})).join("")
      : `<div class="empty">Nebyla nalezena odpovídající plošina.</div>`);
    el("resultsSection").scrollIntoView({ behavior: "smooth" });
  }

  function runSearch() {
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

    render(
      list.sort((a, b) => (a.workingHeightM || 999) - (b.workingHeightM || 999)),
      "Výsledky chytrého hledání",
      `Dotaz: ${raw}`
    );
  }

  function init() {
    machines = (window.MACHINE_CATALOG?.machines || []).filter(machine => machine.active !== false);
    renderCategories();
    setSelectedCategory(null);

    el("categoryGrid").addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (button) chooseCategory(button.dataset.category);
    });
    el("showAllButton").addEventListener("click", () => {
      setSelectedCategory(null);
      runSearch();
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
