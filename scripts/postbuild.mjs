import { copyFileSync, writeFileSync } from 'node:fs';

// GitHub Pages SPA fallback + skip Jekyll processing
copyFileSync('dist/index.html', 'dist/404.html');
writeFileSync('dist/.nojekyll', '');

console.log('Post-build: created 404.html and .nojekyll for GitHub Pages');
