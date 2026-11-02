import { Link } from "react-router-dom";

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} />

      <h3>{product.title}</h3>

      <p>{product.category}</p>

      <strong>${product.price}</strong>

      <div className="actions">
        <Link to={`/products/${product.id}`}>Ver detalle</Link>

        <button onClick={() => onEdit(product)}>Editar</button>

        <button onClick={() => onDelete(product.id)}>Eliminar</button>
      </div>
    </article>
  );
}

export default ProductCard;
