import express from "express";
import cors from "cors";
import path from "path";
import { clerkMiddleware, getAuth } from "@clerk/express";
import Razorpay from "razorpay";

import { ENV } from "./config/env";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";
import * as queries from "./db/queries";

const app = express();

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

app.use(
  cors({
    origin: [
      "https://productify-git-main-siddhant733s-projects.vercel.app",
      "https://productify-weld.vercel.app",
    ],
    credentials: true,
  })
);

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  return res.json({
    message: "Productify API is running",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
      payments: "/api/payments/create-order",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const productId = req.body?.productId;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await queries.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.userId === userId) {
      return res.status(400).json({ error: "You cannot buy your own product" });
    }

    const amount = Math.round(Number(product.price) * 100);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid product price" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${product.id.slice(0, 30)}`,
      notes: {
        productId: product.id,
        buyerId: userId,
        sellerId: product.userId,
      },
    });

    return res.status(200).json({
      key: ENV.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      product: {
        id: product.id,
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
      },
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return res.status(500).json({
      error: "Failed to create payment order",
      details:
        error?.error?.description ||
        error?.description ||
        error?.message ||
        "Unknown error",
    });
  }
});

if (ENV.NODE_ENV === "production") {
  const rootDir = path.resolve();

  app.use(express.static(path.join(rootDir, "../frontend/dist")));

  app.get("/{*any}", (_req, res) => {
    return res.sendFile(path.join(rootDir, "../frontend/dist/index.html"));
  });
}

const server = app.listen(ENV.PORT, () => {
  console.log(`✅ Server running on http://localhost:${ENV.PORT}`);
  console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});