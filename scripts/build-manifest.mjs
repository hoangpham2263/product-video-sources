// Rebuilds manifest.json from the folders: products/, models/ and videos/, one subfolder per group. A group keeps the
// enabled value it had (new groups start on), so switching a group off in manifest.json survives the next rebuild.
//   node scripts/build-manifest.mjs
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const KINDS = { products: /\.(png|jpe?g|webp)$/i, models: /\.(png|jpe?g|webp)$/i, videos: /\.(mp4|mov|webm)$/i };
const old = existsSync("manifest.json") ? JSON.parse(readFileSync("manifest.json", "utf8")) : { groups: [] };
const wasEnabled = new Map(old.groups.map((g) => [`${g.kind}/${g.name}`, g.enabled !== false]));
const dirs = (path) => (existsSync(path) ? readdirSync(path, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort((a, b) => a.localeCompare(b, "vi")) : []);

const groups = [];
for (const [kind, pattern] of Object.entries(KINDS)) {
  for (const name of dirs(kind)) {
    const folder = join(kind, name);
    const files = readdirSync(folder).filter((f) => pattern.test(f)).sort().map((f) => {
      const bytes = readFileSync(join(folder, f));
      return { name: f, size: statSync(join(folder, f)).size, md5: createHash("md5").update(bytes).digest("hex") };
    });
    const key = `${kind}/${name.normalize("NFC")}`;
    groups.push({ kind, name: name.normalize("NFC"), enabled: wasEnabled.has(key) ? wasEnabled.get(key) : true, files });
  }
}
writeFileSync("manifest.json", JSON.stringify({ schema_version: 1, groups }, null, 1) + "\n");
console.log(groups.map((g) => `${g.kind}/${g.name}: ${g.files.length}`).join("\n") || "no groups");
