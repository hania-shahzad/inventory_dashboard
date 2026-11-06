# 📦 E-Commerce Inventory & Stock Management Dashboard

**Course:** Web Engineering / Frontend Development (CLO1 & CLO2)
**Assignment:** Advanced React Component Architecture & State Management
**Stack:** React 18 + Vite (Client-Side Rendering)

> **Live demo:** _paste your deployment link here_
> **GitHub repo:** _paste your repository link here_

---

## 1. Features

- Add, edit, delete products and adjust stock with **+ / −** buttons
- Stock badges: **In Stock**, **Low Stock** (10 units or fewer), **Out of Stock** (0)
- Search by title, filter by category and by stock status
- Live metrics: total products, units, stock value, low/out-of-stock counts
- **Audit Log** (class component) with toast notifications, saved in `localStorage`
- Light / Dark theme through Context (remembered between visits)
- Inventory saved in `localStorage`, so data survives a page refresh
- Browser tab title updates with the number of active products
- Responsive layout (desktop, tablet, mobile)

## 2. Getting Started

```bash
npm install      # install dependencies
npm run dev      # start dev server -> http://localhost:5173
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

Requires Node.js 18 or newer.

## 3. Project Structure

```
src/
├── components/
│   ├── class/
│   │   └── AuditLogger.jsx        # CLASS component with lifecycle methods
│   └── functional/
│       ├── CardWrapper.jsx        # reusable container using props.children
│       ├── FilterBar.jsx          # search + category + status filters
│       ├── Header.jsx             # title + active count + theme toggle
│       ├── InventoryMetrics.jsx   # summary cards (useMemo)
│       ├── ProductCard.jsx        # single product (React.memo)
│       ├── ProductForm.jsx        # add/edit form (useState, useRef, useEffect)
│       ├── ProductList.jsx        # list rendering with map() + keys
│       └── ThemeToggle.jsx        # Light/Dark button (useContext)
├── context/
│   └── ThemeContext.jsx           # ThemeProvider + useTheme()
├── hooks/
│   ├── useLocalStorage.js         # useState + useEffect sync with localStorage
│   └── useDocumentTitle.js        # updates document.title
├── utils/
│   └── stock.js                   # constants + helpers (status, currency, ids)
├── App.jsx                        # container: state, handlers, layout
├── main.jsx                       # entry point (wraps App in ThemeProvider)
└── index.css                      # all styling (CSS variables for themes)
```

## 4. Rubric Coverage (where to find each requirement)

| Requirement | Where it is implemented |
|---|---|
| **Component-based architecture** | 9 reusable components split into `class/` and `functional/` folders |
| **Functional components + props** | `Header`, `ProductForm`, `ProductList`, `ProductCard`; callback props such as `onSubmit`, `onDelete`, `onAdjustStock`, `onChange` |
| **`props.children`** | `CardWrapper.jsx`; `ProductCard` places its content inside it |
| **Class component** | `AuditLogger.jsx` uses `this.state` and `this.setState()` |
| `componentDidMount` | Loads saved logs from `localStorage` and adds a `storage` event listener |
| `componentDidUpdate` | Adds new log entries, saves them to `localStorage`, shows the toast |
| `componentWillUnmount` | Clears the toast timer and removes the event listener |
| **JSX + JS expressions** | `{ ... }` used in every component |
| **Conditional rendering** | Ternary: empty states in `ProductList`, stock text in `Header`. `&&`: error messages, "Restock needed!", Clear button |
| **Lists with keys** | `ProductList` (`key={product.id}`), `FilterBar`, `AuditLogger` |
| **Synthetic events** | `onClick`, `onChange`, `onSubmit` (with `preventDefault`) |
| **`useState`** | Products, filters, form fields, errors, editing product |
| **`useEffect`** | `useLocalStorage` (sync), `useDocumentTitle` (tab title), `ProductForm` (focus), `ThemeProvider` (apply theme) |
| **`useContext`** | `ThemeContext.jsx`; consumed in `ThemeToggle` through `useTheme()` |
| **`useRef`** | `ProductForm` focuses the title input on mount and after submit; `App` keeps the latest products in a ref |
| **`useMemo`** | Filtering and active count in `App`, totals in `InventoryMetrics`, context value in `ThemeProvider` |
| **`useCallback`** | All handlers in `App` (so `React.memo` on `ProductCard` really works) |
| **Prop-drilling prevention** | Theme is provided once in `main.jsx` and read directly where needed |
| **Clean CSS** | One stylesheet using CSS variables, grid/flex, dark mode, responsive breakpoints |

## 5. Theoretical Analysis: CSR vs. SSR

**How do CSR (Vite + React SPA) and SSR (Next.js) differ in initial page load and server-side execution?**

With Client-Side Rendering (a normal Vite + React SPA), the server sends an almost empty HTML file plus a JavaScript bundle. The browser downloads and runs that JavaScript, and React then builds the page. Until this finishes, the user sees a blank screen or a loader. The server only serves static files, so it does no rendering work.

With Server-Side Rendering (Next.js), the server runs React for every request, builds the full HTML, and sends it. The user sees content quickly, then React "hydrates" the page to make it interactive. The server does the rendering work each time.

**What are the performance, SEO and hosting trade-offs for an enterprise e-commerce application like this dashboard?**

- **Performance:** CSR has a slower first load but very fast navigation afterwards, because only data is fetched. SSR gives a faster first paint, which helps users on slow phones, but each request costs server time.
- **SEO:** Search engines and social-media previews read SSR pages easily because the content is already in the HTML. CSR pages can be indexed by Google, but it is slower and less reliable. Public product pages benefit most from SSR.
- **Hosting:** CSR is cheap and simple: any static host or CDN (Netlify, Vercel, GitHub Pages) works. SSR needs a running Node server or serverless functions, which cost more and need scaling and monitoring.

**Conclusion:** This inventory dashboard is a private, login-only tool where SEO does not matter, so CSR is the better fit. A public online shop storefront would favour SSR for SEO and first-load speed. Many enterprises combine both.

## 6. Additional Concept Notes (simple explanations)

- **Class vs. functional components:** Classes use `this.state` and lifecycle methods. Functional components use hooks (`useState`, `useEffect`, ...) and are shorter and easier to reuse. This project uses a class only for `AuditLogger`, to show both styles.
- **Lifecycle ↔ hooks:** `componentDidMount` ≈ `useEffect(fn, [])`; `componentDidUpdate` ≈ `useEffect(fn, [deps])`; `componentWillUnmount` ≈ the cleanup function returned from `useEffect`.
- **Why `key` props?** Keys let React identify which list item changed, moved or was removed, so it updates only that item.
- **Why `useMemo` / `useCallback`?** `useMemo` remembers a calculated value; `useCallback` remembers a function. Both avoid repeating work and avoid unnecessary re-renders of memoised children.
- **Why Context?** It shares data (like the theme) with deeply nested components without passing props through every level (prop drilling).

## 7. Deployment

1. Push the project to GitHub.
2. **Vercel / Netlify:** import the repo. Build command `npm run build`, output directory `dist`.
3. **GitHub Pages:** set `base: "/<repo-name>/"` in `vite.config.js`, run `npm run build`, and publish `dist/`.
4. Add the live link and a screenshot to your Word submission file.

## 8. Author

haniashahzad • 241398 • Section A_
