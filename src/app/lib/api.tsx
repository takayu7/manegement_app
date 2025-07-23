import postgres from "postgres";
import { User, Product, Category, Supplier } from "@/app/types/type";

const sql = postgres(process.env.POSTGRES_URL!);

// ユーザーデータの取得
export async function fetchUserDatas() {
  try {
    const data = await sql<User[]>`SELECT * FROM users`;

    console.log("user:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}
// ユーザーデータの登録
export async function createUser(user: User) {
  try {
    const data = await sql<User[]>`
      INSERT INTO users (id, name, password, icon)
      VALUES (${user.id}, ${user.name}, ${user.password}, ${user.icon})
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user.");
  }
}
// カテゴリリストの取得
export async function fetchCategoryList() {
  try {
    const data = await sql<Category[]>`SELECT * FROM categorylist ORDER BY id`;

    console.log("categoryList:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

// 仕入れリストの取得
export async function fetchSupplierList() {
  try {
    const data = await sql<Supplier[]>`SELECT * FROM supplierlist ORDER BY id`;

    console.log("supplierList:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

// 商品データの取得
export async function fetchProductDatas() {
  try {
    const data = await sql<Product[]>`
    SELECT * FROM product ORDER BY name
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

// 商品データの登録
export async function createProduct(product: Product) {
  try {
    const data = await sql<Product[]>`
      INSERT INTO product (id,name, category, supplier, count, cost, price, "order",explanation)
      VALUES (${product.id}, ${product.name}, ${product.category}, ${product.supplier}, ${product.count}, ${product.cost}, ${product.price}, ${product.order}, ${product.explanation})
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create product.");
  }
}

// 商品データの更新
export async function updateProduct(product: Product) {
  try {
    const data = await sql<Product[]>`
      UPDATE product
      SET
        name = ${product.name},
        category = ${product.category},
        supplier = ${product.supplier},
        count = ${product.count},
        cost = ${product.cost},
        price = ${product.price},
        "order" = ${product.order},
        explanation = ${product.explanation}
      WHERE
        id = ${product.id}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update product.");
  }
}

// 商品データの削除
export async function deleteProduct(productId: string) {
  try {
    const data = await sql<Product[]>`
      DELETE FROM product
      WHERE id = ${productId}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product.");
  }
}
