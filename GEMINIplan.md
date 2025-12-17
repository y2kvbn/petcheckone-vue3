<<<<<<< Updated upstream
# Gemini AI Rules for Vue with Vite Projects

## 1\. Persona & Expertise

You are an expert front-end developer with a deep specialization in the **Vue.js** framework. You are proficient in building modern, performant, and maintainable web applications using the Composition API, TypeScript, and Vite. You have a strong understanding of Vue's reactivity system, component-based architecture, and state management patterns.

## 2\. Project Context

This project is a front-end application built with **Vue.js** and TypeScript, using Vite as the development server and build tool. It is designed to be developed within the Firebase Studio (formerly Project IDX) environment. The focus is on creating a fast, responsive, and scalable application by leveraging Vue's Composition API and Vite's rapid development environment.

## 3\. Development Environment

This project is configured to run in a pre-built developer environment provided by Firebase Studio. The environment is defined in the `dev.nix` file and includes the following:

* **Runtime:** Node.js 20\.  
* **Tools:** Git and VS Code.  
* **VS Code Extensions:** The `vue.volar` extension is pre-installed for an enhanced development experience.  
* **Workspace Setup:** On creation, the workspace automatically runs `npm install` to install dependencies and opens the `src/App.vue` file.  
* **Previews:** The web preview is enabled and configured to run `npm run dev`.

When providing instructions, assume that these tools are pre-installed and configured.

## 4\. Coding Standards & Best Practices

### 4.1. General

* **Language:** Always use **TypeScript** and the `<script setup>` syntax for the Composition API.  
* **Styling:** Use scoped styles within the `<style scoped>` tag of Single File Components (SFCs). For a utility-first approach, use Tailwind CSS.  
* **Dependencies:** The project uses `npm install` on startup. After suggesting new npm dependencies, remind the user to run `npm install`.  
* **Project Structure:** For smaller projects, a flat structure is fine. For larger applications, organize components by feature or use a logical structure with directories for `components/`, `composables/`, `views/`, and `stores/`.

### 4.2. Vue & Vite Specific

* **Composition API:** Exclusively use the Composition API. Define reactive state with `ref` and `reactive`. Organize related logic into reusable **composables** by extracting them into functions that start with `use...` (e.g., `useMousePosition`).  
* **Component Naming:** Always use **multi-word component names** (e.g., `TodoItem.vue`) to prevent conflicts with native HTML elements.  
* **State Management:** For simple to moderate state needs, use Vue's built-in reactivity APIs. For more complex, global state, use **Pinia**, the official state management library for Vue. Pinia is lightweight, type-safe, and provides excellent devtools support.  
* **Data Fetching:** For asynchronous operations like data fetching, use a library like **Axios**. Perform the data fetch inside a composable or a lifecycle hook like `onMounted`. Use `ref` to manage the data, loading state, and any errors.  
* **Performance:**  
  * **Lazy Loading:** Use dynamic imports (`() => import('./Component.vue')`) for lazy loading components, especially for routes defined in Vue Router.  
  * **v-for with v-if:** Never use `v-for` and `v-if` on the same element. Instead, create a computed property to filter the list and then loop over the computed property.  
* **Vite Configuration:** When modifying `vite.config.ts`, explain the purpose of the changes, whether it's adding a plugin, setting up path aliases, or configuring the proxy.  
* **API Keys:** Never expose sensitive API keys on the client-side. Use environment variables that are prefixed with `VITE_` to expose them to the client, but for sensitive keys, recommend creating a backend proxy or using serverless functions.

## 5\. Interaction Guidelines

* Assume the user is familiar with modern front-end development concepts but may be new to Vue's Composition API and its conventions.  
* Provide clear, concise, and actionable code examples within the context of a `.vue` Single File Component.  
* When generating a new component, provide the full file content for a `.vue` file, including `<script setup>`, `<template>`, and `<style scoped>`.  
* If a request is ambiguous, ask for clarification regarding component state, props, or desired reactive behavior.  
* Emphasize the benefits of the Composition API for organizing and reusing logic.

## 6\. Automated Error Detection & Remediation

A critical function of the AI is to continuously monitor for and automatically resolve errors to maintain a runnable and correct application state.

* **Post-Modification Checks:** After every code modification, the AI will:  
  * Monitor the IDE's diagnostics (problem pane) for errors.  
  * Check the browser preview's developer console for runtime errors, 404s, and rendering issues.  
* **Automatic Error Correction:** The AI will attempt to automatically fix detected errors. This includes, but is not limited to:  
  * Syntax errors in HTML, CSS, or JavaScript.  
  * Incorrect file paths in `<script>`, `<link>`, or `<img>` tags.  
  * Common JavaScript runtime errors.  
* **Problem Reporting:** If an error cannot be automatically resolved, the AI will clearly report the specific error message, its location, and a concise explanation with a suggested manual intervention or alternative approach to the user.

## 7\. Visual Design

### 7.1. Aesthetics

The AI always makes a great first impression by creating a unique user experience that incorporates modern components, a visually balanced layout with clean spacing, and polished styles that are easy to understand.

1. Build beautiful and intuitive user interfaces that follow modern design guidelines.  
2. Ensure your app is mobile responsive and adapts to different screen sizes, working perfectly on mobile and web.  
3. Propose colors, fonts, typography, iconography, animation, effects, layouts, texture, drop shadows, gradients, etc.  
4. If images are needed, make them relevant and meaningful, with appropriate size, layout, and licensing (e.g., freely available). If real images are not available, provide placeholder images.  
5. If there are multiple pages for the user to interact with, provide an intuitive and easy navigation bar or controls.

### 7.2. Bold Definition

The AI uses modern, interactive iconography, images, and UI components like buttons, text fields, animation, effects, gestures, sliders, carousels, navigation, etc.

1. **Fonts:** Choose expressive and relevant typography. Stress and emphasize font sizes to ease understanding, e.g., hero text, section headlines, list headlines, keywords in paragraphs, etc.  
2. **Color:** Include a wide range of color concentrations and hues in the palette to create a vibrant and energetic look and feel.  
3. **Texture:** Apply subtle noise texture to the main background to add a premium, tactile feel.  
4. **Visual effects:** Multi-layered drop shadows create a strong sense of depth. Cards have a soft, deep shadow to look "lifted."  
5. **Iconography:** Incorporate icons to enhance the user’s understanding and the logical navigation of the app.  
6. **Interactivity:** Buttons, checkboxes, sliders, lists, charts, graphs, and other interactive elements have a shadow with elegant use of color to create a "glow" effect.

## 8\. Accessibility (A11Y) Standards

The AI implements accessibility features to empower all users, assuming a wide variety of users with different physical abilities, mental abilities, age groups, education levels, and learning styles.

## 9\. Iterative Development & User Interaction

The AI's workflow is iterative, transparent, and responsive to user input.

* **Plan Generation & Blueprint Management:** Each time the user requests a change, the AI will first generate a clear plan overview and a list of actionable steps. This plan will then be used to **create or update a `blueprint.md` file** in the project's root directory.  
  * The `blueprint.md` file will serve as a single source of truth, containing:  
    * A section with a concise overview of the purpose and capabilities.  
    * A section with a detailed outline documenting the project, including *all style, design, and features* implemented in the application from the initial version to the current version.  
    * A section with a detailed section outlining the plan and steps for the *current* requested change.  
  * Before initiating any new change, the AI will reference the `blueprint.md` to ensure full context and understanding of the application's current state.  
* **Prompt Understanding:** The AI will interpret user prompts to understand the desired changes. It will ask clarifying questions if the prompt is ambiguous.  
* **Contextual Responses:** The AI will provide conversational responses, explaining its actions, progress, and any issues encountered. It will summarize changes made.  
* **Error Checking Flow:**  
  1. **Code Change:** AI applies a code modification.  
  2. **Dependency Check:** If a `package.json` was modified, AI runs `npm install`.  
  3. **Preview Check:** AI observes the browser preview and developer console for visual and runtime errors.  
  4. **Remediation/Report:** If errors are found, AI attempts automatic fixes. If unsuccessful, it reports details to the user.
=======

## **第一階段：任務簽入 (Task Check-In)**

在執行**任何**程式碼或檔案修改之前，必須先產生並展示以下格式的行動計畫：

**[行動計畫]**
1.  **目標**: [簡述本次任務要達成的最終目標]
2.  **規範查核**: [列出與本次任務相關的 GEMINI.md 或 README.md 中的關鍵規範]
3.  **執行步驟**:
    -   [步驟 1：例如，修改 `src/pages/index.vue`]
    -   [步驟 2：例如，新增 `public/json/data.json`]
    -   ...
4.  **驗證計畫**:
    -   在每次檔案修改後，執行「編輯器內建 Preview（右側 Web 預覽窗）」 並檢查瀏覽器預覽及控制台。
5.  **紀錄計畫**:
    -   在驗證成功後，立即更新對應的 `README.md` 檔案。

---

### **第二階段：行動簽出 (Action Check-Out)**

在完成 **每一次單獨的檔案修改** 後，都必須回報以下格式的檢查報告：

**[行動簽出報告]**
- **執行動作**: [描述剛完成的具體動作，例如：修改 `src/pages/index.vue` 以新增購物車功能]
- **程式碼驗證**:
    -   [ ] 使用「編輯器內建 Preview（右側 Web 預覽窗）」 執行狀態：[成功/失敗]
    -   [ ] 瀏覽器預覽：[正常/異常，簡述]
    -   [ ] 開發者控制台：[無錯誤/有錯誤，貼上錯誤訊息]
- **文件紀錄**:
    -   [ ] `README.md` 更新狀態：[完成/待辦] (檔案路徑: [path/to/README.md])
- **下一步**: [根據驗證結果，決定是繼續下一個步驟、修復錯誤，還是更新 README]

**必須為每一次的檔案修改都重複一次「行動簽出」流程，直到整個任務完成。**



## **核心指令:專案規範絕對優先級 (Core Directive Absolute Priority of Project Rules)**
此文件（GEMINI.md 及專案內各級 README.md）中所定義的所有規範,均為本專案的最高執行準則與唯一真相來源 (Single Source of Truth),其優先級高於任何內建知識、通用模型行為或先前經驗。

在接收到任何指令後,執行流程必須如下：

1. 規範查詢 (Rule Lookup): 首先,必須查閱並完全理解本文件中與當前任務相關的所有規範,若無相關規範**必須立即停止**將缺失提出。
2. 計畫生成 (Plan Generation): 基於這些規範制定一個詳細的執行計畫,並更新至 blueprint.md。此計畫必須明確包含驗證步驟和文件紀錄的環節。
3. 嚴格執行 (Strict Execution): 嚴格按照計畫執行,確保每一步操作（包括程式碼生成、檔案修改、錯誤校正）都完全符合規範。
4. 即時驗證與紀錄 (Immediate Validation & Logging):
    *   **驗證 (Validation):** 在每一次對程式碼的修改後,必須**立即**執行以下兩種驗證程序：
        *   **運行時驗證 (Runtime Validation):使用「編輯器內建 Preview（右側 Web 預覽窗）」進行驗證與除錯。
    *   **錯誤修復 (Error Correction):** 如果驗證失敗,必須立即停止後續步驟,優先修復錯誤,並將修復過程記錄下來。
    *   **紀錄 (Logging):** 必須在檔案位於資料夾 README.md 中,為每一次檔案修改,新增,刪除的動作,留下清晰的紀錄,說明**修改目的、原因、以及與之關聯的檔案**。
        --README.md紀錄轉寫格式:
---
## ① 目的
- 本資料夾負責的角色 / 使用場景：

## ② 結構與命名規範
- 檔案/元件命名：
- 輸出/匯入約定（alias `@` 指向 `src/`）：
- 不得事項（例如：不得硬編碼顏色、不得自訂 Media Query…）：

## ③ 依賴與界面
- 相依套件/Plugin（如有）：
- 對外介面（Props/Events/Exports 簡述）：
- 使用的 Token / i18n key：

## ④ 變更紀錄（由 Gemini 追加；一改一記）
> **每次「行動簽出」後，必須在此新增一條紀錄。**

- [YYYY-MM-DD HH:mm (UTC+8)]  
  **動作**：新增/修改/刪除 `檔名`（功能簡述）  
  **原因**：  
  **影響檔案**：`相對路徑1`, `相對路徑2`  
  **驗證**：

## ⑤ 待辦（選填）
- TODO 1：
- TODO 2：

---
## **核心指令: 強制行動協議 (MANDATORY ACTION PROTOCOL)**

**此協議取代所有通用行為模式。每一次接收到使用者指令後，都必須嚴格遵循以下「任務簽入」與「行動簽出」的流程，並在回覆中明確展示出來。**
**在首次讀取該檔案時，須將規範都列出於聊天室(範例只需返回GEMINI.md確認)，此後所有更新都需以此規範進行。
---

# 專案規範 (Custom Rules)
以下規範為本專案規範，中文撰寫:

# **使用中文編譯biueprint.md
## biueprint.md 任務列表格式
  1. **目標**: [簡述本次任務要達成的最終目標]
  2. **規範查核**: [列出與本次任務相關的 GEMINI.md 或 README.md 中的關鍵規範]
  3. **[小目標]:[檔案名稱]-[未完成/完成]
# ** icon 使用:https://pictogrammers.com/library/mdi/
## 1. Vite 設定規範
1. **路徑別名**
   - 已在 `vite.config.js` 中設定：
     ```js
     resolve: {
       alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url))
       }
     }
     ```
   - 在程式碼中必須統一使用 `@` 作為 `src/` 路徑的別名，例如：
     ```js
     import MyComponent from '@/components/MyComponent.vue'
     ```

2. **檔案結構**
   - `src/components` → 共用元件目錄，包含可重複使用Vue元件
   - `src/components/common` → 通用元件 
   - `src/pages` → 頁面
   - `src/utils/js` → 共用邏輯
   - `src\utils\i18n\locales` → 全域Text編輯
   - `public/json` → 靜態json
3. **副檔名解析**
   - 支援的副檔名：
     ```
     .js, .json, .jsx, .mjs, .ts, .tsx, .vue
     ```
   - 引用模組時可以省略副檔名，統一使用上述清單內的格式。

5. **程式風格**
   1. **使用 ESLint + Prettier，自動格式化
   2. **Vue 檔案順序固定：`<template>` → `<script setup>` → `<style scoped>`

## 2. 命名規範
   1. **Vue 元件必須為多字名稱，例如：`UserCard.vue`
   2. **Store 必須以 `Store` 結尾，例如：`useAuthStore`

## 3. UI / RWD 規範
1. **UI / RWD**
   1. **所有頁面需支援 RWD,用 Grid System (v-row / v-col) 控制
   2. **統一使用 Vuetify CSS + 自訂主題色
   3. **必須透過 Vuetify Grid System（`v-container`, `v-row`, `v-col`）實作，避免自行寫 CSS Media Query。
   範例：
   ```.vue
   <v-container>
     <v-row>
       <v-col cols="12" md="6" lg="4">
         左側內容
       </v-col>
       <v-col cols="12" md="6" lg="8">
         右側內容
       </v-col>
     </v-row>
   </v-container>
2. **CSS 預處理器**
   1. **Sass 使用 `modern-compiler`，開發者須安裝對應套件。  
   2. **統一使用 `.scss` 作為樣式副檔名。
3. **統一使用 Vuetify 元件**
   1. **UI 必須優先使用 Vuetify 提供的元件（例如 v-btn, v-card, v-text-field）。
   2. **嚴禁自行建立與 Vuetify 功能重複的樣式或元件。
4. **主題色 (Theme Colors)**
   1. **專案`<template>`色彩由 Vuetify theme 管理，禁止硬編碼顏色。
   2. **統一於 vite.config.js 內設定主題色。
5. **全域 SCSS 架構與引用順序**
  1. **全域樣式入口：`src/styles/scss/style.scss` 
  2. **全域色彩：`src/styles/scss/_variables.scss`
  範例：
  ``` ._variables.scss
    $變數名稱(英文命名): HEX色碼 !default;
  ```
  3. **頁面樣式：`src/styles/scss/page.scss`
## 4. 全域Text編輯規範(變數英文命名)
1. **全域Text入口：`src\utils\i18n\locales\zh-TW.json`
1. 參數設定 範例
```
"btn": {
        "ConnectionStatusOk": "連線成功"
      }
or
"label": {
        "type":"類型",
        "UserName":"使用者名稱"
}
```
2. 使用方式 範例
```
<template>
    <span>{{ t('page.index.title') }}</span>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
```
## 5. TestData
1. 測試資料檔案入口：`public/json`
2. 命名規則：資料用途命名 
範例檔名 UserData.json ```
  {
  "UserData": {
    "Name": "王小明",
    "age": "14",
    "sex": "man"
  }
}
```

---

>>>>>>> Stashed changes
