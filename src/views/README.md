# Views Directory

This directory contains the top-level page components for each route in the application.

## Structure

The views are organized into subdirectories based on their functionality:

-   `/auth`: Contains components related to user authentication (Login, Register).
-   `/booking`: Contains components for the multi-step appointment booking process.
-   `... and other main pages`

---

## Modified Views for Signature Feature

### `auth/Auth.vue`

-   **Purpose**: Acts as a container for the Login and Register tabs.
-   **No major logic change**. It simply hosts the `Register.vue` component, which now contains the new workflow.

### `auth/Register.vue`

-   **Purpose**: Handles the user registration form.
-   **Major Change**: The form submission (`@submit.prevent`) no longer directly triggers the registration logic. 
    1.  It now calls a new method `promptTermsAgreement()` which validates the form fields.
    2.  If the form is valid, it then calls the `open()` method on the `<TermsDialog>` component.
    3.  The actual registration logic (`handleRegister`) is now only executed when the `<TermsDialog>` component emits the `@agree` event (after the user has scrolled and signed the contract).
-   **Dependencies**: `TermsDialog.vue`.
