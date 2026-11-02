import { useEffect, useState } from "react";

import ProductList from "../components/ProductList";

import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const emptyForm = {
  title: "",
  price: "",
  description: "",
};

const limit = 12;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(emptyForm);

  const totalPages = Math.ceil(total / limit);
  const isFiltering = search.trim() !== "" || category !== "";

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // GET /products/categories
  async function loadCategories() {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  }

  // GET /products?limit=&skip=
  async function loadProducts(pageNumber = 1) {
    try {
      setLoading(true);
      setError("");

      const skip = (pageNumber - 1) * limit;

      const data = await getProducts(limit, skip);

      setProducts(data.products);
      setTotal(data.total);
      setPage(pageNumber);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function nextPage() {
    if (page < totalPages) {
      loadProducts(page + 1);
    }
  }

  function previousPage() {
    if (page > 1) {
      loadProducts(page - 1);
    }
  }

  // DELETE /products/:id
  async function handleDelete(id) {
    try {
      setError("");

      const product = products.find((item) => item.id === id);

      // Los productos creados localmente no existen en DummyJSON
      if (!product?.isLocal) {
        await deleteProduct(id);
      }

      setProducts(products.filter((product) => product.id !== id));

      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      setError(error.message);
    }
  }

  // GET /products/search?q=
  async function handleSearch(event) {
    event.preventDefault();

    setCategory("");

    if (search.trim() === "") {
      await loadProducts();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchProducts(search);

      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // GET /products/category/:category
  async function handleCategory(event) {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);
    setSearch("");

    if (selectedCategory === "") {
      await loadProducts();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getProductsByCategory(selectedCategory);

      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  // POST /products/add
  async function handleCreate(event) {
    event.preventDefault();

    try {
      setError("");

      const newProduct = await createProduct({
        ...form,
        price: Number(form.price),
      });

      // DummyJSON devuelve siempre el mismo id para productos nuevos,
      // por eso se genera un id local único para la interfaz.
      setProducts([
        { ...newProduct, id: Date.now(), isLocal: true },
        ...products,
      ]);

      setForm(emptyForm);
    } catch (error) {
      setError(error.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      title: product.title,
      price: product.price,
      description: product.description ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // PUT /products/:id
  async function handleUpdate(event) {
    event.preventDefault();

    try {
      setError("");

      const changes = {
        ...form,
        price: Number(form.price),
      };

      const current = products.find((product) => product.id === editingId);

      // Los productos creados localmente solo se actualizan en la interfaz
      const updated = current?.isLocal
        ? changes
        : await updateProduct(editingId, changes);

      setProducts(
        products.map((product) =>
          product.id === editingId ? { ...product, ...updated } : product
        )
      );

      cancelEdit();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <section>
      <h1>Productos</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button type="submit">Buscar</button>
      </form>

      <select value={category} onChange={handleCategory}>
        <option value="">Todas las categorías</option>

        {categories.map((item) => {
          const value = item.slug ?? item;
          const label = item.name ?? item;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <h2>{editingId ? "Editar producto" : "Agregar producto"}</h2>

      <form
        onSubmit={editingId ? handleUpdate : handleCreate}
        className="product-form"
      >
        <input
          type="text"
          name="title"
          placeholder="Nombre"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">{editingId ? "Actualizar" : "Guardar"}</button>

        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {!isFiltering && (
        <div className="pagination">
          <button onClick={previousPage} disabled={loading || page === 1}>
            Anterior
          </button>

          <span>
            Página {page} de {totalPages || 1}
          </span>

          <button
            onClick={nextPage}
            disabled={loading || page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}

export default Products;
