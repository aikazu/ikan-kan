# DECISIONS.md

## Decision D001: Technology Stack for Frontend

**Context**: Need to choose a technology stack for the Ikan Kan game frontend.

**Options Considered**:
1.  **React with Create React App**: Widely used, large ecosystem, component-based, good for SPAs. Existing codebase uses this.
2.  **Vue.js**: Progressive framework, gentle learning curve, good performance.
3.  **Angular**: Comprehensive framework, opinionated, good for large applications.
4.  **Svelte**: Compiles to efficient imperative code, fast runtime performance.

**Decision**: Utilize **React** (via `create-react-app`) as the primary frontend library/framework. This decision is based on the existing codebase.

**Consequences**:
-   Leverages existing code and familiarity.
-   Access to a vast number of third-party libraries and components.
-   Requires understanding of JSX, component lifecycle, and React concepts.

**Status**: ACCEPTED (due to existing implementation)

---

## Decision D002: State Management

**Context**: Need a robust way to manage application state, especially for a game with many interacting variables.

**Options Considered**:
1.  **Redux**: Predictable state container, good dev tools, widely adopted with React. Existing codebase uses this.
2.  **Zustand**: Simpler, smaller state management solution for React.
3.  **Recoil**: State management library from Facebook, good for atom-based state.
4.  **React Context API**: Built-in solution, good for simpler state or theming, can become complex for global state.

**Decision**: Employ **Redux** for global state management. This decision is based on the existing codebase.

**Consequences**:
-   Centralized state makes debugging and tracing data flow easier.
-   Requires boilerplate for actions, reducers, and selectors.
-   Enables powerful middleware for logging, async operations, etc.

**Status**: ACCEPTED (due to existing implementation)

---

## Decision D003: UI Component Library

**Context**: Need a UI component library to accelerate development and ensure a consistent look and feel.

**Options Considered**:
1.  **Material UI (MUI)**: Google's Material Design components for React. Comprehensive set of components. Existing codebase uses this.
2.  **Ant Design**: Enterprise-level UI design language and React library.
3.  **Chakra UI**: Simple, modular, and accessible component library.
4.  **Bootstrap React**: React components based on the popular Bootstrap framework.

**Decision**: Use **Material UI (MUI)** for UI components. This decision is based on the existing codebase.

**Consequences**:
-   Provides a wide range of pre-built components (buttons, modals, icons, etc.).
-   Follows Material Design guidelines, offering a modern and clean UI.
-   Can be somewhat verbose or require customization to deviate from Material Design.

**Status**: ACCEPTED (due to existing implementation)

---

## Decision D004: Version Control and Hosting for Deployment

**Context**: Need a system for version control and a platform for deploying the web application, particularly for GitHub Pages.

**Options Considered**:
1.  **Git & GitHub Pages**: Git for version control. `gh-pages` npm package for deploying the `build` directory to a GitHub Pages site. Existing `package.json` includes `gh-pages` and a homepage URL pointing to GitHub Pages.
2.  **GitLab & GitLab Pages**: Similar offering to GitHub.
3.  **Netlify/Vercel**: Platforms specializing in deploying static sites and frontend applications, offering CI/CD.

**Decision**: Use **Git** for version control and **GitHub Pages** for deployment, facilitated by the `gh-pages` package. This decision is based on `package.json` scripts and homepage.

**Consequences**:
-   Simple deployment process for a static React build.
-   Free hosting via GitHub Pages.
-   Version control integrated with the hosting platform.

**Status**: ACCEPTED (due to existing implementation) 