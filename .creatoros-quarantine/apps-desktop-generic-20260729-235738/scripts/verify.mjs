import {
  access,
  readFile,
} from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const required = [
  'dist/main.js',
  'dist/preload.js',
  'dist/renderer.js',
  'dist/index.html',
  'dist/styles.css',
];

for (const file of required) {
  await access(path.join(root, file));
}

const html = await readFile(
  path.join(root, 'dist/index.html'),
  'utf8',
);

const checks = [
  'CreatorOS Enterprise Command Center',
  'Project Builder',
  'AI Workspace',
  'Trust & Security',
  'Operations',
];

for (const check of checks) {
  if (!html.includes(check)) {
    throw new Error(
      `Desktop verification failed: ${check}`,
    );
  }
}

console.log('DESKTOP VERIFICATION: 5/5 PASSED');