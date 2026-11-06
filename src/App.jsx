import { useState, useMemo, useCallback, useRef, useEffect } from "react";

import Header from "./components/functional/Header.jsx";
import InventoryMetrics from "./components/functional/InventoryMetrics.jsx";
import ProductForm from "./components/functional/ProductForm.jsx";
import FilterBar from "./components/functional/FilterBar.jsx";
import ProductList from "./components/functional/ProductList.jsx";
import AuditLogger from "./components/class/AuditLogger.jsx";

import useLocalStorage from "./hooks/useLocalStorage.js";
import useDocumentTitle from "./hooks/useDocumentTitle.js";
import { getStockStatus, makeId, SEED_PRODUCTS } from "./utils/stock.js";

/**
 * App - the "smart" container component.
 * It owns the application state and passes data DOWN as props and
 * receives actions UP through callback props. (Theme does NOT travel through
 * props at all - it comes from ThemeContext.)
 */
function App() {
  /* ---------------------------- STATE (useState) ---------------------------- */
  // Inventory is persisted: useLocalStorage = useState + useEffect sync (Task 5)
  const [products, setProducts] = useLocalStorage("inventory-products", SEED_PRODUCTS);

  // Filter controls
  const [filters, setFilters] = useState({ search: "", category: "all", status: "all" });

  // Product currently being edited (null = "add" mode)
  const [editingProduct, setEditingProduct] = useState(null);

  // Most recent operation - consumed by the class component AuditLogger
  const [latestEvent, setLatestEvent] = useState(null);

  /* --------------------------------- REF ----------------------------------- */
  // Always holds the newest products array. Handlers read it so they can log the
  // product's title WITHOUT listing `products` as a dependency (keeps them stable).
  const productsRef = useRef(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  /* ------------------------------- useEffect -------------------------------- */
  // Dynamic document title based on the number of ACTIVE products (stock > 0)
  const activeCount = useMemo(() => products.filter((p) => p.quantity > 0).length, [products]);
  useDocumentTitle(`Inventory (${activeCount} active)`);

  /* ------------------------------- useMemo ---------------------------------- */
  // Filtering runs only when the products or the filters change
  const visibleProducts = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = term === "" || p.title.toLowerCase().includes(term);
      const matchesCategory = filters.category === "all" || p.category === filters.category;
      const matchesStatus = filters.status === "all" || getStockStatus(p.quantity) === filters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, filters]);

  /* ------------------------------ useCallback ------------------------------- */
  // Helper: publish an event for the AuditLogger (unique id => new object each time)
  const logEvent = useCallback((type, message) => {
    setLatestEvent({ id: makeId(), type, message });
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Add OR update, depending on whether we are editing
  const handleSaveProduct = useCallback(
    (data) => {
      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p)));
        logEvent("update", `Updated "${data.title}"`);
        setEditingProduct(null);
      } else {
        setProducts((prev) => [{ id: makeId(), ...data }, ...prev]);
        logEvent("add", `Added "${data.title}" (${data.quantity} units)`);
      }
    },
    [editingProduct, setProducts, logEvent]
  );

  const handleAdjustStock = useCallback(
    (id, delta) => {
      const product = productsRef.current.find((p) => p.id === id);
      if (!product) return;
      const newQty = Math.max(0, product.quantity + delta);
      if (newQty === product.quantity) return; // nothing changed

      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: newQty } : p)));
      logEvent("stock", `Stock of "${product.title}" changed ${product.quantity} → ${newQty}`);
    },
    [setProducts, logEvent]
  );

  const handleDelete = useCallback(
    (id) => {
      const product = productsRef.current.find((p) => p.id === id);
      if (!product) return;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setEditingProduct((current) => (current && current.id === id ? null : current));
      logEvent("delete", `Deleted "${product.title}"`);
    },
    [setProducts, logEvent]
  );

  const handleEdit = useCallback((product) => setEditingProduct(product), []);
  const handleCancelEdit = useCallback(() => setEditingProduct(null), []);

  /* --------------------------------- JSX ------------------------------------ */
  return (
    <div className="app">
      <Header title="Inventory Dashboard" activeCount={activeCount} />

      <main className="layout">
        <InventoryMetrics products={products} />

        <div className="content">
          <aside className="sidebar">
            <ProductForm
              onSubmit={handleSaveProduct}
              editingProduct={editingProduct}
              onCancelEdit={handleCancelEdit}
            />
            {/* Class component, driven by the latestEvent prop */}
            <AuditLogger latestEvent={latestEvent} />
          </aside>

          <section className="products-section">
            <FilterBar
              search={filters.search}
              category={filters.category}
              status={filters.status}
              onChange={handleFilterChange}
            />
            <p className="muted result-count">
              Showing {visibleProducts.length} of {products.length} products
            </p>
            <ProductList
              products={visibleProducts}
              totalCount={products.length}
              onAdjustStock={handleAdjustStock}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer muted">Web Engineering • React + Vite • Inventory &amp; Stock Dashboard</footer>
    </div>
  );
}

export default App;
