import { db } from "./index";
import { eq, desc, inArray } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type NewUser,
  type NewComment,
  type NewProduct,
} from "./schema";

// USER QUERIES
export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const existingUser = await getUserById(id);

  if (!existingUser) {
    throw new Error(`User with id ${id} not found`);
  }

  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  return user;
};

export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({
      target: users.id,
      set: data,
    })
    .returning();

  return user;
};

// HELPERS
const attachUsersToProducts = async (productList: any[]) => {
  if (!productList.length) return [];

  const userIds = [...new Set(productList.map((product) => product.userId))];

  const relatedUsers = await db
    .select()
    .from(users)
    .where(inArray(users.id, userIds));

  const userMap = new Map(relatedUsers.map((user) => [user.id, user]));

  return productList.map((product) => ({
    ...product,
    user: userMap.get(product.userId) || null,
  }));
};

const attachCommentsToProducts = async (productList: any[]) => {
  if (!productList.length) return [];

  const productIds = productList.map((product) => product.id);

  const relatedComments = await db
    .select()
    .from(comments)
    .where(inArray(comments.productId, productIds))
    .orderBy(desc(comments.createdAt));

  const commentsByProductId = new Map<string, any[]>();

  for (const comment of relatedComments) {
    if (!commentsByProductId.has(comment.productId)) {
      commentsByProductId.set(comment.productId, []);
    }
    commentsByProductId.get(comment.productId)?.push(comment);
  }

  return productList.map((product) => ({
    ...product,
    comments: commentsByProductId.get(product.id) || [],
  }));
};

// PRODUCT QUERIES
export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProducts = async () => {
  const productList = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  const productsWithUsers = await attachUsersToProducts(productList);
  const productsWithUsersAndComments = await attachCommentsToProducts(
    productsWithUsers
  );

  return productsWithUsersAndComments;
};

export const getProductById = async (id: string) => {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id));

  if (!product) return undefined;

  const user = await getUserById(product.userId);

  const productComments = await db
    .select()
    .from(comments)
    .where(eq(comments.productId, id))
    .orderBy(desc(comments.createdAt));

  const commentUserIds = [
    ...new Set(productComments.map((comment) => comment.userId)),
  ];

  const commentUsers =
    commentUserIds.length > 0
      ? await db.select().from(users).where(inArray(users.id, commentUserIds))
      : [];

  const commentUserMap = new Map(commentUsers.map((user) => [user.id, user]));

  const commentsWithUsers = productComments.map((comment) => ({
    ...comment,
    user: commentUserMap.get(comment.userId) || null,
  }));

  return {
    ...product,
    user: user || null,
    comments: commentsWithUsers,
  };
};

export const getProductsByUserId = async (userId: string) => {
  const productList = await db
    .select()
    .from(products)
    .where(eq(products.userId, userId))
    .orderBy(desc(products.createdAt));

  const productsWithUsers = await attachUsersToProducts(productList);
  const productsWithUsersAndComments = await attachCommentsToProducts(
    productsWithUsers
  );

  return productsWithUsersAndComments;
};

export const updateProduct = async (
  id: string,
  data: Partial<NewProduct>
) => {
  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();

  return product;
};

export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    throw new Error(`Product with id ${id} not found`);
  }

  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  return product;
};

// COMMENT QUERIES
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id));

  if (!comment) return undefined;

  const user = await getUserById(comment.userId);

  return {
    ...comment,
    user: user || null,
  };
};

export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id);

  if (!existingComment) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();

  return comment;
};