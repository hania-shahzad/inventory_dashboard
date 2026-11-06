import { useMemo } from "react";
import { formatCurrency, getStockStatus } from "../../utils/stock.js";

/**
 * InventoryMetrics - summary cards.
 * useMemo caches the totals; they are recalculated ONLY when `products` changes,
 * not on every unrelated re-render (e.g. typing in the search box).
 */
function InventoryMetrics({ products }) {
  const stats = useMemo(() => {
    return products.reduce(
      (acc, p) => {
        const status = getStockStatus(p.quantity);
        acc.units += p.quantity;
        acc.value += p.quantity * p.price;
        if (status === "low") acc.low += 1;
        if (status === "out") acc.out += 1;
        return acc;
      },
      { units: 0, value: 0, low: 0, out: 0 }
    );
  }, [products]);

  return (
    <section className="metrics" aria-label="Inventory metrics">
      <div className="metric">
        <span className="metric-label">Total Products</span>
        <strong>{products.length}</strong>
      </div>
      <div className="metric">
        <span className="metric-label">Total Units</span>
        <strong>{stats.units}</strong>
      </div>
      <div className="metric">
        <span className="metric-label">Stock Value</span>
        <strong>{formatCurrency(stats.value)}</strong>
      </div>
      <div className="metric metric-warn">
        <span className="metric-label">Low Stock</span>
        <strong>{stats.low}</strong>
      </div>
      <div className="metric metric-danger">
        <span className="metric-label">Out of Stock</span>
        <strong>{stats.out}</strong>
      </div>
    </section>
  );
}

export default InventoryMetrics;
