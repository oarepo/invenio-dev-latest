# React 19 Migration: InvenioRDM Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Incremental migration from React 16.13.0 to React 19.2.4 using test-migrate-retest approach

**Architecture:**
- **Single merged package.json**: pywebpack collects all dependencies from `webpack.py` files and generates one `package.json`
- **No traditional workspaces**: Dependencies are defined in Python, not multiple `package.json` files

**Tech Stack:**
- React 19.2.4, React DOM 19.2.4
- React Router DOM 6.3.0 → 7.13.0
- React Testing Library 16.2.0

**CRITICAL: Node.js and Package Manager Requirements**

**ALWAYS use Node v22 and pnpm for JavaScript dependencies. Never use npm.**

Before starting any work, verify Node version:
```bash
fnm use 22
node --version  # Should show v22.x.x
```

All operations in this plan assume:
- `pnpm install` for installing dependencies (NOT `npm install`)
- `pnpm test` for running tests (NOT `npm test`)
- `pnpm build` for building (NOT `npm run build`)

**Migration Strategy: TEST → MIGRATE → RETEST**
1. Write tests for functionality that will change
2. Run tests to ensure they pass with React 16
3. Migrate code to React 19
4. Run tests to verify no regression

---

## CRITICAL PREREQUISITES (Phase 0)

**ABSOLUTE REQUIREMENT**: BEFORE any React 19 migration code changes, ALL forks MUST have:

1. **Working `run-js-linter.sh` script** (for linting code quality)
2. **Working `run-js-tests.sh` script** (for running Jest tests)
3. **>90% Jest test coverage** (prioritizing recently touched or commonly used critical React code)

### Jest Setup Reference

Use these as references for Jest setup:

- **Reference package.json**: [inveniosoftware/invenio-rdm-records/package.json](https://github.com/inveniosoftware/invenio-rdm-records/blob/master/invenio_rdm_records/assets/semantic-ui/js/invenio_rdm_records/package.json)
- **Reference Jest config**: [oarepo/oarepo library_runner.sh#L589-L760](https://github.com/oarepo/oarepo/blob/main/tools/library_runner.sh#L589-L760)

### Linter Script Template

Reference: `invenio-app-rdm/run-js-linter.sh`

```bash
#!/usr/bin/env bash
# -*- coding: utf-8 -*-
# Usage: ./run-js-linter.sh [args]
# -i|--install: installs eslint-config-invenio
# -f|--fix: auto-fix linting issues

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

for arg in $@; do
    case ${arg} in
        -i|--install)
            npm install --no-save --no-package-lock @inveniosoftware/eslint-config-invenio@^2.0.0
            ;;
        -f|--fix)
            printf "${GREEN}Run eslint${NC}\n";
            npx eslint -c .eslintrc.yml <js_files> --fix
            ;;
        *)
            printf "Argument ${RED}$arg${NC} not supported\n"
            exit 1
            ;;
    esac
done

printf "${GREEN}Run eslint${NC}\n"
npx eslint -c .eslintrc.yml <js_files>
```

### Test Script Template

Each fork needs `run-js-tests.sh`:

```bash
#!/usr/bin/env bash
# -*- coding: utf-8 -*-
# Usage: ./run-js-tests.sh
# Runs Jest tests with coverage reporting

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Switch to Node v22
fnm use 22

echo "${GREEN}Running Jest tests...${NC}"
cat <<'EOF'
test: "react-scripts test --transformIgnorePatterns '/node_modules/(?!axios)/' --coverage --coverageThreshold='{\"global\":{\"branches\":90,\"functions\":90,\"lines\":90,\"statements\":90}}'"
EOF

# Check if package.json has test script
if grep -q '"test"' package.json 2>/dev/null; then
    pnpm test -- --coverage --coverageThreshold='{"global":{"branches":90,"functions":90,"lines":90,"statements":90}}'
    echo "${GREEN}✓ Tests passed!${NC}"
else
    echo "${RED}✗ No test script found in package.json${NC}"
    exit 1
fi
```

### Fork Status and Required Scripts

| Fork | run-js-linter.sh | Jest Setup | run-js-tests.sh | >90% Coverage |
|------|-----------------|------------|-----------------|---------------|
| Fork | .js Files | run-js-linter.sh | Jest Setup | run-js-tests.sh | >90% Coverage |
|------|----------|-----------------|------------|-----------------|---------------|
| invenio-administration | 71 | ✓ | ✓ | ❌ Pending | ❌ Required |
| invenio-app-rdm | 136 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-assets | 3 (build) | ✓ | N/A | N/A | N/A |
| invenio-communities | 136 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-jobs | 22 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-rdm-records | 186 | ✓ | ✓ | ❌ Pending | ❌ Required |
| invenio-search-ui | 27 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |

### Phase 0 Tasks (Must Complete Before Migration)

**✅ COMPLETED:**

1. **✓** Add missing `run-js-linter.sh` scripts:
   - ✓ `invenio-assets/run-js-linter.sh` (created)
   - ✓ `invenio-search-ui/run-js-linter.sh` (created)

2. **✓** Set up Jest testing infrastructure for each fork:
   - ✓ `invenio-administration` - Jest already existed
   - ✓ `invenio-rdm-records` - Jest already existed
   - ✓ `invenio-app-rdm` - Created package.json with Jest
   - ✓ `invenio-communities` - Created package.json with Jest
   - ✓ `invenio-jobs` - Created package.json with Jest
   - ✓ `invenio-search-ui` - Created package.json with Jest

3. **✓** Create `run-js-tests.sh` scripts for each fork:
   - ✓ `invenio-administration/run-js-tests.sh`
   - ✓ `invenio-app-rdm/run-js-tests.sh`
   - ✓ `invenio-communities/run-js-tests.sh`
   - ✓ `invenio-jobs/run-js-tests.sh`
   - ✓ `invenio-rdm-records/run-js-tests.sh`
   - ✓ `invenio-search-ui/run-js-tests.sh`

4. **❌ PENDING: Write Jest tests to achieve >90% coverage:**
   - Need to write tests for recently touched React code
   - Need to write tests for commonly used critical React code
   - Both linter and Jest tests must pass

**STOP PROCEED CONDITION:**
- ✓ ALL `run-js-linter.sh` scripts exist
- ✓ ALL `run-js-tests.sh` scripts exist
- ✓ ALL forks have Jest infrastructure set up
- ❌ **BLOCKING: Jest tests must be written to achieve >90% coverage first**
- ❌ **BLOCKING: All linter and Jest tests must pass before migration**

-- ❌ **CRITICAL BLOCKER: Invenio ecosystem packages MUST be migrated to React 19 FIRST**
--    - react-searchkit (v3.0.3) - [npmjs.com/package/react-searchkit](https://www.npmjs.com/package/react-searchkit)
--    - react-invenio-forms (v4.15.2) - [npmjs.com/package/react-invenio-forms](https://www.npmjs.com/package/react-invenio-forms)
--    - react-overridable (v1.0.0) - [npmjs.com/package/react-overridable](https://www.npmjs.com/package/react-overridable)
--    - @inveniosoftware/eslint-config-invenio (v1.0.12) - [npmjs.com/package/@inveniosoftware/eslint-config-invenio](https://www.npmjs.com/package/@inveniosoftware/eslint-config-invenio)
--
-- All 4 packages use React 16.x as peer/dev dependency
-- All 4 enzyme-adapter-react-16 require React 16
-- All 6 application forks depend on react-searchkit and react-invenio-forms

---
## Phase -1: Ecosystem Packages Migration (BLOCKING)

**Goal:** Fork and migrate Invenio ecosystem packages to React 19 BEFORE application migration

### Ecosystem Package Status

| Package | Current | npmjs | React | Last Updated | GitHub Owner |
|---------|---------|-------|-------|--------------|--------------|
| react-searchkit | v3.0.3 | [npmjs.com](https://www.npmjs.com/package/react-searchkit) | ^16.13.0 | 2025-09-22 | inveniosoftware |
| react-invenio-forms | v4.15.2 | [npmjs.com](https://www.npmjs.com/package/react-invenio-forms) | ^16.13.0 | 2025-12-15 | inveniosoftware |
| react-overridable | v1.0.0 | [npmjs.com](https://www.npmjs.com/package/react-overridable) | React 16 | 2025-09-11 | indico |
| @inveniosoftware/eslint-config-invenio | v1.0.12 | [npmjs.com](https://www.npmjs.com/package/@inveniosoftware/eslint-config-invenio) | - | 2023-07-24 | inveniosoftware |

### Why This Blocks Everything

All 6 application forks depend on these packages:
- react-searchkit: search UI components (used by all 6 forks)
- react-invenio-forms: form components (Formik wrappers) (used by all 6 forks)
- react-overridable: component override patterns
- @inveniosoftware/eslint-config-invenio: ESLint config

### Migration Steps

Step 1: Fork ecosystem packages to oarepo
```bash
# Fork react-searchkit
git clone https://github.com/inveniosoftware/react-searchkit.git react-searchkit
cd react-searchkit
git checkout -b contribution-react-19-migration
git remote add oarepo git@github.com:oarepo/react-searchkit.git
git push oarepo contribution-react-19-migration

# Fork react-invenio-forms
git clone https://github.com/inveniosoftware/react-invenio-forms.git react-invenio-forms
cd react-invenio-forms
git checkout -b contribution-react-19-migration
git remote add oarepo git@github.com:oarepo/react-invenio-forms.git
git push oarepo contribution-react-19-migration

# Fork react-overridable (from indico org)
git clone https://github.com/indico/react-overridable.git react-overridable
cd react-overridable
git checkout -b contribution-react-19-migration
git remote add oarepo git@github.com:oarepo/react-overridable.git
git push oarepo contribution-react-19-migration

# Fork eslint-config-invenio
git clone https://github.com/inveniosoftware/eslint-config-invenio.git eslint-config-invenio
cd eslint-config-invenio
git checkout -b contribution-react-19-migration
git remote add oarepo git@github.com:oarepo/eslint-config-invenio.git
git push oarepo contribution-react-19-migration
```

Step 2: Migrate each package to React 19

react-searchkit:
```json
// Update package.json dependencies
{
  "peerDependencies": {
    "react": "^19.2.4",  // was ^16.13.0
    "react-dom": "^19.2.4"  // was ^16.13.0
  },
  "devDependencies": {
    "react": "^19.2.4",  // was ^16.13.0
    "react-dom": "^19.2.4",  // was ^16.13.0
    "enzyme-adapter-react-16": null,  // remove
    "@testing-library/react": "^14.3.1"  // add
  }
}
```

react-invenio-forms:
```json
// Update package.json dependencies
{
  "peerDependencies": {
    "react": "^19.2.4",  // was ^16.13.0
    "react-dom": "^19.2.4"  // was ^16.13.0
  },
  "devDependencies": {
    "react": "^19.2.4",  // was ^16.13.0
    "react-dom": "^19.2.4",  // was ^16.13.0
    "enzyme-adapter-react-16": null,  // remove
    "@testing-library/react": "^14.3.1",  // was ^9.5.0
    "@testing-library/user-event": "^14.5.2"  // was ^7.2.0
  }
}
```

react-overridable:
```json
{
  "peerDependencies": {
    "react": "^19.2.4"  // update from React 16
  }
}
```

@inveniosoftware/eslint-config-invenio:
- Verify no React version-specific rules
- Update if needed for React 19

Step 3: Use oarepo packages locally (CANNOT PUBLISH TO NPMJS)

**IMPORTANT:** We cannot publish to npmjs.org as we don't have ownership of these package names.

**Option A: Use Git+HTTPS in webpack.py**
```python
# In each fork's webpack.py, update dependencies:
dependencies = {
    # Point to oarepo forks
    "react-searchkit": "git+https://github.com/oarepo/react-searchkit.git@contribution-react-19-migration#egg=react-searchkit",
    "react-invenio-forms": "git+https://github.com/oarepo/react-invenio-forms.git@contribution-react-19-migration#egg=react-invenio-forms",
    "react-overridable": "git+https://github.com/oarepo/react-overridable.git@contribution-react-19-migration#egg=react-overridable",
    "@inveniosoftware/eslint-config-invenio": "git+https://github.com/oarepo/eslint-config-invenio.git@contribution-react-19-migration#egg=eslint-config-invenio",
}
```

**Option B: Setup local npm registry (Verdaccio)**
```bash
# Install Verdaccio
npm install -g verdaccio
verdaccio &

# Publish packages to local registry
cd react-searchkit && npm publish --registry http://localhost:4873
cd react-invenio-forms && npm publish --registry http://localhost:4873
cd react-overridable && npm publish --registry http://localhost:4873
cd eslint-config-invenio && npm publish --registry http://localhost:4873
```

Then use in webpack.py:
```python
dependencies = {
    "react-searchkit": "react-searchkit@oarepo",
    "react-invenio-forms": "react-invenio-forms@oarepo",
}
```

**Option C: Coordinate with inveniosoftware (RECOMMENDED)**
- Open PR issues: 
  - [inveniosoftware/react-searchkit/issues](https://github.com/inveniosoftware/react-searchkit/issues) - add React 19 issue
  - [inveniosoftware/react-invenio-forms/issues](https://github.com/inveniosoftware/react-invenio-forms/issues) - add React 19 issue
- Offer to contribute React 19 migration PRs
- Request inveniosoftware to publish v5.x versions to npmjs.org

**STOP PROCEED:**
✅ All 4 ecosystem packages forked to oarepo
✅ All 4 ecosystem packages migrated to React 19
✅ Ecosystem packages linked via pnpm link into build directory node_modules
✅ Application tests pass with >90% coverage
✅ All linters pass
**ONLY THEN proceed to Phase 1 (React Core Migration)**

---
