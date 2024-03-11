import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';

const currentFileUrl = new URL(import.meta.url);
const currentDir = dirname(currentFileUrl.pathname);
const filePath = resolve(currentDir, '../lib/briv-new.json');

export const characters = JSON.parse(await readFile(filePath, 'utf-8'));