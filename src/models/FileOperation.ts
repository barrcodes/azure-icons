export interface FileOperation {
  originalPath: string;
  newPath: string;
  type: 'file' | 'directory';
}

export interface RenameResult {
  operations: FileOperation[];
  stats: {
    filesRenamed: number;
    directoriesRenamed: number;
    totalOperations: number;
  };
}
