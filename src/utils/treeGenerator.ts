import type { FileOperation } from '../models/FileOperation';
import path from 'path';

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  isDirectory: boolean;
}

export class TreeGenerator {
  static generateTree(operations: FileOperation[], rootPath: string): string {
    const root = this.buildTreeStructure(operations, rootPath);
    return this.renderTree(root, '', true);
  }

  private static buildTreeStructure(operations: FileOperation[], rootPath: string): TreeNode {
    const outputRoot = path.join(path.dirname(rootPath), 'icons');
    const root: TreeNode = {
      name: 'icons',
      path: outputRoot,
      children: new Map(),
      isDirectory: true,
    };

    for (const operation of operations) {
      const relativePath = path.relative(outputRoot, operation.newPath);
      const parts = relativePath.split(path.sep);

      let currentNode = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;

        if (!currentNode.children.has(part)) {
          currentNode.children.set(part, {
            name: part,
            path: path.join(currentNode.path, part),
            children: new Map(),
            isDirectory: !isLast || operation.type === 'directory',
          });
        }

        currentNode = currentNode.children.get(part)!;
      }
    }

    return root;
  }

  private static renderTree(node: TreeNode, prefix: string, isRoot: boolean): string {
    let result = '';

    if (isRoot) {
      result += `${node.name}/\n`;
    }

    const entries = Array.from(node.children.entries()).sort(([a], [b]) => a.localeCompare(b));
    const totalEntries = entries.length;

    entries.forEach(([_, childNode], index) => {
      const isLast = index === totalEntries - 1;
      const connector = isLast ? '└── ' : '├── ';
      const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');

      const displayName = childNode.isDirectory ? `${childNode.name}/` : childNode.name;
      result += `${prefix}${connector}${displayName}\n`;

      if (childNode.children.size > 0) {
        result += this.renderTree(childNode, childPrefix, false);
      }
    });

    return result;
  }
}
