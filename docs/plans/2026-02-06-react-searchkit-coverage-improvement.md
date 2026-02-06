# React-SearchKit Coverage Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve react-searchkit test coverage from current ~75% to >90% across all components, focusing on components currently below 90%.

**Architecture:** Add comprehensive test cases for low-coverage React components using Jest, Enzyme (shallow/mount), and React context providers. Tests follow existing patterns with proper prop validation and edge case coverage.

**Tech Stack:**
- Jest (testing framework)
- Enzyme (React component testing)
- React 16.13.0 (testing with AppContext.Provider)
- pnpm (package manager for JavaScript dependencies)

---

## Current Coverage Status

**Already Complete (>90%) ✓**
- `lib/state/actions`: 98.34% ✓
- `lib/state/reducers`: 96.55%
- `lib/state/selectors`: 95.91%
- `lib/state/types`: 100%

**Components Below 90% (Priority Order)**
- Toggle: 70.58%
- Error: 70%
- SortBy: 69.23%
- ResultsPerPage: 69.23%
- ResultsList: 63.15%
- ResultsGrid: 63.15%
- LayoutSwitcher: 60%
- AutocompleteSearchBar: 60%

---

### Task 1: Improve Toggle Component Coverage (70.58% → >90%) ✅ COMPLETE

**Status:** Completed commit 2711212, 5 tests added, 547/547 passing

**Note:** `label` is required prop with `isRequired` - uses `label={null}` as edge case

### Task 2: Improve Error Component Coverage (70% → >90%)

**Files:**
- Modify: `src/lib/components/Error/Error.edge.test.js`
- Reference: `src/lib/components/Error/Error.js`

**Step 1: Examine Error component implementation**

Read: `src/lib/components/Error/Error.js`
Focus on:
- ShouldRender condition (!loading && !_isEmpty(error))
- Element component rendering pattern
- Overridable wrapper usage

**Step 2: Write test for Error with loading=true**

```javascript
it("should not render when loading is true", () => {
  const props = {
    loading: true,
    error: new Error("Test error"),
  };
  const wrapper = mount(
    <AppContext.Provider
      value={{ appName: "MyApp", buildUID: (x, y) => `${x}-${y}` }}
    >
      <ErrorComponent {...props} />
    </AppContext.Provider>
  );
  expect(wrapper.find("Overridable").exists()).toBe(false);
  wrapper.unmount();
});
```

**Step 3: Run Error tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/Error/Error.edge.test.js`
Expected: PASS

**Step 4: Write test for Error with custom overridableId**

```javascript
it("should render with custom overridableId", () => {
  const props = {
    loading: false,
    error: new Error("Test error"),
    overridableId: "custom-error",
  };
  const wrapper = mount(
    <AppContext.Provider
      value={{ appName: "MyApp", buildUID: (x, y) => `${x}-${y}` }}
    >
      <ErrorComponent {...props} />
    </AppContext.Provider>
  );
  expect(wrapper.exists()).toBe(true);
  wrapper.unmount();
});
```

**Step 5: Run Error tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/Error/Error.edge.test.js`
Expected: PASS

**Step 6: Create Error.edge.test.js file if it doesn't exist**

Run: `cd react-searchkit && ls src/lib/components/Error/Error.edge.test.js`
If not exists, create with: `touch src/lib/components/Error/Error.edge.test.js`

**Step 7: Add header and imports to Error.edge.test.js**

```javascript
/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018-2022 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { mount } from "enzyme";
import ErrorComponent from "./Error";
import { AppContext } from "../ReactSearchKit";

describe("Error - additional test scenarios for component interaction and prop coverage", () => {
```

**Step 8: Run Error tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/Error/Error.edge.test.js`
Expected: PASS

**Step 9: Commit**

```bash
cd react-searchkit
git add src/lib/components/Error/Error.edge.test.js
git commit -m "test: add additional test scenarios for Error component, improve coverage

- Add tests for loading state
- Add tests for custom overridableId
- Add tests for various error object types

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Improve SortBy Component Coverage (69.23% → >90%)

**Files:**
- Modify: `src/lib/components/SortBy/SortBy.edge.test.js`
- Reference: `src/lib/components/SortBy/SortBy.js`

**Step 1: Examine SortBy component implementation**

Read: `src/lib/components/SortBy/SortBy.js`
Focus on:
- ShouldRender condition (currentSortBy !== null && !loading && totalResults > 0)
- Dropdown options mapping
- Element prop passing

**Step 2: Write test for SortBy with empty options array**

```javascript
it("should handle empty options array", () => {
  const props = {
    ...defaultProps,
    loading: false,
    options: [],
  };
  const wrapper = shallow(<SortBy {...props} buildUID={buildUID} />);
  const Dropdown = wrapper.find("Dropdown");
  expect(Dropdown.prop("options")).toEqual([]);
});
```

**Step 3: Run SortBy tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/SortBy/SortBy.edge.test.js`
Expected: PASS

**Step 4: Write test for SortBy with single option**

```javascript
it("should handle single option array", () => {
  const props = {
    ...defaultProps,
    loading: false,
    options: [{ value: "newest", text: "Newest" }],
  };
  const wrapper = shallow(<SortBy {...props} buildUID={buildUID} />);
  const Dropdown = wrapper.find("Dropdown");
  const dropdownOptions = Dropdown.prop("options");
  expect(dropdownOptions).toHaveLength(1);
  expect(dropdownOptions[0]).toEqual({ key: 0, text: "Newest", value: "newest" });
});
```

**Step 5: Run SortBy tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/SortBy/SortBy.edge.test.js`
Expected: PASS

**Step 6: Write test for SortBy with custom overridableId**

```javascript
it("should render with custom overridableId", () => {
  const props = {
    ...defaultProps,
    loading: false,
    overridableId: "custom-sort-by",
  };
  const wrapper = shallow(<SortBy {...props} buildUID={buildUID} />);
  expect(wrapper.find("Dropdown").exists()).toBe(true);
  expect(
    wrapper.find("Overridable").prop("overridableId")
  ).toBe("custom-sort-by");
});
```

**Step 7: Run SortBy tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/SortBy/SortBy.edge.test.js`
Expected: PASS

**Step 8: Commit**

```bash
cd react-searchkit
git add src/lib/components/SortBy/SortBy.edge.test.js
git commit -m "test: add additional test scenarios for SortBy component, improve coverage

- Add tests for empty options array
- Add tests for single option array
- Add tests for custom overridableId

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Improve ResultsPerPage Component Coverage (69.23% → >90%)

**Files:**
- Modify: `src/lib/components/ResultsPerPage/ResultsPerPage.edge.test.js`
- Reference: `src/lib/components/ResultsPerPage/ResultsPerPage.js`

**Step 1: Examine ResultsPerPage component implementation**

Read: `src/lib/components/ResultsPerPage/ResultsPerPage.js`
Focus on:
- ShouldRender condition (!loading && values.length > 0)
- Dropdown value mapping (currentSize)
- Element prop patterns

**Step 2: Write test for ResultsPerPage with empty values array**

```javascript
it("should handle empty values array", () => {
  const props = {
    loading: false,
    values: [],
    currentSize: null,
    updateQuerySize: jest.fn(),
  };
  const wrapper = shallow(<ResultsPerPage {...props} buildUID={buildUID} />);
  expect(wrapper.find("Dropdown").exists()).toBe(false);
});
```

**Step 3: Run ResultsPerPage tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/ResultsPerPage/ResultsPerPage.edge.test.js`
Expected: PASS

**Step 4: Write test for ResultsPerPage with custom overridableId**

```javascript
it("should render with custom overridableId", () => {
  const props = {
    loading: false,
    values: [{ value: 10, text: "10" }],
    currentSize: 10,
    updateQuerySize: jest.fn(),
    overridableId: "custom-results-per-page",
  };
  const wrapper = shallow(<ResultsPerPage {...props} buildUID={buildUID} />);
  expect(wrapper.find("Dropdown").exists()).toBe(true);
  expect(
    wrapper.find("Overridable").prop("overridableId")
  ).toBe("custom-results-per-page");
});
```

**Step 5: Run ResultsPerPage tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/ResultsPerPage/ResultsPerPage.edge.test.js`
Expected: PASS

**Step 6: Commit**

```bash
cd react-searchkit
git add src/lib/components/ResultsPerPage/ResultsPerPage.edge.test.js
git commit -m "test: add additional test scenarios for ResultsPerPage component, improve coverage

- Add tests for empty values array
- Add tests for custom overridableId

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Improve ResultsList Component Coverage (63.15% → >90%)

**Files:**
- Modify: `src/lib/components/ResultsList/ResultsList.edge.test.js`
- Reference: `src/lib/components/ResultsList/ResultsList.js`

**Step 1: Examine ResultsList component implementation**

Read: `src/lib/components/ResultsList/ResultsList.js`
Focus on:
- ShouldRender condition (!loading && results.length > 0)
- Element rendering (Grid from semantic-ui-react)
- ResultItem rendering pattern

**Step 2: Write test for empty results array**

```javascript
it("should not render when results array is empty", () => {
  const props = {
    loading: false,
    results: [],
    updateQueryState: jest.fn(),
  };
  const wrapper = shallow(<ResultsList {...props} buildUID={buildUID} />);
  expect(wrapper.find("Grid").exists()).toBe(false);
});
```

**Step 3: Run ResultsList tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/ResultsList/ResultsList.edge.test.js`
Expected: PASS

**Step 4: Write test for ResultsList with custom overridableId**

```javascript
it("should render with custom overridableId", () => {
  const props = {
    loading: false,
    results: [{ id: "1", title: "Test" }],
    updateQueryState: jest.fn(),
    overridableId: "custom-results-list",
  };
  const wrapper = shallow(<ResultsList {...props} buildUID={buildUID} />);
  expect(wrapper.find("Grid").exists()).toBe(true);
});
```

**Step 5: Run ResultsList tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/ResultsList/ResultsList.edge.test.js`
Expected: PASS

**Step 6: Commit**

```bash
cd react-searchkit
git add src/lib/components/ResultsList/ResultsList.edge.test.js
git commit -m "test: add additional test scenarios for ResultsList component, improve coverage

- Add tests for empty results array
- Add tests for custom overridableId

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Improve ResultsGrid Component Coverage (63.15% → >90%)

**Files:**
- Modify: `src/lib/components/ResultsGrid/ResultsGrid.edge.test.js`
- Reference: `src/lib/components/ResultsGrid/ResultsGrid.js`

**Step 1: Examine ResultsGrid component implementation**

Read: `src/lib/components/ResultsGrid/ResultsGrid.js`
Focus on:
- ShouldRender condition (!loading && results.length > 0)
- Element rendering (Grid from semantic-ui-react)
- Card rendering pattern

**Step 2: Write test for empty results array**

```javascript
it("should not render when results array is empty", () => {
  const props = {
    loading: false,
    results: [],
    updateQueryState: jest.fn(),
  };
  const wrapper = shallow(<ResultsGrid {...props} buildUID={buildUID} />);
  expect(wrapper.find("Grid").exists()).toBe(false);
});
```

**Step 3: Run ResultsGrid tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/ResultsGrid/ResultsGrid.edge.test.js`
Expected: PASS

**Step 4: Write test for ResultsGrid with custom overridableId**

```javascript
it("should render with custom overridableId", () => {
  const props = {
    loading: false,
    results: [{ id: "1", title: "Test" }],
    updateQueryState: jest.fn(),
    overridableId: "custom-results-grid",
  };
  const wrapper = shallow(<ResultsGrid {...props} buildUID={buildUID} />);
  expect(wrapper.find("Grid").exists()).toBe(true);
});
```

**Step 5: Run ResultsGrid tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/ResultsGrid/ResultsGrid.edge.test.js`
Expected: PASS

**Step 6: Commit**

```bash
cd react-searchkit
git add src/lib/components/ResultsGrid/ResultsGrid.edge.test.js
git commit -m "test: add additional test scenarios for ResultsGrid component, improve coverage

- Add tests for empty results array
- Add tests for custom overridableId

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Improve LayoutSwitcher Component Coverage (60% → >90%)

**Files:**
- Modify: `src/lib/components/LayoutSwitcher/LayoutSwitcher.edge.test.js`
- Reference: `src/lib/components/LayoutSwitcher/LayoutSwitcher.js`

**Step 1: Examine LayoutSwitcher component implementation**

Read: `src/lib/components/LayoutSwitcher/LayoutSwitcher.js`
Focus on:
- ShouldRender condition (totalResults > 0 && !loading)
- Menu/Menu.Item rendering
- Button interaction with updateLayout

**Step 2: Write test for LayoutSwitcher with zero totalResults**

```javascript
it("should not render when totalResults is 0", () => {
  const props = {
    loading: false,
    currentLayout: "list",
    totalResults: 0,
    updateLayout: jest.fn(),
  };
  const wrapper = shallow(<LayoutSwitcher {...props} buildUID={buildUID} />);
  expect(wrapper.find("Menu").exists()).toBe(false);
});
```

**Step 3: Run LayoutSwitcher tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/LayoutSwitcher/LayoutSwitcher.edge.test.js`
Expected: PASS

**Step 4: Write test for LayoutSwitcher with custom overridableId**

```javascript
it("should render with custom overridableId", () => {
  const props = {
    loading: false,
    currentLayout: "list",
    totalResults: 10,
    updateLayout: jest.fn(),
    overridableId: "custom-layout-switcher",
  };
  const wrapper = shallow(<LayoutSwitcher {...props} buildUID={buildUID} />);
  expect(wrapper.exists()).toBe(true);
});
```

**Step 5: Run LayoutSwitcher tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/LayoutSwitcher/LayoutSwitcher.edge.test.js`
Expected: PASS

**Step 6: Commit**

```bash
cd react-searchkit
git add src/lib/components/LayoutSwitcher/LayoutSwitcher.edge.test.js
git commit -m "test: add additional test scenarios for LayoutSwitcher component, improve coverage

- Add tests for zero totalResults
- Add tests for custom overridableId

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Improve AutocompleteSearchBar Component Coverage (60% → >90%)

**Files:**
- Create: `src/lib/components/AutocompleteSearchBar/AutocompleteSearchBar.edge.test.js`
- Reference: `src/lib/components/AutocompleteSearchBar/AutocompleteSearchBar.js`

**Step 1: Examine AutocompleteSearchBar component implementation**

Read: `src/lib/components/AutocompleteSearchBar/AutocompleteSearchBar.js`
Focus on:
- ShouldRender condition
- Input rendering and suggestions
- onSuggestionSelected handler

**Step 2: Create AutocompleteSearchBar.edge.test.js with header**

```javascript
/*
 * This file is part of React-SearchKit.
 * Copyright (C) 2018-2022 CERN.
 *
 * React-SearchKit is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import { shallow } from "enzyme";
import AutocompleteSearchBar from "./AutocompleteSearchBar";
import { AppContext } from "../ReactSearchKit";

describe("AutocompleteSearchBar - additional test scenarios for component interaction and prop coverage", () => {
```

**Step 3: Add basic setup and description**

```javascript
  const buildUID = (x, y) => `${x}-${y}`;

  const defaultProps = {
    queryString: "",
    onInputChange: jest.fn(),
    updateQueryState: jest.fn(),
    suggestions: [],
    executeSuggestionQuery: jest.fn(),
  };

  afterAll(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });
```

**Step 4: Write test for AutocompleteSearchBar with empty suggestions**

```javascript
  it("should render with empty suggestions", () => {
    const props = {
      loading: false,
      suggestions: [],
    };
    const wrapper = shallow(<AutocompleteSearchBar {...props} buildUID={buildUID} />);
    expect(wrapper.exists()).toBe(true);
  });
```

**Step 5: Run AutocompleteSearchBar tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/AutocompleteSearchBar/AutocompleteSearchBar.edge.test.js`
Expected: PASS

**Step 6: Write test for AutocompleteSearchBar with custom overridableId**

```javascript
  it("should render with custom overridableId", () => {
    const props = {
      loading: false,
      suggestions: [],
      overridableId: "custom-autocomplete",
    };
    const wrapper = shallow(<AutocompleteSearchBar {...props} buildUID={buildUID} />);
    expect(wrapper.exists()).toBe(true);
  });
```

**Step 7: Run AutocompleteSearchBar tests**

Run: `cd react-searchkit && CI=true pnpm test src/lib/components/AutocompleteSearchBar/AutocompleteSearchBar.edge.test.js`
Expected: PASS

**Step 8: Commit**

```bash
cd react-searchkit
git add src/lib/components/AutocompleteSearchBar/AutocompleteSearchBar.edge.test.js
git commit -m "test: add additional test scenarios for AutocompleteSearchBar component, improve coverage

- Add tests for empty suggestions
- Add tests for custom overridableId

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Final Coverage Verification

**Files:**
- No file changes - verification only

**Step 1: Run full test suite with coverage**

Run: `cd react-searchkit && CI=true pnpm test --coverage`

**Step 2: Check coverage report**

Run: `cd react-searchkit && python3 << 'PYEOF'
import html
import re

with open('coverage/index.html') as f:
    content = f.read()

rows = re.findall(r'<tr[^>]*>[\s\S]*?</tr>', content)

for row in rows:
    if 'All files' in row:
        cols = re.findall(r'<td[^>]*>([^<]*)</td>', row)
        if len(cols) >= 5:
            print(f"Overall Coverage - Statements: {cols[1]}, Branches: {cols[2]}, Functions: {cols[3]}, Lines: {cols[4]}")
    elif 'lib/components/' in row and 'src/' not in row:
        cols = re.findall(r'<td[^>]*>([^<]*)</td>', row)
        if len(cols) >= 5:
            name = cols[0].strip()
            stmt = cols[1].strip()
            if '%' in stmt:
                pct = float(stmt.replace('%', ''))
                if pct < 90:
                    print(f"Below 90%: {name} = {stmt}")
PYEOF
`

**Expected Output:** All main components should show >90% coverage

**Step 3: Verify all tests pass**

Run: `cd react-searchkit && CI=true pnpm test`

Expected: All test suites pass

**Step 4: Commit (if any changes needed)**

If any test files were modified during verification:

```bash
cd react-searchkit
git add .
git commit -m "test: final coverage improvements, verify all components >90%

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Testing Patterns Reference

**Common imports:**
```javascript
import React from "react";
import { shallow, mount } from "enzyme";
import ComponentName from "./ComponentName";
import { AppContext } from "../ReactSearchKit";
```

**Common setup:**
```javascript
const buildUID = (x, y) => `${x}-${y}`;

const defaultProps = {
  /* Component-specific props */
};

afterAll(() => {
  if (wrapper) {
    wrapper.unmount();
  }
});
```

**Test naming convention:**
- `describe("Component name - additional test scenarios for component interaction and prop coverage")`
- `it("should [do something] when [condition]")`

**Commit message format:**
```
test: add additional test scenarios for [Component] component, improve coverage

- [Brief description of test additions]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

Plan complete and saved to `docs/plans/2026-02-06-react-searchkit-coverage-improvement.md`.

**Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
