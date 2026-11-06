import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "../../utils/stock.js";

const EMPTY_FORM = { title: "", category: CATEGORIES[0], price: "", quantity: "" };

/**
 * ProductForm - add a new product or edit an existing one.
 *  - useState : controlled inputs (form) + validation errors
 *  - useRef   : points at the title <input> so we can focus it programmatically
 *  - useEffect: focus on mount, and load product data when editing
 */
function ProductForm({ onSubmit, editingProduct, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null); // ref object: titleRef.current === the DOM <input>

  // Focus the title field when the form first mounts (empty dependency array)
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // When the parent selects a product to edit, copy its values into the form
  useEffect(() => {
    if (editingProduct) {
      setForm({
        title: editingProduct.title,
        category: editingProduct.category,
        price: String(editingProduct.price),
        quantity: String(editingProduct.quantity),
      });
      setErrors({});
      titleRef.current?.focus();
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingProduct]);

  // onChange (synthetic event): one handler updates whichever field was edited
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (form.price === "" || Number(form.price) < 0) next.price = "Enter a valid price (0 or more)";
    if (form.quantity === "" || !Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)
      next.quantity = "Enter a whole number (0 or more)";
    return next;
  };

  // onSubmit (synthetic event): preventDefault stops the browser's full page reload
  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      titleRef.current?.focus();
      return;
    }

    // Callback prop: hand the clean data up to the parent (child -> parent communication)
    onSubmit({
      title: form.title.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });

    setForm(EMPTY_FORM);
    titleRef.current?.focus(); // move focus back to the title for fast data entry
  };

  const isEditing = Boolean(editingProduct);

  return (
    <form className="panel product-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>

      <label>
        Title
        <input
          ref={titleRef}
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Bluetooth Speaker"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </label>

      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="form-row">
        <label>
          Price ($)
          <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} />
          {errors.price && <span className="error">{errors.price}</span>}
        </label>

        <label>
          Quantity
          <input name="quantity" type="number" step="1" min="0" value={form.quantity} onChange={handleChange} />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Save Changes" : "Add Product"}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
