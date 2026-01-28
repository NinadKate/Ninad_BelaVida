import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Auth Tables (NextAuth.js Standard) ---

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").default("user").notNull(), // user, admin
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- E-commerce Tables ---

export const categories = pgTable("category", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: jsonb("name").notNull(), // { en: "", es: "", ... }
  image_url: text("image_url"),
  active: boolean("active").default(true),
});

export const products = pgTable("product", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  slug: text("slug").notNull().unique(),
  sku: text("sku").unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  name: jsonb("name").notNull(), // { en: "", es: "", ... }
  description: jsonb("description").notNull(), // { en: "", es: "", ... }
  images: text("images").array(), // Array of R2 URLs
  stock: integer("stock").default(0),
  active: boolean("active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("order", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  status: text("status").default("pending").notNull(), // pending, contacted, completed, cancelled
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("CLP").notNull(),
  locale: text("locale").notNull(),
  shippingInfo: jsonb("shipping_info").notNull(), // { address, city, country, phone, email }
  created_at: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_item", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Snapshot of price at time of order
});
