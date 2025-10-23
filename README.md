# Azure Icons

Wraps the publicly-accessible [Azure Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/) collection for access via CDN. Uniformly-named Azure service icons optimized for CDN delivery. All icons are renamed to kebab-case for consistent, predictable URLs.

## Using Icons from CDN

Access any Azure icon via jsdelivr CDN:

```html
<!-- General pattern -->
<img
  src="https://cdn.jsdelivr.net/gh/barrcodes/azure-icons@main/icons/<category>/<icon-name>.svg"
  alt="Icon"
/>

<!-- Examples -->
<img
  src="https://cdn.jsdelivr.net/gh/barrcodes/azure-icons@main/icons/ai-machine-learning/batch-ai.svg"
  alt="Batch AI"
/>
<img
  src="https://cdn.jsdelivr.net/gh/barrcodes/azure-icons@main/icons/compute/virtual-machines.svg"
  alt="Virtual Machines"
/>
<img
  src="https://cdn.jsdelivr.net/gh/barrcodes/azure-icons@main/icons/databases/cosmos-db.svg"
  alt="Cosmos DB"
/>
```

## Updating Icons

To update icons with the latest versions from Microsoft:

### 1. Download Icons

Download the latest Azure icon set from Microsoft Learn:

**[Download Azure Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/)**

Extract the downloaded archive to the project root as `Azure_Public_Service_Icons/`.

### 2. Run the Renamer CLI

```bash
# Preview changes
bun run dry-run

# Apply transformations
bun run cli
```

### 3. Commit and Push

```bash
git add azure-public-service-icons/
git commit -m "Update Azure icons"
git push
```

The icons will be automatically available via jsdelivr CDN within minutes.

## Icon Naming Convention

The CLI transforms all icons to follow a consistent kebab-case naming pattern:

### Folders

- Converted to kebab-case
- Special characters removed
- Lowercase

**Examples:**

- `ai + machine learning` → `ai-machine-learning`
- `hybrid + multicloud` → `hybrid-multicloud`
- `App Services` → `app-services`

### Files

- Unnecessary prefixes removed (e.g., `00028-icon-service-`)
- Converted to kebab-case
- Lowercase

**Examples:**

- `00028-icon-service-Batch-AI.svg` → `batch-ai.svg`
- `10045-icon-service-Notification-Hubs.svg` → `notification-hubs.svg`
- `App-Service-Domains.svg` → `app-service-domains.svg`

## CLI Tool

### Installation

```bash
bun install
```

### Usage

```bash
# Preview changes (dry run with ASCII tree)
bun run dry-run

# Apply changes
bun run cli

# Custom directory
bun run src/cli.ts /path/to/directory --dry-run
```

### Options

```
Usage: azure-icons-renamer [options] [directory]

Arguments:
  directory      Directory to process (default: "Azure_Public_Service_Icons")

Options:
  -d, --dry-run  Preview changes without applying them
  -h, --help     Display help
```

## Project Structure

```
├── azure-public-service-icons/   # Renamed icons (committed)
├── src/
│   ├── cli.ts                    # CLI entry point
│   ├── models/
│   │   └── FileOperation.ts      # Data models
│   ├── services/
│   │   └── FileRenamer.ts        # Renaming logic
│   └── utils/
│       ├── nameTransformer.ts    # Name transformation
│       └── treeGenerator.ts      # ASCII tree display
└── package.json
```

## Terms of Use

These icons are provided by Microsoft and are subject to Microsoft's terms of use.

**[Microsoft Azure Icons - Terms of Use](https://learn.microsoft.com/en-us/azure/architecture/icons/)**

Please review Microsoft's official documentation for:

- Usage guidelines
- Attribution requirements
- Licensing restrictions
- Trademark information

## License

The icons themselves are owned by Microsoft. This repository only provides tooling for normalization and CDN hosting.

See Microsoft's official terms of use for icon licensing details.
