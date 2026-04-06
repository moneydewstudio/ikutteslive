// Post-build script to add .assetsignore to dist/ directory
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Add .assetsignore to dist/ root to suppress Cloudflare warning
const assetsignorePath = join(rootDir, 'dist', '.assetsignore');
writeFileSync(assetsignorePath, '_worker.js\n', 'utf-8');

console.log('✅ Added .assetsignore to dist/ directory');
