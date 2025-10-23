import { readdir, rename, mkdir } from 'fs/promises';
import path from 'path';
import type { FileOperation, RenameResult } from '../models/FileOperation';
import { NameTransformer } from '../utils/nameTransformer';

export class FileRenamer {
  private operations: FileOperation[] = [];

  async scanDirectory(rootPath: string): Promise<FileOperation[]> {
    this.operations = [];
    await this.scanRecursive(rootPath, rootPath);
    return this.operations;
  }

  private async scanRecursive(currentPath: string, rootPath: string): Promise<void> {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const newPath = this.transformFullPath(fullPath, rootPath);

      if (entry.isDirectory()) {
        if (newPath !== fullPath) {
          this.operations.push({
            originalPath: fullPath,
            newPath,
            type: 'directory',
          });
        }

        await this.scanRecursive(fullPath, rootPath);
      } else if (entry.isFile()) {
        if (newPath !== fullPath) {
          this.operations.push({
            originalPath: fullPath,
            newPath,
            type: 'file',
          });
        }
      }
    }
  }

  private transformFullPath(fullPath: string, rootPath: string): string {
    const relativePath = path.relative(rootPath, fullPath);
    const segments = relativePath.split(path.sep);

    const transformedSegments = segments.map((segment, index) => {
      const isLastSegment = index === segments.length - 1;
      const isFile = isLastSegment && segment.includes('.');

      return isFile
        ? NameTransformer.transformFileName(segment)
        : NameTransformer.transformDirectoryName(segment);
    });

    const newRootPath = path.join(path.dirname(rootPath), 'icons');

    return path.join(newRootPath, ...transformedSegments);
  }

  async executeRename(dryRun: boolean = false): Promise<RenameResult> {
    if (dryRun) {
      return this.generateResult();
    }

    const dirOperations = this.operations.filter(op => op.type === 'directory');
    const fileOperations = this.operations.filter(op => op.type === 'file');

    dirOperations.sort((a, b) => b.originalPath.length - a.originalPath.length);

    const createdDirs = new Set<string>();

    for (const operation of dirOperations) {
      const newDir = operation.newPath;
      if (!createdDirs.has(newDir)) {
        await mkdir(newDir, { recursive: true });
        createdDirs.add(newDir);
      }
    }

    for (const operation of fileOperations) {
      const newDir = path.dirname(operation.newPath);
      if (!createdDirs.has(newDir)) {
        await mkdir(newDir, { recursive: true });
        createdDirs.add(newDir);
      }
      await rename(operation.originalPath, operation.newPath);
    }

    for (const operation of [...dirOperations].reverse()) {
      try {
        const entries = await readdir(operation.originalPath);
        if (entries.length === 0) {
          await Bun.file(operation.originalPath).exists();
        }
      } catch {
        // Directory already removed or doesn't exist
      }
    }

    return this.generateResult();
  }

  private generateResult(): RenameResult {
    const filesRenamed = this.operations.filter(op => op.type === 'file').length;
    const directoriesRenamed = this.operations.filter(op => op.type === 'directory').length;

    return {
      operations: this.operations,
      stats: {
        filesRenamed,
        directoriesRenamed,
        totalOperations: this.operations.length,
      },
    };
  }
}
