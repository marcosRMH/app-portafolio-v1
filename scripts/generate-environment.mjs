import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'src', 'environments', 'environment.ts');

function readFromEnvFile() {
  try {
    const content = readFileSync(join(root, '.env'), 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*URL_BASE_PORTFOLIO\s*=\s*(.+?)\s*$/);
      if (match) return match[1].replace(/^["']|["']$/g, '');
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function resolveApiUrl() {
  const fromProcess = process.env.URL_BASE_PORTFOLIO?.trim();
  if (fromProcess) return { apiUrl: fromProcess, source: 'URL_BASE_PORTFOLIO' };

  const fromFile = readFromEnvFile()?.trim();
  if (fromFile) return { apiUrl: fromFile, source: '.env' };

  return { apiUrl: '', source: '' };
}

const { apiUrl: rawApiUrl, source } = resolveApiUrl();
const apiUrl = rawApiUrl.replace(/\/+$/, '');

if (!apiUrl) {
  console.error(
    '\n  No se encontro URL_BASE_PORTFOLIO.\n' +
      '  - En local: agregala al archivo .env.\n' +
      '  - En GitHub Actions: crea la variable PORTFOLIO_API_URL en\n' +
      '    Settings -> Secrets and variables -> Actions -> Variables.\n',
  );
  process.exit(1);
}

mkdirSync(dirname(target), { recursive: true });
writeFileSync(
  target,
  [
    '// Generado por scripts/generate-environment.mjs. No editar a mano ni commitear.',
    'export const environment = {',
    `  apiUrl: '${apiUrl}',`,
    '};',
    '',
  ].join('\n'),
);

console.log(`[environment] origen: ${source}`);
console.log(`[environment] apiUrl: ${apiUrl}`);
console.log(`[environment] escrito en: ${target}`);
