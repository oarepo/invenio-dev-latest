# React 19 Migration Plan: InvenioRDM Codebase

## Document Information

- **Created**: 2026-02-04
- **Target**: React 19.2.4 (latest)
- **Scope**: Full codebase migration with full documentation
- **Migration Strategy**: Phased conversion (Option C)
- **Validated by**: frontend-design skill

---

## Table of Contents

1. [Overview](#1-overview)
2. [Codebase Analysis](#2-codebase-analysis)
3. [Migration Strategy](#3-migration-strategy)
4. [React 19 vs Redux: Form Strategy Decision](#4-react-19-vs-redux-decision)
5. [Class Component Conversion](#5-class-component-conversion)
6. [Migration Steps](#6-migration-steps)
7. [Third-Party Library Upgrades](#7-third-party-library-upgrades)
8. [Testing Strategy](#8-testing-strategy)
9. [Documentation Requirements](#9-documentation-requirements)
10. [Tooling Requirements](#10-tooling-requirements)
11. [Pitfalls & Mitigations](#11-pitfalls--mitigations)
12. [Execution Plan](#12-execution-plan)


Relevant PR on this topic: https://github.com/inveniosoftware/invenio-assets/issues/160

---

## CRITICAL PREREQUISITES (Phase 0)

**ABSOLUTE REQUIREMENT**: BEFORE any React 19 migration code changes, ALL forks MUST have:

1. **Working `run-js-linter.sh` script** (for linting code quality)
2. **Working `run-js-tests.sh` script** (for running Jest tests)
3. **>90% Jest test coverage** (prioritizing recently touched or commonly used critical React code)

### Jest Setup Reference

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
NC='\033[0m'

fnm use 22

echo "${GREEN}Running Jest tests...${NC}"

if grep -q '"test"' package.json 2>/dev/null; then
    pnpm test -- --coverage --coverageThreshold='{"global":{"branches":90,"functions":90,"lines":90,"statements":90}}'
    echo "${GREEN}✓ Tests passed!${NC}"
else
    echo "${RED}✗ No test script found in package.json${NC}"
    exit 1
fi
```

### Fork Status and Required Scripts

| Fork | .js Files | run-js-linter.sh | Jest Setup | run-js-tests.sh | >90% Coverage |
|------|----------|-----------------|------------|-----------------|---------------|
| invenio-administration | 71 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-app-rdm | 136 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-assets | 3 (build configs) | ✓ | N/A | N/A | N/A |
| invenio-communities | 136 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-jobs | 22 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-rdm-records | 186 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-search-ui | 27 | ❌ | ❌ Pending | ❌ Pending | ❌ Required |

### Phase 0 Tasks

1. [ ] Add missing run-js-linter.sh scripts
2. [ ] Set up Jest infrastructure for all forks
3. [ ] Create run-js-tests.sh scripts
4. [ ] Write tests to achieve >90% coverage
5. [ ] Verify all linters and tests pass before migration

**STOP PROCEED CONDITION**: ALL scripts must pass with >90% coverage before Phase 1.


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
NC='\033[0m'

# Switch to Node v22
fnm use 22

echo "${GREEN}Running Jest tests...${NC}"

# Run Jest with coverage reporting
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

| Fork | .js Files | run-js-linter.sh | Jest Setup | run-js-tests.sh | >90% Coverage |
|------|----------|-----------------|------------|-----------------|---------------|
| invenio-administration | 71 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-app-rdm | 136 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-assets | 3 (build configs) | ✓ | N/A | N/A | N/A |
| invenio-communities | 136 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-jobs | 22 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-rdm-records | 186 | ✓ | ❌ Pending | ❌ Pending | ❌ Required |
| invenio-search-ui | 27 | ❌ | ❌ Pending | ❌ Pending | ❌ Required |

### Phase 0 Tasks (Must Complete Before Migration)

1. [ ] **Add missing `run-js-linter.sh` scripts**:
   - `invenio-assets/run-js-linter.sh`
   - `invenio-search-ui/run-js-linter.sh`

2. [ ] **Set up Jest testing infrastructure for each fork**:
   - Create `jest.config.js` or `package.json` with Jest config
   - Add `@testing-library/react`, `jest`, `jest-environment-jsdom`, etc.
   - Ensure all linter scripts pass

3. [ ] **Create `run-js-tests.sh` scripts for each fork**:
   - Run Jest with coverage reporting
   - Enforce >90% coverage threshold

4. [ ] **Write Jest tests to achieve >90% coverage**:
   - Prioritize recently touched React code
   - Prioritize commonly used critical React code
   - Both linter and Jest tests must pass

**STOP PROCEED CONDITION**:
- ALL `run-js-linter.sh` scripts must pass
- ALL `run-js-tests.sh` scripts must pass with >90% coverage
- ONLY THEN proceed to Phase 1 (React core migration)
## ⚠️ CRITICAL BLOCKER: Invenio Ecosystem Packages

**BLOCKER**: The Invenio ecosystem packages MUST be migrated to React 19 BEFORE the application forks can be migrated.

### Ecosystem Package Status

| Package | Current Version | React Version | Node | GitHub | Last Updated | Migration Status |
|---------|----------------|---------------|------|--------|--------------|------------------|
| **react-invenio-forms** | v4.15.2 | 16.x | v20 | [github.com/inveniosoftware/react-invenio-forms](https://github.com/inveniosoftware/react-invenio-forms) | 2025-12-15 | ❌ TBD |
| **react-searchkit** | v3.0.3 | 16.x | v20 | [github.com/inveniosoftware/react-searchkit](https://github.com/inveniosoftware/react-searchkit) | 2025-09-22 | ❌ TBD |

### Why This Blocks Everything

1. **All application forks depend on these packages**:
   - invenio-app-rdm → `react-invenio-forms: ^4.0.0`, `react-searchkit: ^3.0.0`
   - invenio-rdm-records → `react-invenio-forms: ^4.11.0`, `react-searchkit: ^3.0.0`
   - invenio-communities → `react-invenio-forms: ^4.0.0`, `react-searchkit: ^3.0.0`
   - invenio-jobs → `react-invenio-forms: ^4.0.0`, `react-searchkit: ^3.0.0`
   - invenio-administration → `react-invenio-forms: ^4.0.0`, `react-searchkit: ^3.0.0`
   - invenio-search-ui → `react-invenio-forms: ^4.0.0`, `react-searchkit: ^3.0.0`

2. **React 16 code in these packages will break React 19 apps**:
   - `ReactDOM.render()` used → must convert to `createRoot`
   - Class components may use deprecated lifecycle methods
   - PropTypes patterns may need updates

3. **No React 19 compatible versions exist yet**:
   - react-searchkit issue #211 (2022): "Support React 17" - still open
   - No active work on React 19 migration detected

### Required New Migration Phase

**Phase -1: Invenio Ecosystem Packages Migration (BEFORE any application migration)**

```
1. Fork react-invenio-forms (inveniosoftware fork)
2. Fork react-searchkit (inveniosoftware fork)
3. Analyze codebase and create test coverage (>90%)
4. Migrate to React 19:
   - Update dependencies (React 16 → 19)
   - ReactDOM.render → createRoot
   - Update any class components to hooks
   - Update PropTypes
5. Write comprehensive tests
6. Publish new versions (v5.x for major version bump)
7. Wait for official inveniosoftware releases OR use forked versions
```

### STOP PROCEED CONDITION (Updated)

**ALL of the following must be complete BEFORE Phase 1 (React Core Migration):**

- ✅ Forks have linter scripts (Phase 0 - DONE)
- ✅ Forks have Jest infrastructure (Phase 0 - DONE)
- ✅ Forks have run-js-tests.sh scripts (Phase 0 - DONE)
- ❌ Ecosystem packages migrated to React 19 (**BLOCKER**)
- ❌ Ecosystem packages published as new versions
- ❌ Application forks updated to use new ecosystem package versions
- ❌ Application fork tests pass with >90% coverage

---



---

## 1. Overview

### 1.1 Purpose

This plan details the migration of the InvenioRDM codebase from React 16.13.0 to React 19.2.4, ensuring:
- All code meets React 19 standards and uses modern patterns
- Comprehensive documentation is created in docs-invenio-rdm
- Automated verification scripts validate the migration
- Third-party libraries are compatible (Formik, Uppy 5.0)
- Existing Redux patterns are preserved for form submissions
- Nothing is broken in the process

### 1.2 Target State

| Item | Current | Target | Latest Available |
|------|---------|--------|------------------|
| React Version | 16.13.0 | 19.2.4 | 19.2.4 |
| React DOM | 16.13.0 | 19.2.4 | 19.2.4 |
| React Router DOM | 6.3.0 | 7.13.0 | 7.13.0 |
| React Redux | 7.2.0 | 9.2.0 | 9.2.0 |
| Redux Toolkit | - | 2.3.0 | 2.6.0+ |
| Formik | 2.4.9 | 2.4.9 | 2.4.9 |
| Uppy Core | 3.13.1 | 5.0.0 | TBD |
| Uppy React | 3.4.0 | 5.0.0 | TBD |
| Testing Library | - | 15.1.0 | 16.2.0 |
| Class Components | ~300+ | ~250+ (50+ converted) | - |
| Test Coverage | TBD | ≥80% | - |

### 1.3 Scope

- **Custom Code**: Local repository (`assets/js/`)
- **Core Packages**: invenio-rdm-records, invenio-app-rdm, invenio-communities, invenio-administration, invenio-search-ui
- **Supporting Packages**: ~18 additional oarepo forks
- **Documentation**: docs-invenio-rdm fork
- **Third-Party Libraries**: Formik, Uppy 5.0 hooks for file uploads
- **Redux**: Keep existing patterns for form submissions

### 1.4 Out of Scope

- E2E testing (existing suite handles this)
- Non-React code (Python, CSS templates)
- Packages without forks (user must create forks first)
- **React 19 Form Actions (`useFormState`)** for deposit forms (keep Redux)

---

## 2. Codebase Analysis

### 2.1 React Codebase Scope

| Package | Location | JS Files | Lines | Source |
|---------|----------|----------|-------|--------|
| **invenio-rdm-records** | oarepo fork | 350 | ~35,582 | $WORKSPACE_ROOT/invenio-rdm-records |
| **invenio-app-rdm** | oarepo fork | 121 | ~12,297 | $WORKSPACE_ROOT/invenio-app-rdm |
| **invenio-communities** | oarepo fork | 126 | ~10,212 | $WORKSPACE_ROOT/invenio-communities |
| **invenio-administration** | oarepo fork | 53 | ~3,014 | $WORKSPACE_ROOT/invenio-administration |
| **invenio-search-ui** | oarepo fork | 18 | ~1,446 | $WORKSPACE_ROOT/invenio-search-ui |
| **Local custom code** | local repo | 6 | ~358 | $WORKSPACE_ROOT/invenio-dev-latest/assets/js |
| **Other oarepo forks** | various | ~670+ | ~30,000+ | remaining 18+ forks |

**Total**: ~1,300+ React files, ~93,000+ lines of React code

### 2.2 Current Build Tool

- **Tool**: Rspack 1.0+
- **Status**: Already supports React 19
- **Action**: Verify configuration after migration

### 2.3 Node.js and Package Manager Requirements

**CRITICAL**: Always use Node v22 and pnpm for JavaScript dependencies. Never use npm.

```bash
# Switch to Node v22 before any work
fnm use 22

# Verify version
node --version  # Should show v22.x.x
```

All JavaScript package operations must use:
```bash
pnpm install    # NOT npm install
pnpm test       # NOT npm test
pnpm build      # NOT npm run build
```

### 2.3 Deprecated Lifecycle Methods Analysis

**Result**: No components using deprecated lifecycle methods
- No `componentWillMount`
- No `componentWillReceiveProps`
- No `componentWillUpdate`

This is positive news - no forced conversions for deprecation warnings.

### 2.4 Class Component Analysis

**Total class components identified**: ~300+
**Recently modified (12 months)**: 45 components

### 2.5 Third-Party Libraries Analysis

| Library | Current Version | Usage | React 19 Status |
|---------|-----------------|-------|-----------------|
| **Formik** | 2.4.9 (latest) | Deposit forms (with Redux) | Keep existing Redux patterns |
| **Uppy React** | 3.4.0 | File uploads | **UPGRADE TO 5.0+ (hooks approach)** |
| **Uppy Core** | 3.13.1 | File uploads | **UPGRADE TO 5.0+** |
| **react-invenio-forms** | TBD | Form components | May need updates |

---

## 3. Migration Strategy

### 3.1 Phased Approach

```
Phase 0: Foundation (Build infrastructure + third-party compatibility)
  ├─ Update Rspack config for React 19
  ├─ Upgrade React to 19.2.4
  ├─ Upgrade React Router DOM to 7.13.0
  ├─ Upgrade Redux to 9.2.0
  ├─ Upgrade Redux Toolkit to 2.6.0+
  ├─ Keep Formik at 2.4.9 (keep existing Redux patterns)
  └─ Upgrade Uppy to 5.0 (rewrite using hooks)

Phase 1: Custom Code (Lowest risk)
  └─ Migrate local assets (~358 lines)

Phase 2: Core Packages (Largest, local workspace)
  └─ Migrate invenio-rdm-records (~35k lines)

Phase 3: Supporting Packages (Incremental)
  ├─ invenio-app-rdm (~12k lines)
  ├─ invenio-communities (~10k lines)
  ├─ invenio-administration (~3k lines)
  └─ invenio-search-ui (~1k lines)

Phase 4: Remaining Packages (As needed)
  └─ Migrate other oarepo forks (~30k lines)

Phase 5: Documentation (Concurrent)
  └─ Update docs-invenio-rdm fork
```

### 3.2 Architectural Decisions

1. **Dual-version compatibility**: Run React 19 alongside React 16 during transition (using feature flags if needed)

2. **No patches to installed dependencies**: Only work on forked repos. Stop and ask user if fork is missing.

3. **Fork sync strategy**:
   - Detect default branch (may be `main` or `master`)
   - Fetch and merge from upstream
   - **STOP and ask user on merge conflict** - do not attempt to fix

4. **Contribution branch naming**: `contribution-react-19-migration` (follows upstream convention)

5. **Verification**: 100% automated via scripts (no manual testing capacity)

6. **Uppy 5.0 Adoption**: Rewrite file upload components using hooks - this is beneficial, not a burden

7. **Keep Redux for Forms**: **Do NOT use React 19 Form Actions (`useFormState`)** for deposit forms. Continue using Formik + Redux thunk pattern for form submissions.

### 3.3 Dependency Updates

```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0",
    "react-redux": "^9.2.0",
    "@reduxjs/toolkit": "^2.6.0",
    "react-i18next": "^15.1.0",
    "react-dnd": "^16.0.0",
    "react-dnd-html5-backend": "^16.0.0",
    "@uppy/core": "^5.0.0",
    "@uppy/react": "^5.0.0",
    "@uppy/aws-s3-multipart": "^5.0.0",
    "@uppy/drop-target": "^5.0.0",
    "@uppy/tus": "^5.0.0",
    "@uppy/compressor": "^5.0.0",
    "@uppy/thumbnail-generator": "^5.0.0",
    "@semantic-ui-react/css-patch": "^1.0.0",
    "semantic-ui-react": "^2.1.4",
    "formik": "^2.4.9",
    "yup": "^1.4.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.2.0",
    "@testing-library/jest-dom": "^6.7.0",
    "@testing-library/user-event": "^14.6.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^1.1.0",
    "msw": "^2.7.0"
  }
}
```

---

## 4. React 19 vs Redux: Form Strategy Decision

### 4.1 The Question

Should we use React 19's new `useFormState` hook for form submissions, or continue with the existing Redux + Formik pattern?

### 4.2 Current InvenioRDM Pattern

```javascript
// Current: Formik → Redux action → API call → Redux state update
<Formik
  initialValues={initialValues}
  validationSchema={schema}
  onSubmit={(values, { setSubmitting }) => {
    // Dispatch Redux action
    dispatch({
      type: DEPOSIT_SUBMIT,
      payload: values
    });
  }}
>
  {/* Form fields */}
</Formik>

// Redux thunk:
const submitDeposit = (values) => async (dispatch, getState) => {
  dispatch({ type: DEPOSIT_SUBMIT_START });

  try {
    const response = await api.post('/records', values);
    dispatch({
      type: DEPOSIT_SUBMIT_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: DEPOSIT_SUBMIT_ERROR,
      payload: error
    });
  }
};
```

### 4.3 Comparison: Redux vs React 19 Form Actions

| Aspect | Redux Pattern | React 19 Form Actions (`useFormState`) |
|--------|---------------|----------------------------------------|
| **Architectural model** | Event-based (dispatch, subscribe) | Return-value-based (call function, get result) |
| **State management** | Centralized Redux store | Local form state in useFormState |
| **Global state access** | Can access full Redux state in thunks | Form is isolated, no global state |
| **Async flow** | Redux thunks/sagas | Server action function |
| **Error handling** | Redux error actions, centralized | Throw error or return error state (local) |
| **Complex workflows** | Well-suited (multiple steps, dependencies) | Limited (single server action) |
| **Middleware** | Redux DevTools, time-travel, logging | None (basic action only) |
| **Testing** | Thunks are testable, Redux store mockable | Server function testable, no global state |
| **Code organization** | Centralized in Redux files | Scattered in server action files |
| **TypeScript support** | Well-established patterns | Newer, less mature |
| **Learning curve** | Team already knows Redux | New pattern to learn |

### 4.4 Why Redux is Better for InvenioRDM

InvenioRDM deposit forms have specific requirements that make Redux the better choice:

| Requirement | Why Redux Succeeds |
|-------------|-------------------|
| **Multi-step workflows** | Redux can orchestrate complex state changes |
| **File uploads** | File upload state needs to be shared across components |
| **Community selection** | Selected community affects form validation |
| **Submission history** | Track submission attempts, errors, retry logic |
| **Global UI state** | Loading spinners, progress bars across app |
| **Error handling** | Centralized error boundaries and display |
| **Existing patterns** | Team already knows Redux patterns |
| **No rewrite needed** | Existing Redux thunks work with React 19 |

### 4.5 When React 19 Form Actions COULD Be Used

Use `useFormState` ONLY for:

1. **Simple, isolated forms** that don't interact with the rest of the app
2. **New forms** starting from scratch with no existing Redux dependencies
3. **Forms with simple server actions** (no complex async workflows)

**InvenioRDM deposit forms are NOT in this category.**

### 4.6 Recommended Strategy

**Keep Redux for all form submissions.**

Use Formik v2.4.9 for:
- Client-side validation
- Field-level state management
- Complex schemas (Yup/Zod)
- Multi-step forms

Continue using Redux for:
- Form submissions
- API calls
- Error handling
- Success/failure state
- Progress tracking
- Cross-form communication

```javascript
// RECOMMENDED: Formik v2.4.9 + Redux (keep existing pattern)
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

function DepositForm() {
  const dispatch = useDispatch();
  const depositState = useSelector(state => state.deposit);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      files: [],
    },
    validationSchema: depositSchema,
    onSubmit: (values) => {
      // Keep existing Redux pattern
      dispatch(submitDeposit(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Field name="title" label="Title" />
      <Field name="description" label="Description" />

      <button
        type="submit"
        disabled={formik.isSubmitting || depositState.isSaving}
      >
        {depositState.isSaving ? 'Saving...' : 'Submit'}
      </button>

      {depositState.error && (
        <Message error>{depositState.error.message}</Message>
      )}

      {depositState.success && (
        <Message success>Record created!</Message>
      )}
    </form>
  );
}
```

---

## 5. Class Component Conversion

### 5.1 Conversion Strategy: Option C (Phased)

Convert components based on:
1. **Deprecated lifecycle usage**: (0 components - none found)
2. **Active modification**: Components with recent Git activity (5+ commits in 12 months = Priority 1, 2-4 commits = Priority 2)
3. **Redux-connected components**: Convert to hooks (`useSelector`, `useDispatch`)
4. **Uppy integration**: Components using old Uppy component approach (upgrade to hooks)
5. **Simplicity benefit**: Simple/short components when touched

**Leave remaining class components as-is** - they continue to work in React 19 and conversion provides limited value.

### 5.2 Priority 1: High Activity Components (5+ commits in 12 months)

| Component | File | Commits (12mo) | Rationale |
|-----------|------|----------------|-----------|
| **VersionField** | `src/deposit/fields/VersionField/VersionField.js` | 11 | High activity, simple render component, critical for versioning workflow. Modern patterns improve maintainability. |
| **FormFeedback** | `src/deposit/errors/FormFeedback.js` | 8 | Highest activity in error handling, Redux-connected. **Convert to hooks** (`useSelect`or) for cleaner code. Complex error mapping is cleaner with custom hooks. |
| **AccessRightField** | `src/deposit/fields/AccessField/AccessRightField.js` | 4 | Core access control field, recently updated for new error format. **Convert to hooks** (`useSelect`or) for Redux patterns. |
| **PIDFieldCmp** | `src/deposit/fields/Identifiers/PIDField/PIDFieldCmp.js` | 4 | Has unique constructor validation (`validatePropValues()`). Converting to hooks will clarify this validation logic. |
| **LinksTable** | `oaipmh/details/LinksTable.js` | 5 | Recently modified for v10.0.0/v20.0.1, actively maintained OAI-PMH component. |

### 5.3 Priority 2: Form Components (Formik + Redux)

| Component | File | Commits (12mo) | Rationale |
|-----------|------|----------------|-----------|
| **PublishModal** | `src/deposit/controls/PublishButton/PublishModal.js` | 3 | Form submission workflow. **Keep Formik + Redux pattern**. Convert class to hooks if needed, but keep existing Redux dispatch pattern. |
| **CommunitySelectionModal** | `src/deposit/components/CommunitySelectionModal/CommunitySelectionModal.js` | 4 | Search + form pattern. **Keep Formik + Redux** for state management. |
| **SubmitReviewModal** | `src/deposit/controls/PublishButton/SubmitReviewModal.js` | 3 | Review submission form. **Keep Formik + Redux**. |
| **LicenseModal** | `src/deposit/fields/License/LicenseModal.js` | 3 | License selection form. **Keep Formik + Redux**. |

**Rationale**: Continue using Formik v2.4.9 + Redux for these components. Only convert to functional components with hooks if they're class components, but **keep the Redux dispatch pattern - do NOT use React 19 Form Actions.**

### 5.4 Priority 1: Uppy 5.0 Migration (Rewrite Using Hooks)

| Component | Current Approach | New Approach (Uppy 5.0 Hooks) | Rationale |
|-----------|------------------|-----------------------------|-----------|
| **FileUploader** | Uppy v3/v4 Dashboard component | `useUppyState`, `useDropzone`, `useUppyEvent` | Uppy 5.0 hooks provide automatic cleanup, perfect for React 19 Strict Mode |
| **FileModification/ModificationModal** | Uppy v3/v4 component | Uppy 5.0 hooks | Better concurrent rendering support |
| **Custom Upload UI** | Custom wrapper around Uppy | Use `useDropzone`, `useFileInput` with Semantic UI | Full UI control, hooks work better with React 19 |

**Why Uppy 5.0 is beneficial**:
- **Automatic cleanup**: `useUppyEvent` handles subscriptions internally - no manual `useEffect` cleanup
- **Concurrent rendering**: `useUppyState` provides reactive state updates compatible with React 19
- **No Strict Mode issues**: Hooks are designed for React 19's double-invocation during development
- **Full UI control**: Build your own Semantic UI React UI - no need for Uppy's Dashboard CSS
- **Small bundles**: Import only hooks you need

### 5.5 Priority 2: Moderate Activity (2-4 commits in 12 months)

| Component | File | Commits (12mo) | Rationale |
|-----------|------|----------------|-----------|
| **SubjectsField** | `src/deposit/fields/SubjectsField/SubjectsField.js` | 3 | Deposit field with Redux connection. Convert to hooks (`useSelect`or). |
| **TitlesField** | `src/deposit/fields/TitlesField/TitlesField.js` | 3 | Core title editing functionality. Redux-connected, convert to hooks. |
| **AdditionalTitlesField** | `src/deposit/fields/TitlesField/AdditionalTitlesField.js` | 2 | Related to TitlesField. Convert together for consistency. |
| **Meeting** | `src/deposit/customFields/Meeting.js` | 3 | Custom field type for conferences. Simpler conversion demonstrates the pattern. |
| **CommunityHeader** | `src/deposit/components/CommunityHeader/CommunityHeader.js` | 4 | UI component for community selection. Recently updated. |
| **PublishButton** | `src/deposit/controls/PublishButton/PublishButton.js` | 2 | Main publish button. Critical workflow component. |
| **DeleteButton** | `src/deposit/controls/DeleteButton/DeleteButton.js` | 1 | Delete action button. Simple conversion. |
| **Journal** | `src/deposit/customFields/Journal.js` | 3 | Custom field for journal publications. |
| **Thesis** | `src/deposit/customFields/Thesis.js` | 25 | Active thesis field component. |
| **FormFeedbackSummary** | `src/deposit/errors/FormFeedbackSummary.js` | 2 | Error summary component. Part of error handling suite. |

### 5.6 Components NOT Eligible for Conversion

Remaining **~250-300** class components are not to be converted because:
- No recent activity (not touched in 12+ months)
- Working correctly (no bug reports/issues)
- Low risk - class components fully supported in React 19
- Cost vs benefit - conversion would take weeks with questionable value

**Strategy**: Leave as-is. Convert only when component needs modification.

---

## 6. Migration Steps

### 6.1 Pre-Migration Setup

For each package:

1. **Verify fork availability**:
   ```bash
   fork_path="$WORKSPACE_ROOT/$PACKAGE_NAME"
   if [ ! -d "$fork_path" ]; then
       echo "✗ STOP: No local fork found for '$PACKAGE_NAME'"
       echo "   Please fork the upstream repo and clone it to $fork_path"
       exit 1
   fi
   ```

2. **Detect default branch**:
   ```bash
   cd "$fork_path"
   default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
   [[ -z "$default_branch" ]] && default_branch="main"  # fallback
   ```

3. **Sync fork with upstream** (STOP on error):
   ```bash
   git checkout "$default_branch"
   git fetch upstream

   if ! git merge "upstream/$default_branch"; then
       echo "✗ MERGE CONFLICT when merging upstream/$default_branch"
       echo "   Please resolve manually and re-run."
       exit 1
   fi
   ```

4. **Create contribution branch**:
   ```bash
   git checkout -b contribution-react-19-migration
   ```

### 6.2 Dependency Updates

1. **Update package.json** with React 19 versions (see section 3.3)

2. **Install dependencies**:
   ```bash
   cd <package_assets_directory>
   pnpm install
   ```

### 6.3 Automated Code Transformation

Run codemods:

```bash
# React 18/19 createRoot codemod (entry points)
npx react-18-codemod create-root <path/to/components>

# Remove event.persist() calls (React 17+ no longer pools events)
npx @react-codemod/no-event-pooling <path/to/components>

# Remove React.forwardRef ref for function components
npx @react-codemod/no-unref-forward-ref <path/to/components>

# React Router DOM: version bump only (no codemod needed)
# InvenioRDM uses only generatePath utility, not Router components
```

### 6.4 Manual Entry Point Updates

Find and update `ReactDOM.render()` calls:

```javascript
// OLD (React 16)
import ReactDOM from "react-dom";
ReactDOM.render(<App />, document.getElementById("root"));

// NEW (React 19)
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

### 6.5 React Router DOM v6 → v7 Migration

React Router DOM v7 introduces breaking changes. Common migrations:

```javascript
// OLD (v6)
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/records/:id" element={<RecordDetail />} />
</Routes>

// NEW (v7)
import { Routes, Route } from 'react-router-dom';

// API is mostly compatible for basic use
// Check for deprecated patterns:
// - <Link to={{ pathname: '/path', state: { foo: 'bar' }}> → useNavigate with state
// - withRouter() → removed, use hooks instead
// - <Redirect> → replaced with <Navigate>
```

---

## 7. Third-Party Library Upgrades

### 7.1 Formik (Keep at 2.4.9)

**Status**: Formik 2.4.9 is already the latest version. No upgrade needed.

**Important**: **Keep Redux pattern for form submissions**. Do NOT use React 19 Form Actions.

**Existing pattern works with React 19**:

```javascript
// Formik v2.4.9 + Redux pattern (recommended)
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

function DepositForm() {
  const dispatch = useDispatch();
  const depositState = useSelector(state => state.deposit);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      accessRight: 'open',
    },
    validationSchema: depositSchema,
    onSubmit: (values) => {
      // Keep Redux dispatch - DO NOT use useFormState
      dispatch(submitDeposit(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Field name="title" label="Title" />
      <Field name="description" label="Description" />

      <button
        type="submit"
        disabled={formik.isSubmitting || depositState.isSaving}
      >
        {depositState.isSaving ? 'Saving...' : 'Submit'}
      </button>

      {depositState.error && (
        <Message error>{depositState.error.message}</Message>
      )}
    </form>
  );
}
```

**Documentation Required**:
- Verify Formik 2.4.9 has React 19 peer support
- Document decision to NOT use React 19 Form Actions for deposit forms

### 7.2 Uppy Upgrade (v3.4.0 → v5.0.0) - Hooks-Based Migration

**Why upgrade**: Uppy 5.0 introduces React hooks that are **better suited for React 19**:
- `useUppyState` - Reactive state reading (perfect for concurrent rendering)
- `useUppyEvent` - Automatic cleanup (handles Strict Mode double-invocation)
- Full UI control with Semantic UI React - no Uppy Dashboard CSS dependency

#### Uppy 5.0 Hooks Available

```javascript
import {
  UppyContextProvider,
  useUppyState,
  useUppyEvent,
  useDropzone,
  useFileInput,
  useRemoteSource
} from '@uppy/react';
```

| Hook | Purpose | React 19 Benefit |
|------|---------|------------------|
| `useUppyState(uppy, selector)` | Reactively read Uppy's internal state | Perfect for concurrent rendering |
| `useUppyEvent(uppy, event, callback)` | Subscribe to Uppy events | **Automatic cleanup** handles Strict Mode |
| `useDropzone(options?)` | Build drag-and-drop zone | Full UI control with Semantic UI |
| `useFileInput(props?)` | Create file input element | Programmatic selection |
| `useRemoteSource(sourceId)` | Manage cloud provider connections | Stateful connection management |

#### Migration Pattern: OLD v3/v4 → NEW v5.0

```javascript
// ==============================================
// OLD - Uppy v3/v4: Component-based approach
// ==============================================
import { useEffect, useRef } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/dashboard';
import { AwsS3 } from '@uppy/aws-s3-multipart';

function FileUploader({ recordId, onUploadComplete }) {
  const dashboardRef = useRef(null);

  useEffect(() => {
    // Manual Uppy instance creation
    const uppy = new Uppy({
      autoProceed: true,
    })
      .use(Dashboard, {
        target: dashboardRef.current,
        inline: true,
      })
      .use(AwsS3, {
        getUploadParameters: async (file) => {
          const response = await fetch(`/api/records/${recordId}/files/${file.name}/upload`);
          return await response.json();
        },
      });

    // Manual event subscription
    const handleSuccess = (file, response) => {
      onUploadComplete(file, response);
    };
    uppy.on('upload-success', handleSuccess);

    // Manual cleanup - can be error prone
    return () => {
      uppy.off('upload-success', handleSuccess);
      uppy.close();
    };
  }, [recordId, onUploadComplete]);

  return <div ref={dashboardRef} />;
}
```

```javascript
// ==============================================
// NEW - Uppy v5.0: Hooks-based approach (React 19 friendly)
// ==============================================
import { useState } from 'react';
import { Card, Button, Icon, Modal, Progress, Dimmer, Loader } from 'semantic-ui-react';
import {
  UppyContextProvider,
  useUppyState,
  useUppyEvent,
  useDropzone,
  useFileInput
} from '@uppy/react';

// ========================================
// Level 1: Uppy Provider (app-level)
// ========================================
function AppProvider({ children }) {
  const [uppy] = useState(() => {
    const instance = new Uppy({
      autoProceed: true,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/*', '.pdf', '.doc', '.docx'],
      },
    });

    // Configure S3 upload
    instance.use(AwsS3, {
      getUploadParameters: async (file) => {
        const response = await fetch(`/api/files/${file.name}/upload`);
        return await response.json();
      },
    });

    return instance;
  });

  return (
    <UppyContextProvider uppy={uppy}>
      {children}
    </UppyContextProvider>
  );
}

// ========================================
// Level 2: File List Component (useUppyState)
// ========================================
function FileList({ recordId }) {
  // Reactive state - automatically updates on Uppy state changes
  const files = useUppyState((state) => Object.values(state.files));
  const totalProgress = useUppyState((state) => state.totalProgress);
  const isUploading = useUppyState((state) => state.totalProgress > 0);

  return (
    <Card>
      <Card.Header>
        <Icon name="file" />
        Files ({files.length})
      </Card.Header>
      <Card.Content>
        {files.map((file) => (
          <div key={file.id}>
            <Icon name={file.type} />
            {file.name}
            {file.progress && (
              <Progress percent={file.progress} size="small" />
            )}
          </div>
        ))}
        {isUploading && (
          <Dimmer active inverted>
            <Loader>Uploading... {totalProgress}%</Loader>
          </Dimmer>
        )}
      </Card.Content>
    </Card>
  );
}

// ========================================
// Level 3: Upload Button (useFileInput)
// ========================================
function UploadButton() {
  const { getInputProps, getButtonProps } = useFileInput({
    onDrop: (files) => {
      console.log('Files selected:', files);
    },
  });

  return (
    <>
      <input {...getInputProps()} />
      <Button {...getButtonProps()} primary icon labelPosition="left">
        <Icon name="upload" />
        Upload Files
      </Button>
    </>
  );
}

// ========================================
// Level 4: Drag and Drop Zone (useDropzone)
// ========================================
function DropZone({ recordId }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files, dropPosition) => {
      console.log('Dropped:', files, 'at', dropPosition);
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #ddd',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <Icon name="cloud upload" size="huge" />
      <p>Drag files here or click to select</p>
      <UploadButton />
    </div>
  );
}

// ========================================
// Level 5: Event Handling (useUppyEvent) + Automatic Cleanup
// ========================================
function UploadNotifications({ onComplete }) {
  // Automatic cleanup! No useEffect needed
  const [uploadResults, clearUploadResults] = useUppyEvent('upload-success');

  const [errors, clearErrors] = useUppyEvent('error');

  // Handle successful uploads
  if (uploadResults.length > 0) {
    const [file, response] = uploadResults;
    onComplete?.(file, response);
    clearUploadResults();
  }

  // Display errors
  if (errors.length > 0) {
    const error = errors[0];
    return (
      <div className="ui error message">
        <Icon name="warning circle" />
        {error.message}
      </div>
    );
  }

  return null;
}

// ========================================
// Main Component
// ========================================
function FileUploader({ recordId, onUploadComplete }) {
  return (
    <>
      <DropZone recordId={recordId} />
      <FileList recordId={recordId} />
      <UploadNotifications onComplete={onUploadComplete} />
    </>
  );
}

// Wrap entire app with provider at the top level
export { AppProvider, FileUploader };
```

#### Key Benefits of Uppy 5.0 Hooks for React 19

| Feature | v3/v4 | v5.0 Hooks |
|---------|-------|------------|
| Strict Mode support | Manual cleanup needed | **Automatic cleanup** |
| Concurrent rendering | Possible race conditions | **Reactive state updates** |
| UI customization | Limited (Dashboard component) | **Full Semantic UI control** |
| Bundle size | Entire Dashboard bundle | **Import only hooks needed** |
| Code complexity | useEffect with cleanup | **Clean hooks usage** |
| Debugging | Manual event handling | **Hooks are easier to debug** |

#### Testing Uppy 5.0 Components

```javascript
import { render, screen } from '@testing-library/react';
import { UppyContextProvider, FileUploader } from './FileUploader';
import userEvent from '@testing-library/user-event';

describe('FileUploader (Uppy 5.0)', () => {
  it('displays file list using useUppyState', () => {
    render(
      <UppyContextProvider uppy={mockUppy}>
        <FileUploader />
      </UppyContextProvider>
    );

    // Verify files from Uppy state are displayed
    expect(screen.getByText('Files (2)')).toBeInTheDocument();
  });

  it('handles drag and drop with useDropzone', async () => {
    render(
      <UppyContextProvider uppy={mockUppy}>
        <FileUploader />
      </UppyContextProvider>
    );

    const dropZone = screen.getByText(/drag files here/i);

    await userEvent.upload(dropZone, new File(['test'], 'test.txt'));

    // Verify Uppy received the file
    expect(mockUppy.addFile).toHaveBeenCalled();
  });

  it('lists uploads successfully with useUppyEvent', async () => {
    const onComplete = vi.fn();
    render(
      <UppyContextProvider uppy={mockUppy}>
        <FileUploader onUploadComplete={onComplete} />
      </UppyContextProvider>
    );

    // Trigger upload-success event
    mockUppy.on('upload-success').emit(mockFile, mockResponse);

    // Verify onComplete was called
    expect(onComplete).toHaveBeenCalledWith(mockFile, mockResponse);
  });

  it('handles Strict Mode correctly', () => {
    const { rerender } = render(
      <StrictMode>
        <UppyContextProvider uppy={mockUppy}>
          <FileUploader />
        </UppyContextProvider>
      </StrictMode>
    );

    // Rerender multiple times (simulates Strict Mode)
    rerender(
      <StrictMode>
        <UppyContextProvider uppy={mockUppy}>
          <FileUploader />
        </UppyContextProvider>
      </StrictMode>
    );

    // No duplicate event subscriptions
    expect(mockUppy.on).toHaveBeenCalledTimes(1);
  });
});
```

### 7.3 react-invenio-forms Updates

The `react-invenio-forms` package (found in dependencies) may need updates for React 19:

1. Verify if a fork exists in oarepo organization
2. If fork exists, migrate using same process
3. If no fork, ASK user to create fork first
4. Updates needed:
   - React 19 peer dependency
   - React Router DOM v7 compatibility
   - **Keep Redux patterns**
   - Uppy 5.0 hooks migration

---

## 8. Testing Strategy

### 8.1 Testing Stack

| Tool | Purpose | Version |
|------|---------|---------|
| **Vitest** | Unit test runner | ^2.0.0 |
| **@testing-library/react** | Component testing | ^16.2.0 |
| **@testing-library/jest-dom** | DOM assertions | ^6.7.0 |
| **@testing-library/user-event** | User interaction simulation | ^14.6.0 |
| **MSW** | API mocking | ^2.7.0 |
| **@vitest/coverage-v8** | Coverage reporting | ^1.1.0 |

**Note**: E2E testing is excluded - existing E2E suite handles this.

### 8.2 Test Requirements

Each migrated package MUST include:

#### Unit Tests (Minimum Coverage: 80%)

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VersionField } from './VersionField';

describe('VersionField', () => {
  it('renders the version field with correct label', () => {
    const props = { fieldPath: 'metadata.version', label: 'Version' };
    render(<VersionField {...props} />);
    expect(screen.getByText('Version')).toBeInTheDocument();
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    const props = { fieldPath: 'metadata.version', label: 'Version' };
    render(<VersionField {...props} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '1.2.3');
    expect(input).toHaveValue('1.2.3');
  });
});
```

#### Formik + Redux Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { DepositForm } from './DepositForm';

import { submitDeposit } from '../store/actions';

describe('DepositForm (Formik + Redux)', () => {
  let mockStore;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockStore = createStore(() => ({
      deposit: { isSaving: false, error: null, success: false },
    }));
    mockStore.dispatch = mockDispatch;
  });

  it('validates required fields using Formik', async () => {
    render(
      <Provider store={mockStore}>
        <DepositForm />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('dispatches Redux action on valid submission', async () => {
    render(
      <Provider store={mockStore}>
        <DepositForm />
      </Provider>
    );

    await userEvent.type(screen.getByLabelText(/title/i), 'Test Record');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: DEPOSIT_SUBMIT,
        payload: expect.objectContaining({
          title: 'Test Record',
        }),
      })
    );
  });

  it('displays loading state from Redux', () => {
    mockStore = createStore(() => ({
      deposit: { isSaving: true, error: null, success: false },
    }));

    render(
      <Provider store={mockStore}>
        <DepositForm />
      </Provider>
    );

    expect(screen.getByText(/saving/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays error from Redux state', () => {
    mockStore = createStore(() => ({
      deposit: { isSaving: false, error: { message: 'Upload failed' }, success: false },
    }));

    render(
      <Provider store={mockStore}>
        <DepositForm />
      </Provider>
    );
```

#### Uppy 5.0 Hooks Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { UppyContextProvider, useUppyState } from '@uppy/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('FileUploader (Uppy 5.0 Hooks)', () => {
  let mockUppy;

  beforeEach(() => {
    mockUppy = {
      addFile: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      close: vi.fn(),
      getState: vi.fn(() => ({
        files: {},
        totalProgress: 0,
      })),
    };

    vi.mock('@uppy/react', () => ({
      UppyContextProvider: ({ children, uppy }) => {
        window.__testUppy = uppy;
        return children;
      },
      useUppyState: vi.fn((uppy, selector) => selector(uppy.getState())),
      useUppyEvent: vi.fn((uppy, event) => {
        const [results, setResults] = useState([]);
        useEffect(() => {
          const handler = (...args) => setResults(prev => [...prev, args]);
          uppy.on(event, handler);
          return () => uppy.off(event, handler);
        }, [uppy, event]);
        return [results, () => setResults([])];
      }),
      useDropzone: vi.fn(() => ({
        getRootProps: () => ({ 'data-testid': 'dropzone' }),
        getInputProps: () => ({ type: 'file' }),
      })),
      useFileInput: vi.fn(() => ({
        getInputProps: () => ({ type: 'file', 'data-testid': 'file-input' }),
        getButtonProps: () => ({ role: 'button', 'data-testid': 'upload-button' }),
      })),
    }));
  });

  it('reads Uppy state reactively with useUppyState', () => {
    function FileList() {
      const files = useUppyState((state) => Object.values(state.files));

      return (
        <ul>
          {files.map((f) => (
            <li key={f.id}>{f.name}</li>
          ))}
        </ul>
      );
    }

    render(
      <UppyContextProvider uppy={mockUppy}>
        <FileList />
      </UppyContextProvider>
    );

    // Add mock file to state
    mockUppy.getState.mockReturnValue({
      files: { '1': { id: '1', name: 'test.pdf' } },
      totalProgress: 0,
    });

    // File should be displayed
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('handles events with useUppyEvent and automatic cleanup', () => {
    function UploadListener({ onUpload }) {
      const [results, clearResults] = useUppyEvent(mockUppy, 'upload-success');

      useEffect(() => {
        if (results.length > 0) {
          onUpload?.(results[0]);
          clearResults();
        }
      }, [results, onUpload, clearResults]);

      return null;
    }

    const onUpload = vi.fn();
    render(
      <UppyContextProvider uppy={mockUppy}>
        <UploadListener onUpload={onUpload} />
      </UppyContextProvider>
    );

    // Trigger upload-success event
    const uploadSuccessHandler = mockUppy.on.mock.calls.find(
      ([event]) => event === 'upload-success'
    );
    uploadSuccessHandler[1]('file-1', { body: { id: 'record-1' } });

    // Verify cleanup and call
    expect(onUpload).toHaveBeenCalledWith(['file-1', { body: { id: 'record-1' } }]);
  });

  it('handles Strict Mode correctly with no duplicate subscriptions', () => {
    const { rerender } = render(
      <StrictMode>
        <UppyContextProvider uppy={mockUppy}>
          <div>Test</div>
        </UppyContextProvider>
      </StrictMode>
    );

    // In Strict Mode, effects run twice
    // The hook should handle this appropriately
    expect(mockUppy.on).not.toHaveBeenCalled();
  });

  it('handles drag and drop with useDropzone', async () => {
    function DropZone() {
      const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => {
          files.forEach((f) => mockUppy.addFile(f));
        },
      });

      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <span>Drop zone</span>
        </div>
      );
    }

    render(
      <UppyContextProvider uppy={mockUppy}>
        <DropZone />
      </UppyContextProvider>
    );

    const dropZone = screen.getByText('Drop zone');
    const file = new File([''], 'test.txt');

    await userEvent.upload(dropZone, file);

    expect(mockUppy.addFile).toHaveBeenCalledWith(file);
  });
});
```

### 8.3 Verification Checklist

| Category | Test | Command |
|----------|------|---------|
| **Unit** | Component renders | `pnpm test:unit` |
| **Unit** | Props handled correctly | `pnpm test:unit` |
| **Unit** | State updates work | `pnpm test:unit` |
| **Formik** | Formik validation | `pnpm test:unit` |
| **Redux** | Redux actions dispatched | `pnpm test:unit` |
| **Redux** | Redux state updates | `pnpm test:unit` |
| **React Router v7** | Route navigation | `pnpm test:unit` |
| **Uppy** | useUppyState reactive updates | `pnpm test:unit` |
| **Uppy** | useUppyEvent automatic cleanup | `pnpm test:unit` |
| **Uppy** | useDropzone drag and drop | `pnpm test:unit` |
| **Uppy** | Strict Mode verification | `pnpm test:unit` |
| **Integration** | Redux integration | `pnpm test:integration` |
| **Build** | Production builds | `pnpm build` |
| **Lint** | No linting errors | `pnpm lint` |
| **Coverage** | ≥80% coverage | `pnpm test:coverage` |

### 8.4 Coverage Requirements

| Metric | Threshold |
|--------|-----------|
| Statement Coverage | ≥80% |
| Branch Coverage | ≥70% |
| Function Coverage | ≥80% |
| Critical Paths | 100% |
| Eligible Components | 100% |

---

## 9. Documentation Requirements

### 9.1 Code-Level Documentation

Each migrated file MUST include:

1. Migration notes with date
2. Conversion rationale (if applicable)
3. Known issues (if any)
4. Parameters with JSDoc

### 9.2 Package Documentation

Each package MUST create/update:

1. **MIGRATION_GUIDE.md**: Track migration status
2. **REACT_ARCHITECTURE.md**: Stack and patterns documentation

### 9.3 docs-invenio-rdm Updates

For each new pattern introduced, update the documentation fork:

**Fork Location**: `$WORKSPACE_ROOT/docs-invenio-rdm`

**Required Updates**:

| Pattern | Documentation Location | Section |
|---------|----------------------|---------|
| React 19 Entry Points | `docs-invenio-rdm/custom.md` | "React 19.2.4 Entry Points: createRoot" |
| React Router v7 | `docs-invenio-rdm/custom.md` | "React Router DOM v7 Migration" |
| Formik v2.4.9 + Redux | `docs-invenio-rdm/custom.md` | "Formik v2.4.9 with Redux in React 19" |
| Why Not useFormState | `docs-invenio-rdm/custom.md` | "Why We Keep Redux for Form Submissions" |
| React 19 + Redux hooks | `docs-invenio-rdm/custom.md` | "Redux Hooks (useSelector/useDispatch) with React 19" |
| Uppy 5.0 Hooks | `docs-invenio-rdm/custom.md` | "File Uploads with Uppy 5.0 Hooks in React 19" |
| UppyContextProvider | `docs-invenio-rdm/custom.md` | "Uppy 5.0 Provider Pattern" |
| useUppyState | `docs-invenio-rdm/custom.md` | "Uppy 5.0 Reactive State" |
| useUppyEvent | `docs-invenio-rdm/custom.md` | "Uppy 5.0 Event Handling" |
| useDropzone | `docs-invenio-rdm/custom.md` | "Uppy 5.0 Drag and Drop" |
| createRoot Pattern | `docs-invenio-rdm/custom.md` | "Application Entry Points" |
| Hooks Migration | `docs-invenio-rdm/custom.md` | "Converting Class Components to Hooks" |
| Testing with React 19 | `docs-invenio-rdm/testing.md` | "Component Testing" |
| Formik + Yup | `docs-invenio-rdm/custom.md` | "Form Validation with Formik and Yup" |

**Documentation Sync Strategy**:

```bash
cd $WORKSPACE_ROOT/docs-invenio-rdm
# Detect default branch
default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@') || echo "main"
git checkout "$default_branch"
git fetch upstream

# STOP and ask user on merge conflict
if ! git merge "upstream/$default_branch"; then
    echo "✗ MERGE CONFLICT in docs-invenio-rdm"
    exit 1
fi

# Create contribution branch
git checkout -b contribution-react-19-migration-docs
```

**If fork is missing - ASK user**:
```
✗ STOP: No local fork found for 'docs-invenio-rdm'
Please:
  1. Fork https://github.com/inveniosoftware/docs-invenio-rdm
  2. Clone it to $WORKSPACE_ROOT/
  3. Add upstream remote
  4. Re-run migration
```

---

## 10. Tooling Requirements

### 10.1 Migration Tooling Repository

A new repository will house all React 19 migration tooling:

- **Name**: `invenio-react-migration`
- **Organization**: `oarepo`
- **Purpose**: Universal React migration tools for ANY InvenioRDM instance

### 10.2 Repository Structure

```
invenio-react-migration/
├── README.md
├── scripts/
│   ├── migration/
│   │   ├── migrate-react19.sh          # Main migration script
│   │   ├── sync-fork.sh                # Fork synchronization
│   │   └── update-dependencies.sh      # Dependency updater
│   ├── verification/
│   │   ├── verify-react19.sh           # Post-migration verification
│   │   ├── test-coverage.sh            # Coverage verification
│   │   └── build-verify.sh             # Build verification
│   └── testing/
│       ├── generate-tests.sh           # Test generation
│       ├── run-tests.sh                # Test execution
│       └── setup-testing.sh            # Test setup
├── templates/
│   ├── migration-template.md           # Migration guide template
│   ├── test-template.js                # Test file template
│   ├── formik-component-template.js   # Formik + Redux template
│   └── uppy-hooks-template.js         # Uppy 5.0 hooks template
├── docs/
│   ├── MIGRATION_GUIDE.md              # Full migration guide
│   ├── TESTING_STRATEGY.md             # Testing documentation
│   ├── ELIGIBLE_COMPONENTS.md          # Components list with rationales
│   ├── FORMIK_REACT19_GUIDE.md         # Formik + Redux integration guide
│   └── UPPY_V5_HOOKS_GUIDE.md          # Uppy 5.0 hooks integration guide
└── package.json
```

### 10.3 Script Functionality

**migrate-react19.sh**:
- Verify fork availability
- Detect default branch
- Sync with upstream (stop on conflict)
- Create contribution branch
- Update dependencies (React 19.2.4, Redux 9.2.0, React Router v7, Uppy 5.0)
- Run codemods (including React Router v6→v7)
- Generate test scaffolds
- **Note**: Do NOT implement useFormState migration (keep Redux)

**verify-react19.sh**:
- Run all tests (unit + integration)
- Check coverage (≥80%)
- Test Uppy 5.0 hooks in Strict Mode
- Build production bundle
- Run linter
- Compare against baseline

**generate-tests.sh**:
- Automatically generate test scaffolds
- Create mocks for Redux store
- Create mocks for i18next
- Generate Uppy 5.0 hooks tests
- Generate Formik + Redux tests

---

## 11. Pitfalls & Mitigations

### 11.1 Known Pitfalls

| Pitfall | Impact | Mitigation |
|---------|--------|------------|
| **Semantic UI React compatibility** | UI library may not fully support React 19 | Upgrade to latest version (2.1.4+), test thoroughly |
| **Redux connect() deprecation** | Warning in console | Convert to hooks for connected components |
| **React Router v6 → v7** | Breaking changes | Run migrator codemod, update deprecated patterns |
| **Formik version compatibility** | Need React 19 peer support | Verify 2.4.9 works with React 19 |
| **useFormState with Redux** | Architectural mismatch | **Do NOT use** - keep Redux pattern |
| **Uppy 4 → 5 breaking changes** | Component APIs changed | Rewrite using hooks - actually beneficial |
| **Uppy state management** | New hooks pattern requires learning | Document extensively in docs-invenio-rdm |
| **Test library updates** | @testing-library/react needs update | Upgrade to v16.2+ |
| **Third-party component incompatibility** | Various react-* packages | Verify each dependency's React 19 support |
| **react-invenio-forms updates** | May need react-invenio-forms fork | Create fork if needed, migrate following same process |
| **Uppy Strict Mode issues** | v3/v4 had cleanup issues | **v5 hooks handle this automatically** |

### 11.2 Risk Mitigation Strategies

1. **Staged Rollback**: Keep git stash of pre-migration state
2. **Feature Flags**: Use flags to enable/disable migrated code paths
3. **Error Boundaries**: Wrap top-level components in error boundaries
4. **Logging**: Add extensive logging during migration period
5. **Uppy 5.0 Testing**: Hooks are designed for React 19, but test thoroughly anyway
6. **Formik Testing**: Verify Formik validation patterns work with React 19
7. **React Router Testing**: Verify routing patterns work with v7
8. **Redux Testing**: Verify Redux patterns work with React 19

### 11.3 Uppy 5.0-Specific Benefits (Not Pitfalls!)

| Previous Issue | Uppy 5.0 Solution |
|----------------|-------------------|
| Manual useEffect cleanup | `useUppyEvent` handles it automatically |
| Strict Mode double-invocation problems | Hooks are designed for this |
| Limited UI customization | Build your own with Semantic UI React |
| Large Dashboard bundle | Import only hooks you need |
| Race conditions with concurrent rendering | `useUppyState` is reactive |

### 11.4 Important: Do NOT Use useFormState

**Decision**: Keep Redux for all form submissions.

React 19's `useFormState` is NOT used for InvenioRDM deposit forms because:
- Forms rely on global Redux state
- Complex workflows (multi-step, file uploads, community selection)
- Existing Redux patterns work well
- No architectural benefit to change

**This is documented in docs-invenio-rdm and confirmed with you.**

---

## 12. Execution Plan

### 12.1 Package Migration Order

| # | Package | Fork Exists? | Lines | Priority | Eligible Components | Special Notes |
|---|---------|--------------|-------|----------|---------------------|--------------|
| 1 | Local custom code | N/A | ~358 | 1 | TBA | Simple test case |
| 2 | invenio-rdm-records | ✓ | ~35,582 | 1 | ~50+ | Includes Formik v2.4.9 + Redux, Uppy 5.0 hooks, React Router v7 |
| 3 | invenio-app-rdm | ✓ | ~12,297 | 2 | TBA | Check Formik/Upee usage |
| 4 | invenio-communities | ✓ | ~10,212 | 3 | TBA | Check Uppy usage |
| 5 | invenio-administration | ✓ | ~3,014 | 3 | TBA | React Router v7 needed |
| 6 | invenio-search-ui | ✓ | ~1,446 | 4 | TBA | React Router v7 needed |
| 7 | react-invenio-forms | TBD | TBD | **Required** | - | Check fork, ask if missing |
| 8 | docs-invenio-rdm | ✓ | - | **Required** | N/A | Docs only |
| 9-24 | Remaining forks | TBD | ~30,000+ | 5 | TBA | Check each for Formik/Uppy/Router |

### 12.2 Creation Steps

1. **Create invenio-react-migration repository** in oarepo org
2. **Generate all scripts** (migration, verification, testing)
3. **Write documentation** to the repository
4. **Test the tooling** on the local custom code
5. **Execute full migration** per package in priority order
6. **Update docs-invenio-rdm** with new patterns

### 12.3 Expected Timeline

- **Tooling creation**: 3-4 days (includes Uppy 5.0 hooks, React Router v7 templates)
- **Custom code migration**: 1 day
- **invenio-rdm-records migration**: 13-17 days (largest package, ~50+ components, Formik v2.4.9 + Redux, Uppy 5.0 hooks, React Router v7)
- **Other packages**: 6-8 days each
- **Documentation updates**: 5-6 days (concurrent, Formik+Redux, Uppy 5.0, React Router v7 patterns)
- **react-invenio-forms**: 3-4 days (if fork available)

**Total estimated**: 40-55 days

---

## Appendix A: Breaking Changes Summary

| Change | Pattern | Auto-fixable? |
|--------|---------|---------------|
| ReactDOM.render | `createRoot()` | YES (codemod) |
| ReactDOM.hydrate | `hydrateRoot()` | YES (codemod) |
| componentWillUnmount | `useEffect` cleanup | N/A (none found) |
| React Router v6 → v7 | New patterns, hooks | YES (codemod) |
| Strict Mode double-invocation | Ensure idempotent effects | NO (manual review) |
| Automatic batching | Review useEffect dependencies | NO (manual review) |
| Event pooling removed | Remove `e.persist()` | YES (codemod) |
| Uppy v3 → v5 | **Rewrite using hooks** | NO (beneficial rewrite) |
| Uppy Dashboard component | **Build custom UI** | NO (full UI control) |
| Redux → useFormState | **DO NOT DO THIS** | N/A (keep Redux) |

---

## Appendix B: React 19 New Features to Adopt

| Feature | Use Case | Priority |
|---------|----------|----------|
| **createRoot** | Application entry points | **High** (required) |
| **hydrateRoot** | SSR hydration | Medium (if used) |
| **React 19 Hooks** | `use`, `useOptimistic`, etc. | Medium |
| **Concurrent Rendering** | Interruptible rendering | Already enabled |
| **Suspense improvements** | Better loading states | Medium |
| **useFormState** | Server actions | **Low/None** (use Redux instead) |
| **useTransition** | Optimistic UI updates | Medium (for future use) |

---

## Appendix C: React 19 Patterns Documentation

### C.1 createRoot (Required)

```javascript
// OLD (React 16)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// NEW (React 19.2.4)
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### C.2 Redux Hooks with React 19

```javascript
import { useDispatch, useSelector } from 'react-redux';

function MyComponent() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.myData);

  const handleSubmit = () => {
    dispatch(myAction(data));
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### C.3 React Router DOM v7

```javascript
// OLD (v6)
import { Routes, Route, useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const handleClick = () => navigate('/path', { state: { foo: 'bar' }});
}
```

### C.4 Formik v2.4.9 + Redux Pattern (Recommended)

```javascript
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

function DepositForm() {
  const dispatch = useDispatch();
  const depositState = useSelector(state => state.deposit);

  const formik = useFormik({
    initialValues: { title: '', description: '' },
    validationSchema: depositSchema,
    onSubmit: (values) => {
      // Keep Redux dispatch
      dispatch(submitDeposit(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Field name="title" label="Title" />
      <button type="submit" disabled={depositState.isSaving}>
        {depositState.isSaving ? 'Saving...' : 'Submit'}
      </button>
      {depositState.error && <Message error>{depositState.error.message}</Message>}
    </form>
  );
}
```

### C.5 Uppy 5.0 Hooks Pattern

```javascript
import {
  UppyContextProvider,
  useUppyState,
  useUppyEvent,
  useDropzone,
  useFileInput
} from '@uppy/react';

// Provider at app level
<UppyContextProvider uppy={uppy}>
  <YourFileUploadComponents />
</UppyContextProvider>

// File list component
function FileList() {
  const files = useUppyState((s) => Object.values(s.files));
  return files.map(f => <div key={f.id}>{f.name}</div>);
}

// Drop zone
function DropZone() {
  const { getRootProps, getInputProps } = useDropzone();
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      Drag files here
    </div>
  );
}

// Event handling with automatic cleanup
function UploadHandler() {
  const [results, clear] = useUppyEvent(uppy, 'upload-success');
  // Handle results automatically
  // No useEffect needed!
}
```

---

## Appendix D: Deliverables Summary

### 1. Migration Tooling Repository
- **Name**: `invenio-react-migration`
- **Location**: `oarepo` organization
- **Contents**: All migration, verification, and test scripts
- **Universality**: Works with any InvenioRDM instance

### 2. Migrated Packages
- invenio-rdm-records (35k lines, ~50+ components including Formik v2.4.9 + Redux, Uppy 5.0 hooks, React Router v7)
- invenio-app-rdm (12k lines)
- invenio-communities (10k lines)
- invenio-administration (3k lines)
- invenio-search-ui (1k lines)

### 3. Documentation
- In-code migration notes for each converted component
- docs-invenio-rdm fork updated with React 19 patterns
- Formik v2.4.9 + Redux integration guide
- **Why we keep Redux (not useFormState)**
- **React Router DOM v7 migration guide**
- **Uppy 5.0 hooks integration guide**
- MIGRATION_GUIDE.md in each package
- REACT_ARCHITECTURE.md documenting new stack

### 4. Automated Test Suite
- Unit tests for all Priority 1-2 components
- Integration tests for key workflows
- Formik validation tests
- Redux action tests
- React Router v7 navigation tests
- **Uppy 5.0 hooks tests** (useUppyState, useUppyEvent, useDropzone)
- **Strict Mode verification for Uppy hooks**
- Test coverage ≥80%

### 5. Verification Scripts
- Automated build verification
- Test coverage verification
- **Uppy 5.0 Strict Mode verification**
- Comparison against pre-migration baseline

---

**END OF MIGRATION PLAN**
