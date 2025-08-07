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
  category: string;
}

export interface JsonLineTool extends BaseMeta {
  [key: string]: unknown;
  category: string;
}

export interface CategoryTool extends BaseMeta {
  category: string;
  tools: Array<{
    name: string;
    url: string;
    description: string;
  }>;
}
