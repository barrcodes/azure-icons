#!/usr/bin/env bun

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { FileRenamer } from './services/FileRenamer';
import { TreeGenerator } from './utils/treeGenerator';

const program = new Command();

program
  .name('azure-icons-renamer')
  .description('Uniformly rename Azure icon files to kebab-case')
  .version('1.0.0')
  .argument('[directory]', 'Directory to process', 'Azure_Public_Service_Icons')
  .option('-d, --dry-run', 'Preview changes without applying them')
  .action(async (directory: string, options: { dryRun?: boolean }) => {
    try {
      const targetPath = path.resolve(process.cwd(), directory);

      console.log(chalk.blue.bold('\n🔍 Scanning directory:'), chalk.cyan(targetPath));

      const renamer = new FileRenamer();
      await renamer.scanDirectory(targetPath);
      const result = await renamer.executeRename(options.dryRun ?? false);

      if (options.dryRun) {
        console.log(chalk.yellow.bold('\n📋 DRY RUN - No changes will be made\n'));
        console.log(chalk.green.bold('Proposed file structure:\n'));
        const tree = TreeGenerator.generateTree(result.operations, targetPath);
        console.log(tree);
      }

      console.log(chalk.green.bold('\n📊 Summary:'));
      console.log(chalk.white(`  Files to rename:       ${chalk.cyan(result.stats.filesRenamed)}`));
      console.log(chalk.white(`  Directories to rename: ${chalk.cyan(result.stats.directoriesRenamed)}`));
      console.log(chalk.white(`  Total operations:      ${chalk.cyan(result.stats.totalOperations)}`));

      if (!options.dryRun && result.stats.totalOperations > 0) {
        console.log(chalk.green.bold('\n✅ Rename completed successfully!\n'));
      } else if (!options.dryRun && result.stats.totalOperations === 0) {
        console.log(chalk.yellow.bold('\n⚠️  No files need renaming.\n'));
      } else if (options.dryRun) {
        console.log(chalk.blue.bold('\n💡 Run without --dry-run to apply these changes.\n'));
      }
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();
