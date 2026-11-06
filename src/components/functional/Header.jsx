import ThemeToggle from "./ThemeToggle.jsx";

/** Header - functional component that receives plain props (title, activeCount). */
function Header({ title, activeCount }) {
  return (
    <header className="app-header">
      <div>
        <h1>📦 {title}</h1>
        <p className="muted">
          {activeCount} active {activeCount === 1 ? "product" : "products"} available
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}

export default Header;
