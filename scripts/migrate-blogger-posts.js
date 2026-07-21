/**
 * One-time (re-runnable) migration: Blogger feed.atom → HTML posts + local images.
 * Usage: node scripts/migrate-blogger-posts.mjs
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const FEED = path.join(ROOT, 'Blogger', 'Blogs', 'Blog with codes', 'feed.atom');
const POSTS_DIR = path.join(ROOT, 'public', 'content', 'posts');
const ASSETS_DIR = path.join(ROOT, 'public', 'assets', 'blog');
const INDEX_PATH = path.join(POSTS_DIR, 'index.json');

const MIN_CONTENT_LEN = 500;
const JUNK_TITLE_EXACT = new Set([
  'donot delete, application configuration for theme',
  'notes',
  'notes for project',
]);
const JUNK_TITLE_PREFIXES = ['donot delete'];

/** Manual category + tags by normalized title */
const TAXONOMY = {
  'c# important questions': { category: 'interview', tags: ['csharp', 'dotnet'] },
  'learn all about functions in javascript': { category: 'javascript', tags: ['functions'] },
  'object oriented programming language': { category: 'csharp', tags: ['oop'] },
  'working with json in sql server': { category: 'sql', tags: ['json', 'sql-server'] },
  'interview question': { category: 'interview', tags: ['csharp'] },
  'express js': { category: 'nodejs', tags: ['express'] },
  'understanding of application insights': { category: 'azure', tags: ['monitoring', 'app-insights'] },
  sms: { category: 'general', tags: ['sms', 'integrations'] },
  'vue js': { category: 'vue', tags: ['frontend'] },
  'important commands': { category: 'devops', tags: ['cli', 'tools'] },
  'solid principles in c#': { category: 'csharp', tags: ['solid', 'clean-code'] },
  'software architecture': { category: 'architecture', tags: ['design'] },
  'ai vs. machine learning vs. deep learning': { category: 'ai', tags: ['ml', 'fundamentals'] },
  'interview preparation questions': { category: 'interview', tags: ['prep'] },
  'blazor c#': { category: 'csharp', tags: ['blazor'] },
  'ai engineering basic': { category: 'ai', tags: ['llm', 'ai-engineering'] },
  'authorize.net': { category: 'csharp', tags: ['payments', 'authorize-net'] },
  'dev express xaf': { category: 'csharp', tags: ['xaf', 'devexpress'] },
  'dsa road map': { category: 'algorithms', tags: ['dsa'] },
  'jwt token': { category: 'security', tags: ['jwt', 'auth'] },
  'git important commands': { category: 'devops', tags: ['git'] },
  azure: { category: 'azure', tags: ['cloud'] },
  'css animation': { category: 'frontend', tags: ['css'] },
  'javascript different display ways': { category: 'javascript', tags: ['dom'] },
  'angular important points': { category: 'angular', tags: ['notes'] },
  'angular questions': { category: 'angular', tags: ['interview'] },
  'javascript datastructure': { category: 'javascript', tags: ['data-structures'] },
  'entity framework code first approach': { category: 'csharp', tags: ['ef-core'] },
  'smtp implementation in asp.net core': { category: 'csharp', tags: ['smtp', 'email'] },
  'all about arrays': { category: 'algorithms', tags: ['arrays'] },
  angular: { category: 'angular', tags: ['notes'] },
  primevue: { category: 'vue', tags: ['primevue', 'ui'] },
  linq: { category: 'csharp', tags: ['linq'] },
  'intro with c#': { category: 'csharp', tags: ['basics'] },
  'shortcut in programing': { category: 'general', tags: ['tips'] },
  'sql server': { category: 'sql', tags: ['sql-server'] },
  'how to upload class library to nuget package': { category: 'csharp', tags: ['nuget'] },
  'java script important points': { category: 'javascript', tags: ['notes'] },
  react: { category: 'react', tags: ['frontend'] },
  'starting of programming.': { category: 'general', tags: ['basics'] },
  'data structure and algorithms': { category: 'algorithms', tags: ['dsa'] },
  'send file over restfull apis': { category: 'csharp', tags: ['api', 'rest'] },
  'design pattern': { category: 'architecture', tags: ['design-patterns'] },
  fhir: { category: 'general', tags: ['fhir', 'healthcare'] },
  'integration testing': { category: 'testing', tags: ['qa'] },
  'working with dacpac': { category: 'sql', tags: ['dacpac', 'sql-server'] },
};

function unescapeXml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/gi, ' ');
}

function normalizeTitle(title) {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

function slugify(title) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/c#/gi, 'csharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'untitled';
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFrom(html) {
  const text = stripTags(html);
  if (text.length <= 180) return text;
  return text.slice(0, 177).trimEnd() + '…';
}

function readingTimeFrom(html) {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min`;
}

function isJunk(title, contentHtml) {
  const norm = normalizeTitle(title);
  if (!norm) return true;
  if (JUNK_TITLE_EXACT.has(norm)) return true;
  if (JUNK_TITLE_PREFIXES.some((p) => norm.startsWith(p))) return true;
  if (contentHtml.length < MIN_CONTENT_LEN) return true;
  const textLen = stripTags(contentHtml).length;
  if (textLen < 120) return true;
  return false;
}

function taxonomyFor(title) {
  const key = normalizeTitle(title);
  return TAXONOMY[key] || { category: 'general', tags: [] };
}

function extFromUrl(url, contentType) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const m = pathname.match(/\.(jpe?g|png|gif|webp|svg|bmp|avif)(?:$|\?)/i);
    if (m) return m[1].toLowerCase().replace('jpeg', 'jpg');
  } catch {
    /* ignore */
  }
  if (contentType) {
    if (contentType.includes('png')) return 'png';
    if (contentType.includes('webp')) return 'webp';
    if (contentType.includes('gif')) return 'gif';
    if (contentType.includes('svg')) return 'svg';
    if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  }
  return 'jpg';
}

function collectImageUrls(html) {
  const urls = new Set();
  for (const m of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    urls.add(m[1]);
  }
  for (const m of html.matchAll(/url\((['"]?)(https?:\/\/[^)'"]+)\1\)/gi)) {
    urls.add(m[2]);
  }
  return [...urls];
}

/** Word-paste file:// images are not in Takeout — drop broken <img> tags. */
function stripUnreachableImages(html) {
  return html.replace(/<img\b[^>]*\bsrc=["']file:[^"']*["'][^>]*>/gi, '');
}

function download(url) {
  return new Promise((resolve, reject) => {
    const doReq = (current, redirects = 0) => {
      if (redirects > 5) {
        reject(new Error(`Too many redirects: ${url}`));
        return;
      }
      const lib = current.startsWith('https') ? https : http;
      const req = lib.get(
        current,
        {
          headers: {
            'User-Agent': 'BlogWithCodes-migrator/1.0',
            Accept: 'image/*,*/*',
          },
          timeout: 60000,
        },
        (res) => {
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
            const next = new URL(res.headers.location, current).href;
            res.resume();
            doReq(next, redirects + 1);
            return;
          }
          if (res.statusCode !== 200) {
            res.resume();
            reject(new Error(`HTTP ${res.statusCode} for ${current}`));
            return;
          }
          const chunks = [];
          res.on('data', (c) => chunks.push(c));
          res.on('end', () => {
            resolve({
              buffer: Buffer.concat(chunks),
              contentType: res.headers['content-type'] || '',
            });
          });
        },
      );
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Timeout: ${current}`));
      });
    };
    doReq(url);
  });
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

function sanitizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+=["'][^"']*["']/gi, '')
    .replace(/\son\w+=\{[^}]*\}/gi, '');
}

function parseFeed(text) {
  const entries = [...text.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  const posts = [];
  for (const e of entries) {
    const type = (e.match(/<blogger:type>(.*?)<\/blogger:type>/) || [])[1];
    if (type !== 'POST') continue;
    const status = (e.match(/<blogger:status>(.*?)<\/blogger:status>/) || [])[1] || '';
    const title = unescapeXml(((e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim());
    const published = (e.match(/<published>(.*?)<\/published>/) || [])[1] || '';
    const updated = (e.match(/<updated>(.*?)<\/updated>/) || [])[1] || '';
    const contentRaw = (e.match(/<content[^>]*>([\s\S]*?)<\/content>/) || [])[1] || '';
    const contentHtml = stripUnreachableImages(sanitizeHtml(unescapeXml(contentRaw)));
    posts.push({ status, title, published, updated, contentHtml });
  }
  return posts;
}

async function main() {
  if (!fs.existsSync(FEED)) {
    console.error('Feed not found:', FEED);
    process.exit(1);
  }

  const feedText = fs.readFileSync(FEED, 'utf8');
  const rawPosts = parseFeed(feedText);

  const kept = [];
  const skipped = [];
  for (const p of rawPosts) {
    if (p.status !== 'LIVE' && p.status !== 'DRAFT') {
      skipped.push({ title: p.title, reason: `status=${p.status}` });
      continue;
    }
    if (isJunk(p.title, p.contentHtml)) {
      skipped.push({ title: p.title || '(empty)', reason: 'junk/empty/internal' });
      continue;
    }
    kept.push(p);
  }

  // Clear previous generated posts (md/html) but keep folder
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  for (const f of fs.readdirSync(POSTS_DIR)) {
    if (f.endsWith('.md') || f.endsWith('.html') || f === 'index.json') {
      fs.unlinkSync(path.join(POSTS_DIR, f));
    }
  }
  // Clean blog assets folder
  fs.rmSync(ASSETS_DIR, { recursive: true, force: true });
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const usedSlugs = new Set();
  const index = [];

  console.log(`Migrating ${kept.length} posts (skipped ${skipped.length})…`);

  for (const post of kept) {
    let slug = slugify(post.title);
    if (usedSlugs.has(slug)) {
      let n = 2;
      while (usedSlugs.has(`${slug}-${n}`)) n++;
      slug = `${slug}-${n}`;
    }
    usedSlugs.add(slug);

    const draft = post.status === 'DRAFT';
    const dateIso = (post.published || post.updated || '').slice(0, 10) || '2020-01-01';
    const { category, tags } = taxonomyFor(post.title);

    const assetDir = path.join(ASSETS_DIR, slug);
    fs.mkdirSync(assetDir, { recursive: true });

    const imageUrls = collectImageUrls(post.contentHtml);
    const urlToLocal = new Map();

    await mapPool(imageUrls, 4, async (imgUrl, idx) => {
      if (!/^https?:\/\//i.test(imgUrl)) return;
      const n = idx + 1;
      try {
        const { buffer, contentType } = await download(imgUrl);
        const ext = extFromUrl(imgUrl, contentType);
        const fileName = `${String(n).padStart(2, '0')}.${ext}`;
        fs.writeFileSync(path.join(assetDir, fileName), buffer);
        urlToLocal.set(imgUrl, `assets/blog/${slug}/${fileName}`);
        process.stdout.write('.');
      } catch (err) {
        console.warn(`\n  ! image failed [${slug}]: ${imgUrl.slice(0, 80)}… (${err.message})`);
      }
    });

    let html = post.contentHtml;
    // Longest URLs first so partial overlaps cannot corrupt replacements
    const remotes = [...urlToLocal.keys()].sort((a, b) => b.length - a.length);
    for (const remote of remotes) {
      html = html.split(remote).join(urlToLocal.get(remote));
    }

    const cover = imageUrls.map((u) => urlToLocal.get(u)).find(Boolean) || '';

    fs.writeFileSync(path.join(POSTS_DIR, `${slug}.html`), html, 'utf8');

    index.push({
      slug,
      title: post.title.trim(),
      excerpt: excerptFrom(html),
      category,
      tags,
      date: dateIso,
      readingTime: readingTimeFrom(html),
      cover,
      ...(draft ? { draft: true } : {}),
    });

    console.log(
      `\n✓ ${draft ? 'DRAFT' : 'LIVE '} ${slug} (${urlToLocal.size}/${imageUrls.length} imgs) → ${category}`,
    );
  }

  // Newest first
  index.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n', 'utf8');

  const report = {
    live: index.filter((p) => !p.draft).length,
    draft: index.filter((p) => p.draft).length,
    skipped,
    categories: [...new Set(index.map((p) => p.category))].sort(),
  };
  fs.writeFileSync(path.join(ROOT, 'agent-tools', 'migrate-report.json'), JSON.stringify(report, null, 2));
  console.log('\nDone.');
  console.log(JSON.stringify({ live: report.live, draft: report.draft, skipped: skipped.length, categories: report.categories }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
