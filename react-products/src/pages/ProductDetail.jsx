import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProductById } from "../services/productService";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <section className="product-detail">
      <Link to="/products">← Regresar</Link>

      <h1>{product.title}</h1>

      <img src={product.thumbnail} alt={product.title} />

      <p>{product.description}</p>

      <p>
        <strong>Categoría:</strong> {product.category}
      </p>

      <p>
        <strong>Precio:</strong> ${product.price}
      </p>

      <p>
        <strong>Stock:</strong> {product.stock}
      </p>

      <p>
        <strong>Rating:</strong> {product.rating}
      </p>
    </section>
  );
}

export default ProductDetail;
