import {
  copyFile,
  mkdir,
} from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

await mkdir(dist, {
  recursive: true,
});

for (const file of [
  'index.html',
  'styles.css',
]) {
  await copyFile(
    path.join(root, 'src', file),
    path.join(dist, file),
  );
}

console.log('Static desktop assets copied.');