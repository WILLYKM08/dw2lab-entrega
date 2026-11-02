const API_URL = "https://dummyjson.com/products";

// Obtener productos
export async function getProducts(limit = 12, skip = 0) {
  const response = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`);

  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }

  return await response.json();
}

// Obtener producto por ID
export async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Producto no encontrado");
  }

  return await response.json();
}

// Buscar productos
export async function searchProducts(query) {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar productos");
  }

  return await response.json();
}

// Obtener categorías
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }

  return await response.json();
}

// Obtener productos por categoría
export async function getProductsByCategory(category) {
  const response = await fetch(
    `${API_URL}/category/${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error("Error al filtrar productos");
  }

  return await response.json();
}

// Crear producto
export async function createProduct(product) {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Error al crear el producto");
  }

  return await response.json();
}

// Actualizar producto
export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el producto");
  }

  return await response.json();
}

// Eliminar producto
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el producto");
  }

  return await response.json();
}
