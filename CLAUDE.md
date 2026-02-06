# Claude Code Instructions for InvenioRDM

A research data management (RDM) platform. Multi-repo setup with multiple packages, each with its own webpack.py/manifest configuration.

## Tech Stack

- **Primary**: JavaScript, React, Semantic UI
- **Backend**: Python/Flask with Invenio framework
- **Python Package Manager**: uv (no Pipfile - uses pyproject.toml/uv.lock)
- **JavaScript Package Manager**: pnpm
- **Build System**: webpack/Rspack via pywebpack
- **CLI**: `invenio` (run via `uv run`)
- **Grep** `grep` is an shell ALIAS to `rg`, for full grep flags compatibility, use full path to `/usr/bin/grep`

## Mandatory: Style Guide

You MUST refer to the following style guide: https://inveniordm.docs.cern.ch/community/code/code-style/
Any commit messages MUST follow the following format: https://invenio.readthedocs.io/en/latest/community/contributing/contribution-guide.html#commit-messages

## Development Environment

Ensure `.venv` is set up and activated before running commands.

### Running the Invenio instance

```bash
# Run the full InvenioRDM application (ALWAYS use uv)
uv run invenio run

# Run with specific host/port
uv run invenio run --host 127.0.0.1 --port 5000

# Initialize/setup the application
uv run invenio install

# Start services (database, cache, search, etc.)
uv run invenio services start

# Stop services
uv run invenio services stop

# Interactive Python shell with Invenio context
uv run invenio shell

# Execute a Python file with Invenio context
uv run invenio shell python_file.py

# Webpack asset commands
uv run invenio webpack clean create install
```

### Using uv for Python commands

This instance uses uv for package management (pyproject.toml + uv.lock):
```bash
# Install/sync dependencies
uv sync

# Install specific package
uv add <package>

# Run any invenio command with uv
uv run invenio <command>
```

### Using pnpm for JavaScript

```bash
# Install JavaScript dependencies in assets directory
cd .venv/var/instance/assets
pnpm install

# Run JavaScript build scripts
pnpm run build
pnpm run start
```

### Code Formatting

```bash
# Format Python code
ruff format

# Lint Python code
ruff check

# Format JavaScript (if applicable)
pnpm run lint
```

### Important: Visit 127.0.0.1, not localhost

Due to Content Security Policy (CSP) headers, always use `127.0.0.1` instead of `localhost` when accessing the development server.

### Important: Node.js Version and Package Manager

**ALWAYS use Node v22 and pnpm for JavaScript dependencies. Never use npm.**

To switch to Node v22:
```bash
fnm use 22
```

To verify version:
```bash
node --version  # Should show v22.x.x
```

### Important: Installing Local Forked Packages

To install local forked packages (oarepo forks), use:

```bash
# Install one or more local packages
uv run invenio-cli packages install \
  "$WORKSPACE_ROOT/invenio-assets" \
  "$WORKSPACE_ROOT/invenio-app-rdm" \
  "$WORKSPACE_ROOT/invenio-rdm-records"
```

## Working with Forked Packages

The Invenio ecosystem packages are maintained in `${WORKSPACE_ROOT}`:

### Core Packages

- **invenio-assets** - Asset management, webpack configuration, and pywebpack integration
- **invenio-app-rdm** - Main InvenioRDM application blueprint
- **invenio-rdm-records** - RDM record management

### Other Packages

- **invenio-communities** - Community management
- **invenio-administration** - Admin interface
- **file-management-dialog** - File upload components
- **eslint-config-invenio** - ESLint configuration

## Migration Context (React 16 → React 19)

Current work involves migrating from React 16 to React 19.

### Key Principle: Dependency Management via webpack.py

**CRITICAL**: All JavaScript/React dependency management MUST go through `webpack.py` files using `pywebpack`. Do NOT manually create or modify `package.json` files directly.

The build workflow:
1. Each package defines dependencies in its `webpack.py` file via `WebpackBundle(dependencies={...})`
2. `pywebpack` collects and merges all webpack.py bundle dependencies
3. Generates a single `package.json` in the assets build directory
4. Runs `pnpm install` based on the generated `package.json`

### React Development Guidelines

Based on [InvenioRDM React Best Practices](https://inveniordm.docs.cern.ch/community/code/best-practices/react/):

- Use React for complex applications with state management needs
- Use VanillaJS or jQuery for small snippets in Jinja templates
- Use `Overridable` component wrapper to allow customization
- Explicitly pass props (avoid `{...this.props}` spreading)
- Follow functional component and hooks patterns

### CSS/JavaScript Guidelines

- Use existing Semantic UI components when possible
- Avoid custom CSS unless absolutely necessary
- Avoid `!important` as it makes overriding difficult
- Use semantic class selectors: `.invenio-rdm [component-name] .element`

## Important Notes

- **ALWAYS use `uv run invenio` to run Python commands** and **`pnpm` for JavaScript** - this is a uv + pnpm managed instance
- No Pipfile - uses pyproject.toml + uv.lock for Python dependencies
- Always ask for instructions if unsure
- Use relative paths from workspace root when referencing files
- Respect git state - check before making changes
- For development issues, consult the [troubleshooting guide](https://inveniordm.docs.cern.ch/install/troubleshoot/)
- For internal architecture, see [maintenance documentation](https://inveniordm.docs.cern.ch/maintenance/internals/)
