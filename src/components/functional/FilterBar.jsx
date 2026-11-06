import { CATEGORIES, STATUS_LABELS } from "../../utils/stock.js";

/**
 * FilterBar - a "controlled" component: input values come from props (state in App)
 * and every change is reported upward with the onChange callback prop.
 */
function FilterBar({ search, category, status, onChange }) {
  // One generic handler: the input's `name` tells us which filter changed
  const handleChange = (event) => onChange(event.target.name, event.target.value);

  return (
    <div className="filter-bar">
      <input
        type="search"
        name="search"
        placeholder="Search by title…"
        value={search}
        onChange={handleChange}
        aria-label="Search products"
      />

      <select name="category" value={category} onChange={handleChange} aria-label="Filter by category">
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select name="status" value={status} onChange={handleChange} aria-label="Filter by stock status">
        <option value="all">All stock levels</option>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;
