/**
 * CardWrapper - reusable container built with props.children (Task 2).
 * Whatever JSX is placed between <CardWrapper> ... </CardWrapper> is rendered
 * inside the card body, so the wrapper works for ANY content.
 */
function CardWrapper({ title, badge, children, footer, className = "" }) {
  return (
    <article className={`card ${className}`}>
      {(title || badge) && (
        <div className="card-header">
          {title && <h3>{title}</h3>}
          {badge}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </article>
  );
}

export default CardWrapper;
