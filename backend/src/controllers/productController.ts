import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error getting products:", error);
    return res.status(500).json({
      error: "Failed to get products",
      details: error?.message || "Unknown error",
    });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const products = await queries.getProductsByUserId(userId);
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error getting user products:", error);
    return res.status(500).json({
      error: "Failed to get user products",
      details: error?.message || "Unknown error",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await queries.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    console.error("Error getting product:", error);
    return res.status(500).json({
      error: "Failed to get product",
      details: error?.message || "Unknown error",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const title = String(req.body?.title ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const imageUrl = String(req.body?.imageUrl ?? "").trim();
    const price = String(req.body?.price ?? "").trim();

    if (!title || !description || !imageUrl || !price) {
      return res.status(400).json({
        error: "Title, description, imageUrl, and price are required",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        error: "Price must be a valid number greater than 0",
      });
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      price,
      userId,
    });

    return res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: "Failed to create product",
      details: error?.message || "Unknown error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const title = String(req.body?.title ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const imageUrl = String(req.body?.imageUrl ?? "").trim();
    const price = String(req.body?.price ?? "").trim();

    const existingProduct = await queries.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({
        error: "You can only update your own products",
      });
    }

    if (!title || !description || !imageUrl || !price) {
      return res.status(400).json({
        error: "Title, description, imageUrl, and price are required",
      });
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        error: "Price must be a valid number greater than 0",
      });
    }

    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl,
      price,
    });

    return res.status(200).json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      error: "Failed to update product",
      details: error?.message || "Unknown error",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const existingProduct = await queries.getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.userId !== userId) {
      return res.status(403).json({
        error: "You can only delete your own products",
      });
    }

    await queries.deleteProduct(id);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      error: "Failed to delete product",
      details: error?.message || "Unknown error",
    });
  }
};