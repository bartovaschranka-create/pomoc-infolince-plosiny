import json
import os
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


BASE = "https://www.zeppelin.cz"
ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "assets" / "images" / "zeppelin-equipment"
OUTPUT = ROOT / "data" / "equipment.js"
DOWNLOAD_IMAGES = False

CATEGORY_SOURCES = [
    ("work-machines", "tracked-excavators", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/pasova-rypadla-a-minirypadla"),
    ("work-machines", "wheeled-excavators", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/kolova-rypadla"),
    ("work-machines", "excavator-attachments", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/prislusenstvi-k-rypadlum-a-minirypadlum"),
    ("work-machines", "wheel-loaders", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/nakladace-a-teleskopicke-manipulatory"),
    ("work-machines", "backhoe-loaders", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/rypadlo-nakladace"),
    ("work-machines", "skid-steer-loaders", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/smykem-rizene-nakladace"),
    ("work-machines", "skid-steer-attachments", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/prislusenstvi-ke-smykovym-nakladacum"),
    ("work-machines", "rollers", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/valce"),
    ("work-machines", "dozers", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/dozery"),
    ("work-machines", "dumpers", "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/dampry-minidampry-a-motorova-kolecka"),
    ("work-machines", "telehandlers", "https://www.zeppelin.cz/pujcovna-stroju/terenni-vysokozdvizne-voziky/terenni-voziky"),
    ("energy", "compressors", "https://www.zeppelin.cz/pujcovna-stroju/mala-mechanizace/kompresory"),
    ("energy", "generators", "https://www.zeppelin.cz/pujcovna-stroju/elektrocentraly-a-osvetlovaci-veze/stacionarni-elektrocentraly"),
    ("energy", "generators", "https://www.zeppelin.cz/pujcovna-stroju/elektrocentraly-a-osvetlovaci-veze/pojizdne-elektrocentraly"),
    ("energy", "light-towers", "https://www.zeppelin.cz/pujcovna-stroju/elektrocentraly-a-osvetlovaci-veze/pojizdne-osvetlovaci-veze"),
    ("energy", "load-banks", "https://www.zeppelin.cz/pujcovna-stroju/elektrocentraly-a-osvetlovaci-veze/odporova-zatez"),
    ("pumps", "pumps", "https://www.zeppelin.cz/pujcovna-stroju/mala-mechanizace/teplovzd-agregaty-vysousece-a-cerpadla"),
    ("other", "trailers", "https://www.zeppelin.cz/pujcovna-stroju/privesy/privesne-voziky"),
    ("other", "containers", "https://www.zeppelin.cz/pujcovna-stroju/kontejnery/skladovaci-a-ulozne-kontejnery"),
    ("other", "small-mechanization", "https://www.zeppelin.cz/pujcovna-stroju/mala-mechanizace/elektricka-kladiva"),
    ("other", "small-mechanization", "https://www.zeppelin.cz/pujcovna-stroju/mala-mechanizace/kotoucove-pily-frezy-a-brusky"),
    ("other", "small-mechanization", "https://www.zeppelin.cz/pujcovna-stroju/mala-mechanizace/stavebni-nivelace"),
    ("other", "ground-protection", "https://www.zeppelin.cz/pujcovna-stroju/roznaseci-desky"),
    ("other", "landscape", "https://www.zeppelin.cz/pujcovna-stroju/krajinarska-a-technicka-udrzba/parezove-frezy-a-mulcovace"),
    ("other", "landscape", "https://www.zeppelin.cz/pujcovna-stroju/krajinarska-a-technicka-udrzba/ryhovace"),
    ("other", "landscape", "https://www.zeppelin.cz/pujcovna-stroju/krajinarska-a-technicka-udrzba/stepkovace-a-stipace"),
    ("other", "compaction", "https://www.zeppelin.cz/pujcovna-stroju/vibracni-a-hutnici-technika/vibracni-desky"),
    ("other", "compaction", "https://www.zeppelin.cz/pujcovna-stroju/vibracni-a-hutnici-technika/ponorne-vibratory-do-betonu"),
    ("other", "compaction", "https://www.zeppelin.cz/pujcovna-stroju/vibracni-a-hutnici-technika/vibracni-pechy"),
    ("other", "compaction", "https://www.zeppelin.cz/pujcovna-stroju/vibracni-a-hutnici-technika/vibracni-valce"),
    ("other", "crushing-screening", "https://www.zeppelin.cz/pujcovna-stroju/drticky-tridicky-a-pasove-dopravniky/mobilni-tridicky"),
    ("other", "crushing-screening", "https://www.zeppelin.cz/pujcovna-stroju/drticky-tridicky-a-pasove-dopravniky/pasove-a-haldovaci-dopravniky"),
    ("other", "crushing-screening", "https://www.zeppelin.cz/pujcovna-stroju/drticky-tridicky-a-pasove-dopravniky/mobilni-drticky"),
    ("other", "cleaning", "https://www.zeppelin.cz/pujcovna-stroju/tlakove-cistice-a-vysavace/tlakove-cistice-a-vysavace"),
    ("other", "scaffolding", "https://www.zeppelin.cz/pujcovna-stroju/pracovni-plosiny-a-leseni/leseni"),
]

STATIC_CATEGORY_ITEMS = {
    "https://www.zeppelin.cz/pujcovna-stroju/stavebni-stroje/pasova-rypadla-a-minirypadla": [
        "cat-3009d", "cat-3018", "cat-3027", "cat-3035", "cat-3035e-cr", "cat-3035e2-cr",
        "cat-303e-cr", "cat-305", "cat-305e2-cr", "cat-308", "cat-310", "cat-312d-lgp",
        "cat-313-gc", "cat-315c-lgp", "cat-316f", "cat-317", "cat-317-oq", "cat-320-gc",
        "cat-320-oq", "cat-326", "cat-326-oq", "cat-326f-ln", "cat-330", "cat-330-oq",
        "cat-336-oq", "cat-340-lre", "cat-340-sb",
    ]
}


def clean(text):
    text = unescape(re.sub(r"<[^>]+>", " ", text or ""))
    return " ".join(text.split())


def slugify(text):
    text = text.lower()
    replacements = str.maketrans("áčďéěíňóřšťúůýž", "acdeeinorstuuyz")
    text = text.translate(replacements)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "item"


def fetch(url):
    request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(request, timeout=18) as response:
        return response.read(), response.headers.get_content_type()


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._href = None
        self._text = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            href = dict(attrs).get("href")
            if href:
                self._href = href
                self._text = []

    def handle_data(self, data):
        if self._href:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag == "a" and self._href:
            self.links.append((clean(" ".join(self._text)), urljoin(BASE, self._href)))
            self._href = None
            self._text = []


class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []

    def handle_starttag(self, tag, attrs):
        if tag != "img":
            return
        attrs = dict(attrs)
        src = attrs.get("src") or attrs.get("data-src") or attrs.get("data-original")
        if src:
            self.images.append({
                "src": urljoin(BASE, src),
                "alt": clean(attrs.get("alt", "")),
                "class": clean(attrs.get("class", "")),
            })


def category_items(source_url):
    items = {}
    try:
        html, _ = fetch(source_url)
    except Exception:
        static_items = STATIC_CATEGORY_ITEMS.get(source_url, [])
        if not static_items:
            raise
        return {
            f"{source_url.rstrip('/')}/{slug}": slug.replace("-", " ").title()
            for slug in static_items
        }
    parser = LinkParser()
    parser.feed(html.decode("utf-8", errors="replace"))
    prefix = source_url.rstrip("/") + "/"
    for text, href in parser.links:
        if not text or not href.startswith(prefix) or href.rstrip("/") == source_url.rstrip("/"):
            continue
        if href.count("/") != prefix.count("/"):
            continue
        if "poptavka" in href or "nase-sluzby" in href:
            continue
        items[href] = text
    return items


def parse_specs(html):
    rows = []
    for match in re.finditer(r"<tr[^>]*>(.*?)</tr>", html, re.S | re.I):
        cells = [clean(cell) for cell in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", match.group(1), re.S | re.I)]
        cells = [cell for cell in cells if cell]
        if len(cells) >= 2:
            rows.append({"label": cells[0], "value": " / ".join(cells[1:])})
    return rows


def best_image(images, title, slug):
    normalized_title = slugify(title).replace("-", "")
    for image in images:
        src = image["src"]
        alt = image["alt"]
        haystack = f"{src} {alt}".lower()
        if "no-img" in haystack or "logotype" in haystack or "dlazdice" in haystack:
            continue
        if normalized_title and normalized_title in slugify(haystack).replace("-", ""):
            return src
        if slug and slug in haystack:
            return src
    for image in images:
        haystack = f"{image['src']} {image['alt']}".lower()
        if "helios_files" in haystack and "no-img" not in haystack and "logotype" not in haystack:
            return image["src"]
    return ""


def download_image(url, item_id):
    if not url:
        return ""
    if not DOWNLOAD_IMAGES:
        return url
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    path = urlparse(url).path
    suffix = Path(path).suffix.lower() or ".webp"
    if suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        suffix = ".webp"
    target = IMAGE_DIR / f"{item_id}{suffix}"
    if not target.exists():
        data, content_type = fetch(url)
        if not content_type.startswith("image/") or len(data) < 100:
            return ""
        target.write_bytes(data)
    return target.relative_to(ROOT).as_posix()


def classify(group, category, title):
    text = slugify(title)
    if category == "wheel-loaders" and any(term in text for term in ["th", "manitou", "teleskop", "telehandler"]):
        return "work-machines", "telehandlers"
    if category == "pumps":
        if any(term in text for term in ["dh", "master", "ohrivac", "vysousec", "agregat"]):
            return "climate", "dehumidifiers"
        if any(term in text for term in ["grindex", "wacker", "cerpad", "ps2"]):
            return "pumps", "pumps"
    return group, category


def detail(url, fallback_title, group, category):
    html_bytes, _ = fetch(url)
    html = html_bytes.decode("utf-8", errors="replace")
    heading = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    title = clean(heading.group(1)) if heading else fallback_title
    title = re.sub(r"^(pásové minirýpadlo|pásové rýpadlo|kolové rýpadlo|elektrocentrála|kompresor)\s+", "", title, flags=re.I).strip() or fallback_title
    item_id = slugify(urlparse(url).path.strip("/").split("/")[-1])
    image_parser = ImageParser()
    image_parser.feed(html)
    image = download_image(best_image(image_parser.images, title, item_id), item_id)
    specs = parse_specs(html)
    final_group, final_category = classify(group, category, title)
    return {
        "id": item_id,
        "group": final_group,
        "category": final_category,
        "title": title,
        "sourceCategory": fallback_title if fallback_title != title else "",
        "sourceUrl": url,
        "image": image,
        "source": "Zeppelin CZ",
        "specs": specs[:12],
        "searchText": clean(" ".join([title, fallback_title, " ".join(f"{row['label']} {row['value']}" for row in specs)])),
    }


def main():
    max_items = int(os.environ.get("MAX_ITEMS", "0") or "0")
    only_category = os.environ.get("ONLY_CATEGORY", "")
    merge_existing = os.environ.get("MERGE_EXISTING") == "1" and OUTPUT.exists()
    jobs = {}
    for group, category, source_url in CATEGORY_SOURCES:
        if only_category and category != only_category:
            continue
        print(f"Category {category}: {source_url}", flush=True)
        try:
            category_links = category_items(source_url)
        except Exception as exc:
            print(f"  ! category failed: {exc}", flush=True)
            continue
        for url, title in category_links.items():
            if url in jobs:
                continue
            jobs[url] = (title, group, category)
            if max_items and len(jobs) >= max_items:
                break
        if max_items and len(jobs) >= max_items:
            break

    seen = {}
    if merge_existing:
        raw = OUTPUT.read_text(encoding="utf-8").strip()
        raw = re.sub(r"^window\.EQUIPMENT_CATALOG\s*=\s*", "", raw).rstrip(";")
        for item in json.loads(raw).get("items", []):
            seen[item["sourceUrl"]] = item
    with ThreadPoolExecutor(max_workers=4) as executor:
        future_map = {
            executor.submit(detail, url, title, group, category): url
            for url, (title, group, category) in jobs.items()
        }
        for future in as_completed(future_map):
            url = future_map[future]
            try:
                item = future.result()
                seen[url] = item
                print(f"  + {item['title']} [{item['group']}/{item['category']}]", flush=True)
            except Exception as exc:
                print(f"  ! {url}: {exc}", flush=True)

    items = sorted(seen.values(), key=lambda item: (item["group"], item["category"], item["title"]))
    OUTPUT.write_text(
        "window.EQUIPMENT_CATALOG = "
        + json.dumps({"items": items}, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    with_images = sum(1 for item in items if item.get("image"))
    print(f"Wrote {len(items)} items to {OUTPUT}", flush=True)
    print(f"Images: {with_images}/{len(items)}", flush=True)


if __name__ == "__main__":
    main()
