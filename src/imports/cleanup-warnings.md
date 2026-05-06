CODE CLEANUP TASK – REMOVE WARNINGS WITHOUT BREAKING FUNCTIONALITY

OBJECTIVE
Clean the codebase to remove console warnings and React hook warnings while preserving all existing functionality. Do NOT change any application logic, UI behavior, or data flow.

--------------------------------------------------
1. CLEAN DEBUG LOGS
--------------------------------------------------

Problem:
There are 100+ console.log statements used for debugging across the codebase.

Files with most logs:
- ReportDashboard.tsx
- TemplateBuilder.tsx
- ReportCreationWizard.tsx
- RulesAndAction.tsx
- App.tsx
- Other supporting components

Required Fix:

1. Replace all console.log debugging statements with development-only logging.

Replace:

console.log(...)

With:

if (process.env.NODE_ENV === "development") {
  console.log(...)
}

2. DO NOT remove these:
- console.error(...)
- console.warn(...)

These are required for real error handling.

3. Remove unnecessary logs that provide no debugging value such as:

console.log("test")
console.log("clicked")
console.log("render")

--------------------------------------------------
2. FIX REACT useEffect DEPENDENCY WARNINGS
--------------------------------------------------

Problem:
Some useEffect hooks are missing dependencies.

Example:

useEffect(() => {
  loadTemplates()
}, [])

React warns that loadTemplates is missing from dependencies.

Required Fix:

1. Add correct dependencies to useEffect arrays.

Example fix:

Before:

useEffect(() => {
  loadTemplates()
}, [])

After:

useEffect(() => {
  loadTemplates()
}, [loadTemplates])

2. Common dependencies that must be checked:

- navigate
- sidebar
- loadTemplates
- loadReports
- loadModules
- any function referenced inside useEffect

3. Do NOT add dependencies that will cause infinite loops.

If needed, wrap functions using useCallback.

Example:

const loadTemplates = useCallback(() => {
  ...
}, [])

--------------------------------------------------
3. DO NOT MODIFY APPLICATION BEHAVIOR
--------------------------------------------------

Important constraints:

- Do NOT change component structure
- Do NOT modify builder logic
- Do NOT change module configuration system
- Do NOT change drag & drop behavior
- Do NOT modify report creation flow
- Do NOT modify template builder logic
- Do NOT change API calls
- Do NOT change routing

This task is strictly for removing warnings and cleaning debug logs.

--------------------------------------------------
4. PRESERVE CURRENT FEATURES
--------------------------------------------------

Ensure the following features remain fully functional:

- Template Builder
- Module drag and drop
- Representation type configuration
- Module settings panel
- Report creation wizard
- Report dashboard
- Preview rendering
- Section builder
- Notes / text modules
- Divider blocks

--------------------------------------------------
5. RESULT EXPECTATION
--------------------------------------------------

After cleanup:

- Console should no longer show excessive debug logs
- React dependency warnings should be resolved
- Application behavior must remain exactly the same
- Codebase becomes production-ready

--------------------------------------------------
END OF TASK
--------------------------------------------------