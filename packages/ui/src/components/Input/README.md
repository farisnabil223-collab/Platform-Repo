# Input Component

Form text field input.

## Properties
- `label`: string
- `error`: string (displays error message text and styles borders)
- `helperText`: string
- `fullWidth`: boolean

## Accessibility
- Implements `aria-invalid` based on validation error status.
- Integrates `aria-describedby` referencing error messages and helper nodes.
- Fully supports keyboard input and focus outlines.
