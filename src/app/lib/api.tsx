import postgres from "postgres";
import { User, Product, Category, Supplier, Todo } from "@/app/types/type";

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

// ユーザーデータの削除
export async function deleteUser(userId: string) {
  try {
    const data = await sql<User[]>`
      DELETE FROM users
      WHERE id = ${userId}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete user.");
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
    throw new Error("Failed to fetch supplier.");
  }
}

// 仕入れリストの更新
export async function updateSupplierList(supplier: Supplier) {
  try {
    const data = await sql<Supplier[]>`
      UPDATE supplierlist
      SET
        name = ${supplier.name}
      WHERE
        id = ${supplier.id}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update supplier.");
  }
}

// 仕入れリストの削除
export async function deleteSupplierList(id: number) {
  try {
    const data = await sql<Supplier[]>`
      DELETE FROM supplierlist
      WHERE id = ${id}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete supplier.");
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

// TODOデータの取得
export async function fetchTodo() {
  try {
    const data = await sql<Todo[]>`
      SELECT
        todo.id AS id,
        todoid,
        users.name,
        users.icon,
        todo,
        deadline,
        checked
      FROM todo INNER JOIN users ON todo.id = users.id
      ORDER BY deadline;
    `;

    console.log("todo:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch todo data.");
  }
}

// TODOデータの登録
export async function createTodo(todo: Todo) {
  try {
    const data = await sql<Todo[]>`
      INSERT INTO todo (id,todo, deadline, checked)
      VALUES (${todo.id}, ${todo.todo}, ${todo.deadline}, ${todo.checked})
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create todo.");
  }
}


// TODOデータの更新
export async function updateTodo(todo: Todo) {
  try {
    const data = await sql<Todo[]>`
      UPDATE todo
      SET
        todo = ${todo.todo},
        deadline = ${todo.deadline},
        checked = ${todo.checked}
      WHERE
        id = ${todo.id}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update todo.");
  }
}

// TODOデータの削除
export async function deleteTodo(todoId: string) {
  try {
    const data = await sql<Todo[]>`
      DELETE FROM todo
      WHERE id = ${todoId}
      RETURNING *;
    `;

    console.log("data:", data);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete todo.");
  }
}