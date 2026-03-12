import { readdir } from 'fs/promises';
import { join } from 'path';

async function walkDir(dir: string, ext: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walkDir(fullPath, ext)));
        } else if (entry.isFile() && entry.name.endsWith(ext)) {
            files.push(fullPath);
        }
    }
    return files;
}

export const loadFiles = async (dirName: string): Promise<string[]> => {
    const basePath = join(process.cwd(), dirName);
    return walkDir(basePath, '.ts');
};
