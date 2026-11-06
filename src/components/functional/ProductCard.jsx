import { memo } from "react";
import CardWrapper from "./CardWrapper.jsx";
import { getStockStatus, STATUS_LABELS, formatCurrency } from "../../utils/stock.js";

/**
 * ProductCard - shows one product.
 * React.memo: skips re-rendering when its props are unchanged. This only works
 * because the parent passes STABLE callbacks created with useCallback.
 */
function ProductCard({ product, onAdjustStock, onDelete, onEdit }) {
  const { id, title, category, price, quantity } = product;
  const status = getStockStatus(quantity); // "in" | "low" | "out"

  // Stock badge handed to CardWrapper (JSX stored in a variable / passed as a prop)
  const badge = <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>;

  const footer = (
    <>
      <button type="button" className="btn btn-sm" onClick={() => onEdit(product)}>
        Edit
      </button>
      <button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(id)}>
        Delete
      </button>
    </>
  );

  return (
    // Children of CardWrapper = props.children inside the wrapper
    <CardWrapper title={title} badge={badge} footer={footer} className={`card-${status}`}>
      <p className="muted">{category}</p>
      <p className="price">{formatCurrency(price)}</p>

      <div className="stock-control">
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => onAdjustStock(id, -1)}
          disabled={quantity === 0} /* can't go below zero */
          aria-label={`Decrease stock of ${title}`}
        >
          −
        </button>
        <span className="qty">{quantity} in stock</span>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => onAdjustStock(id, 1)}
          aria-label={`Increase stock of ${title}`}
        >
          +
        </button>
      </div>

      {/* Logical short-circuit: warning text only when quantity is 0 */}
      {quantity === 0 && <p className="error">Restock needed!</p>}
    </CardWrapper>
  );
}

export default memo(ProductCard);
