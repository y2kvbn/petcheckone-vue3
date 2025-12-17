# Components Directory

This directory contains all the reusable Vue components for the application.

## Component List

### `TermsDialog.vue` (New)

-   **Purpose**: A comprehensive dialog for ensuring user agreement to terms and services before critical actions like registration.
-   **Features**:
    -   Displays a scrollable content area for legal documents (like a service contract).
    -   **Scroll-to-End**: Detects if the user has scrolled to the bottom of the content.
    -   **Signature Pad**: Integrates `vue-signature-pad` to capture a user's digital signature as a form of agreement.
    -   The final confirmation button is only enabled after the user has scrolled to the end AND provided a signature.
-   **Dependencies**: `vue-signature-pad`, `PetServiceContract.vue`.
-   **Events**:
    -   `@agree`: Emitted when the user successfully completes the signature and clicks the final confirmation button.

### `legal/PetServiceContract.vue` (New)

-   **Purpose**: A static component that holds the formatted HTML content of the pet service contract.
-   **Features**:
    -   Contains all the legal text, sectioned and styled for readability.
    -   Decoupled from the application logic, making it easy for non-developers to update the terms by just editing the text in this file.
-   **Dependencies**: None.

