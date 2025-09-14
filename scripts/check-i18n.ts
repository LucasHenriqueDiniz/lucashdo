import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const messagesDir = path.join(process.cwd(), 'src/messages');

function flatten(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      keys.push(...flatten(value as Record<string, unknown>, newKey));
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

function rg(args: string[]) {
  return spawnSync('rg', args, { encoding: 'utf8' });
}

function hasFullKey(key: string): boolean {
  const result = rg(['-q', '-F', key, '--glob', '!src/messages/**']);
  return result.status === 0;
}

function hasWithNamespace(namespace: string, key: string): boolean {
  const result = rg(['-l', '-F', key, '--glob', '!src/messages/**']);
  if (result.status !== 0 || !result.stdout.trim()) return false;
  const files = result.stdout.trim().split('\n');
  for (const file of files) {
    const check = rg(['-q', `useTranslations\\(["']${namespace}["']\\)`, file]);
    if (check.status === 0) return true;
  }
  return false;
}

function isKeyUsed(key: string): boolean {
  if (hasFullKey(key)) return true;
  const parts = key.split('.');
  for (let i = parts.length - 1; i >= 1; i--) {
    const ns = parts.slice(0, i).join('.');
    const rest = parts.slice(i).join('.');
    if (hasWithNamespace(ns, rest)) return true;
  }
  return false;
}

const files = readdirSync(messagesDir).filter(f => f.endsWith('.json'));
const allKeys = new Set<string>();
for (const file of files) {
  const json = JSON.parse(readFileSync(path.join(messagesDir, file), 'utf8')) as Record<
    string,
    unknown
  >;
  flatten(json).forEach(k => allKeys.add(k));
}

const unused: string[] = [];
Array.from(allKeys)
  .sort()
  .forEach(key => {
    if (!isKeyUsed(key)) unused.push(key);
  });

if (unused.length) {
  console.log('Unused keys:');
  unused.forEach(k => console.log(`- ${k}`));
  process.exitCode = 1;
} else {
  console.log('No unused keys found.');
}
