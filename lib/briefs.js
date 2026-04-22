import fs from 'node:fs';
import path from 'node:path';

// Minimal YAML-like frontmatter parser — supports key: value, quoted strings,
// and inline arrays [a, b, c]. Good enough for brief metadata; we don't need
// nested structures. Intentionally self-contained to avoid a YAML dependency.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, yaml, body] = match;
  const data = {};
  for (const line of yaml.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
      value = value.slice(1, -1);
    } else if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      value = inner.length === 0
        ? []
        : inner.split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
    }
    data[key] = value;
  }
  return { data, body };
}

const BRIEFS_DIR = path.join(process.cwd(), 'content', 'briefs');

function readBriefFile(filename) {
  const full = path.join(BRIEFS_DIR, filename);
  const raw = fs.readFileSync(full, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  return {
    slug: data.slug || filename.replace(/\.md$/, ''),
    title: data.title || '',
    author: data.author || '',
    author_url: data.author_url || null,
    date: data.date || '',
    event_tags: Array.isArray(data.event_tags) ? data.event_tags : [],
    abstract: data.abstract || '',
    status: data.status || 'draft',
    body,
  };
}

export function getAllBriefs() {
  if (!fs.existsSync(BRIEFS_DIR)) return [];
  const files = fs.readdirSync(BRIEFS_DIR).filter((f) => f.endsWith('.md'));
  const briefs = files.map(readBriefFile);
  briefs.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return briefs;
}

export function getBriefBySlug(slug) {
  return getAllBriefs().find((b) => b.slug === slug) || null;
}
