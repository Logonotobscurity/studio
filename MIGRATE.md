# ⚙️ BULLETPROOF CONVERTER PROMPT  
*Handles 150+ tools per TXT without hard-coding names, folders, or schema. Atomic, parallel-safe, idempotent.*

---

### 🎯 ONE-SENTENCE BRIEF  
> Convert **any number of tools** inside `./data/*.TXT` (150+ each) into **strict JSON** with **dynamic schema inference**, **atomic writes**, and **TypeScript interfaces**, **regardless of file names or folder layout**.

---

### 1️⃣ DISCOVERY PHASE (no assumptions)
```bash
# auto-find all .TXT files
node scripts/convert-tools.js
```
Script will:
- Glob `data/**/*.TXT` (case-insensitive)  
- Count ≥150 lines per file → **fail fast** if under  
- Infer schema from **first 5 lines** (URL vs JSON vs category header)

---

### 2️⃣ DYNAMIC SCHEMA INFERENCE
| Raw Pattern | Auto-Schema | Example Output |
|-------------|-------------|----------------|
| Plain URL list | `UrlTool` | `{id:"u-000",url:"https://...",desc:"",tags:["url"]}` |
| JSON lines | `JsonLineTool` | `{...line}` |
| Category headers | `CategoryTool` | `{category:"API",tools:[...]}` |

---

### 3️⃣ ATOMIC WRITE FLOW
```js
// scripts/utils/atomicWrite.js
import { writeFileSync, renameSync, openSync, closeSync, fsyncSync } from 'fs';
import crypto from 'crypto';

export function atomicWrite(outPath, data) {
  const tmp = `${outPath}.${Date.now()}.tmp`;
  const json = JSON.stringify(data, null, 2);

  writeFileSync(tmp, json, 'utf8');
  const fd = openSync(tmp, 'r+');
  fsyncSync(fd);
  closeSync(fd);
  renameSync(tmp, outPath);

  return { sha256: crypto.createHash('sha256').update(json).digest('hex') };
}
```

---

### 4️⃣ LOCKFILE + IDEMPOTENCY
```js
// scripts/convert-tools.js (lockfile)
import { existsSync, writeFileSync, unlinkSync } from 'fs';
const LOCK = './data/.convert.lock';
if (existsSync(LOCK)) throw new Error('Conversion locked');
writeFileSync(LOCK, process.pid.toString());
process.on('exit', () => existsSync(LOCK) && unlinkSync(LOCK));
```

---

### 5️⃣ TYPE GENERATION
Auto-create `./src/lib/tool-schemas.ts`:
```ts
// Auto-generated, never hand-edited
export interface BaseMeta {
  _schema: string;
  _sourceFile: string;
  _convertedAt: string;
}

export interface UrlTool extends BaseMeta {
  id: string;
  url: string;
  description?: string;
  tags: string[];
}

export interface JsonLineTool extends BaseMeta {
  [key: string]: unknown;
}

export interface CategoryTool extends BaseMeta {
  category: string;
  tools: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}
```

---

### 6️⃣ EXECUTION REPORT
```json
// scripts/convert-report.json
{
  "timestamp": "2024-08-08T12:34:56Z",
  "files": {
    "data/growth-hacking.TXT": {
      "schema": "UrlTool",
      "count": 187,
      "sha256": "a1b2c3..."
    },
    "data/startup-journey.TXT": {
      "schema": "CategoryTool",
      "count": 152,
      "sha256": "d4e5f6..."
    },
    "data/developer-journey.TXT": {
      "schema": "JsonLineTool",
      "count": 203,
      "sha256": "g7h8i9..."
    }
  }
}
```

---

### 7️⃣ VALIDATION CHECKLIST
- [ ] ≥150 tools detected per TXT  
- [ ] Atomic write confirmed via SHA256  
- [ ] Lockfile auto-cleaned on crash  
- [ ] TypeScript interfaces regenerated  
- [ ] Report always overwritten  

---

### 🚀 USAGE
1. Place any `.TXT` files in `./data/` (150+ lines)  
2. Run `node scripts/convert-tools.js`  
3. Import from `./src/data/*.json` + `./src/lib/tool-schemas.ts`  

**Zero hard-coding, zero conflicts.**