import { writeFileSync, renameSync, openSync, closeSync, fsyncSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

export function atomicWrite(outPath, data, isJson = true) {
  const tmp = `${outPath}.${Date.now()}.tmp`;
  const content = isJson ? JSON.stringify(data, null, 2) : data;

  writeFileSync(tmp, content, 'utf8');
  const fd = openSync(tmp, 'r+');
  fsyncSync(fd);
  closeSync(fd);
  renameSync(tmp, outPath);

  return { sha256: crypto.createHash('sha256').update(content).digest('hex') };
}
