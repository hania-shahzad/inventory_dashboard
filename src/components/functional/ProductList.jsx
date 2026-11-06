import ProductCard from "./ProductCard.jsx";

/**
 * ProductList - renders the array of products.
 *  - Ternary operator  -> empty state vs. grid
 *  - Array.map()       -> one <ProductCard> per product
 *  - key={product.id}  -> unique, stable key so React can track each item
 */
function ProductList({ products, totalCount, onAdjustStock, onDelete, onEdit }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        {/* Different message: no inventory at all vs. filters matched nothing */}
        {totalCount === 0 ? (
          <>
            <h3>Your inventory is empty</h3>
            <p className="muted">Use the form to add your first product.</p>
          </>
        ) : (
          <>
            <h3>No products match your filters</h3>
            <p className="muted">Try changing the search text, category or stock level.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdjustStock={onAdjustStock}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default ProductList;
