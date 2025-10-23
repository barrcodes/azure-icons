export class NameTransformer {
  private static readonly FILE_PREFIX_PATTERN = /^\d+-icon-service-/i;

  static toKebabCase(input: string): string {
    return input
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_+]+/g, "-")
      .replace(/[^\w-]/g, "")
      .toLowerCase()
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  static transformFileName(fileName: string): string {
    const extension = fileName.substring(fileName.lastIndexOf("."));
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

    const cleanName = nameWithoutExt.replace(this.FILE_PREFIX_PATTERN, "");

    return this.toKebabCase(cleanName) + extension;
  }

  static transformDirectoryName(dirName: string): string {
    return this.toKebabCase(dirName);
  }
}
