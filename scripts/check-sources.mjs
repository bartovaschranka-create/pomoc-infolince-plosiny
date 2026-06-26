// machines.js je určen primárně pro prohlížeč, proto ho načteme bezpečně přes vm.
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../data/machines.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const machines = sandbox.window.MACHINE_CATALOG.machines;

let failures = 0;
for (const machine of machines) {
  try {
    const response = await fetch(machine.sourceUrl, {
      method: "GET",
      headers: { "User-Agent": "Zeppelin-Plosiny-Poradce/0.1 source-check" },
      redirect: "follow"
    });
    const ok = response.ok;
    console.log(`${ok ? "OK " : "ERR"} ${response.status} ${machine.manufacturer} ${machine.model} — ${machine.sourceUrl}`);
    if (!ok) failures += 1;
  } catch (error) {
    failures += 1;
    console.error(`ERR --- ${machine.manufacturer} ${machine.model} — ${error.message}`);
  }
}

if (failures) {
  console.error(`\nNeplatné nebo nedostupné zdroje: ${failures}`);
  process.exitCode = 1;
} else {
  console.log(`\nVšech ${machines.length} produktových odkazů odpovědělo úspěšně.`);
}
