# Zalo Mini App

## Development

### Using Zalo Mini App Extension

1. Install [Visual Studio Code](https://code.visualstudio.com/download) and [Zalo Mini App Extension](https://mini.zalo.me/docs/dev-tools).
1. In the **Home** tab, process **Config App ID** and **Install Dependencies**.
1. Navigate to the **Run** tab, select the suitable launcher, and click **Start**.

### Using Zalo Mini App CLI

1. [Install Node JS](https://nodejs.org/en/download/).
1. [Install Zalo Mini App CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/).
1. **Install dependencies**:
   ```bash
   npm install
   ```
1. **Start** the dev server:
   ```bash
   zmp start
   ```
1. **Open** `localhost:3000` in your browser.

## Deployment

1. **Create** a mini program. For instructions on how to create a mini program, please refer to the [Coffee Shop Tutorial](https://mini.zalo.me/tutorial/coffee-shop/step-1/)

1. **Deploy** your mini program to Zalo using the mini app ID created.

   - **Using Zalo Mini App Extension**: navigate to the **Deploy** panel > **Login** > **Deploy**.
   - **Using Zalo Mini App CLI**:
     ```bash
     zmp login
     zmp deploy
     ```

1. Open the mini app in Zalo by scanning the QR code.

## Resources

- [Zalo Mini App Official Website](https://mini.zalo.me/)
- [ZaUI Documentation](https://mini.zalo.me/documents/zaui/)
- [ZMP SDK Documentation](https://mini.zalo.me/documents/api/)
- [DevTools Documentation](https://mini.zalo.me/docs/dev-tools/)
- [Ready-made Mini App Templates](https://mini.zalo.me/zaui-templates)
- [Community Support](https://mini.zalo.me/community)


git checkout "feature/task4"

Implementation Plan: Tasks 04.1 - 04.4 (Business Management)
This plan outlines the steps to implement the management features for Users, Branches, and System Configuration with Tenant isolation.

Proposed Changes
[04.1] User/Employee Management
BaseTable: Create a reusable table component using Tailwind if not already present.
UsersPage: Refactor 
src/pages/Users/index.tsx
 to use BaseTable.
UserModal: Update to support roles (ADMIN, STAFF) and better validation.
API: Ensure userService calls include tenant_id where necessary.
[04.2] Branch/Store Management
NEW branch.service.ts: API service for Branch CRUD.
NEW Pages/Branches: List and Modal for managing stores.
Isolation: Filter branches by current tenantId.
[04.3] System Configuration
NEW Pages/Settings: Form for Name, Website, Logo, and Color.
Logo Upload: Add a preview feature before uploading to the backend.
Theme Sync: Use the tenantConfig hook to update ConfigProvider themes in real-time.
[04.4] Integration & Quality
E2E Check: Validate data isolation and responsive design.
Verification Plan
Automated Tests
N/A
Manual Verification
User CRUD: Create/Edit/Delete users and verify status toggle.
Branch CRUD: Manage multiple branches and check tenant isolation.
Config: Change the primary color and logo; verify they apply globally.
Responsive: Test on multiple screen sizes.