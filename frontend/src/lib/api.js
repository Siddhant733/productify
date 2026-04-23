import api from "./axios";

// 🔹 Common API handler
const handleApi = async (promise) => {
  try {
    const { data } = await promise;
    return data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

// USERS API
export const syncUser = async (userData) => {
  return handleApi(api.post("/users/sync", userData));
};

// PRODUCTS API
export const getAllProducts = async () => {
  return handleApi(api.get("/products"));
};

export const getProductById = async (id) => {
  if (!id) throw new Error("Product ID is required");

  return handleApi(api.get(`/products/${id}`));
};

export const getMyProducts = async () => {
  return handleApi(api.get("/products/my"));
};

export const createProduct = async (productData) => {
  return handleApi(api.post("/products", productData));
};

export const updateProduct = async ({ id, ...productData }) => {
  if (!id) throw new Error("Product ID is required");

  return handleApi(api.put(`/products/${id}`, productData));
};

export const deleteProduct = async (id) => {
  if (!id) throw new Error("Product ID is required");

  return handleApi(api.delete(`/products/${id}`));
};

// COMMENTS API
export const createComment = async ({ productId, content }) => {
  if (!productId) throw new Error("Product ID is required");

  return handleApi(api.post(`/comments/${productId}`, { content }));
};

export const deleteComment = async ({ commentId }) => {
  if (!commentId) throw new Error("Comment ID is required");

  return handleApi(api.delete(`/comments/${commentId}`));
};

// RAZORPAY PAYMENT API
export const createRazorpayOrder = async ({ productId }) => {
  if (!productId) throw new Error("Product ID is required");

  return handleApi(api.post("/payments/create-order", { productId }));
};