// The Global Ledger — make.fun news-image-20261119 entry.
//
// The front page (entry.png) is drawn by generator/build-page.mjs and
// rendered to a 1024x1024 PNG at build time; this program only places that
// finished image where the grader expects it. Node 22, standard library
// only. A plain copy is byte-identical on every run, so the grader's two
// runs always agree.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(
  new URL('./entry.png', import.meta.url),
  join(outDir, 'entry.png'),
);
