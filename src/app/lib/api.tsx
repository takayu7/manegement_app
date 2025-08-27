import postgres from "postgres";
import {
  User,
  Product,
  Category,
  Supplier,
  Todo,
  CartItem,
  Sort,
  PurchaseHistory,
  BuyProductList,
  SortType,
  LineType,
  UserBuyParameterType,
  ReviewType,
  ReviewRecType,
  ShiftType,
  ShiftDataType,
  AllReviewType,
  userItemsType,
} from "@/app/types/type";
import { generateCustomId } from "@/app/lib/utils";

const sql = postgres(process.env.POSTGRES_URL!);

// ユーザーデータの取得
export async function fetchUserDatas() {
  try {
    const data = await sql<User[]>`SELECT * FROM users`;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

// ユーザーデータを名前を基に曖昧検索して取得
export async function fetchUserDatasByUserName(userName: string) {
  try {
    let data = await sql<
      User[]
    >`SELECT id, name, password, icon FROM users WHERE name LIKE ${
      "%" + userName + "%"
    }`;
    //曖昧検索でユーザーデータが取得できない場合は、全件検索でユーザーデータを取得
    if (data.length === 0) {
      data = await sql<User[]>`SELECT * FROM users`;
    }
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

//ユーザーデータをIDを基に取得
export async function fetchUserDatasById(userId: string) {
  try {
    const data = await sql<User[]>`SELECT * FROM users WHERE id = ${userId}`;

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

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user.");
  }
}

// ユーザーデータデータの更新
export async function updateUser(user: User) {
  try {
    const data = await sql<User[]>`
      UPDATE users
      SET
        name = ${user.name},
        password = ${user.password},
        icon = ${user.icon}
      WHERE
        id = ${user.id}
      RETURNING *;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update todo.");
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

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch supplier.");
  }
}

// 仕入リストの登録
export async function createSupplier(supplier: Supplier) {
  try {
    const data = await sql<Supplier[]>`
      INSERT INTO supplierlist (id, name)
      VALUES (${supplier.id}, ${supplier.name})
      RETURNING *;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create supplier.");
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

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete supplier.");
  }
}

// 商品データの取得
export async function fetchProductDatas(sort: Sort | null = null) {
  // 許可された値のみを使用
  const allowedSortFields = [
    "name",
    "category",
    "supplier",
    "count",
    "cost",
    "price",
    "order",
  ] as const;
  const allowedSortOrders = ["asc", "desc"] as const;

  // デフォルト値
  let sortField = "name";
  let sortOrder = "asc";

  // バリデーション
  if (sort) {
    if (allowedSortFields.includes(sort.sort as SortType)) {
      sortField = sort.sort;
    }
    if (allowedSortOrders.includes(sort.line as LineType)) {
      sortOrder = sort.line;
    }
  }

  try {
    const data = await sql<Product[]>`
      SELECT * FROM product
      ORDER BY ${sql.unsafe(sortField)} ${sql.unsafe(sortOrder)}
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

//　商品単体の取得
export async function fetchProductSingleData(productId: string) {
  try {
    const data = await sql<Product[]>`
      SELECT *
      FROM product
      WHERE id = ${productId}
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch review data.");
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

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update product.");
  }
}

// 商品データの購入処理
export async function updateBuyProduct(cart: CartItem[]) {
  try {
    const results: Product[] = [];
    for (const item of cart) {
      const data = await sql<Product[]>`
    UPDATE product
    SET count = count - ${item.buyCount}
    WHERE id = ${item.id}
    RETURNING *;
  `;
      results.push(...data);
    }
    return results;
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

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product.");
  }
}
// 購入履歴の登録
export async function createPurchaseHistory(buyProductList: BuyProductList[]) {
  try {
    const groupId = generateCustomId();

    for (const item of buyProductList) {
      if (!item.id || !item.userid || !item.count) {
        console.error("itemの値が不正です:", item);
        continue; // または throw new Error で中断
      }
      await sql`
        INSERT INTO purchase_history (id, userid, count, buy_date, buy_group_id)
        VALUES (${item.id}, ${item.userid}, ${item.count}, NOW(), ${groupId})
        RETURNING *;
      `;
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create product.");
  }
}

// 購入履歴の取得
export async function fetchPurchaseHistory(userid: string) {
  try {
    type apiPurchaseHistory = {
      id: string;
      userid: string;
      name: string;
      category: number;
      price: number;
      count: number;
      buy_date: Date | null;
      buy_group_id: number;
    };
    const data = await sql<apiPurchaseHistory[]>`
      SELECT
        ph.id,
        ph.userid,
        product.name,
        product.category,
        product.price,
        ph.count,
        ph.buy_date AS buy_date,
        ph.buy_group_id AS buy_group_id
      FROM purchase_history ph
      INNER JOIN product ON ph.id = product.id
      WHERE ph.userid = ${userid}
      ORDER BY buy_date DESC`;

    // スネークケース→キャメルケース変換（1件ずつ）
    const result: PurchaseHistory[] = data.map((item) => ({
      buyGroupId: item.buy_group_id,
      productList: {
        id: item.id,
        userid: item.userid,
        name: item.name,
        category: item.category,
        price: item.price,
        count: item.count,
        buyDate: item.buy_date ? new Date(item.buy_date) : null,
      },
    }));

    // buyGroupIdごとにまとめる
    const groupMap = new Map<number, PurchaseHistory["productList"][]>();
    result.forEach((item) => {
      const groupId = item.buyGroupId;
      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, []);
      }
      groupMap.get(groupId)!.push(item.productList);
    });

    const resultGrouped = Array.from(groupMap.entries()).map(
      ([buyGroupId, productList]) => ({
        buyGroupId,
        productList,
      })
    );

    return resultGrouped;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch purchase history.");
  }
}

// 購入履歴の取得_すべて
export async function fetchBuyAllHistory() {
  try {
    const data = await sql<UserBuyParameterType[]>`
      SELECT
        ph.id,
        ph.userid,
        users.name,
        users.icon,
        product.price,
        ph.count,
        ph.buy_date AS date
      FROM purchase_history ph
      INNER JOIN product ON ph.id = product.id
      INNER JOIN users ON ph.userid = users.id
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch purchase history.");
  }
}

// 評価の所得‗全件
export async function fetchReviewAllDatas() {
  try {
    type apiReviewType = {
      product_id: string;
      star: number;
      name: string;
    };
    const data = await sql<apiReviewType[]>`
      SELECT
        re.product_id,
        re.star,
        product.name AS name
      FROM review re
      INNER JOIN product ON re.product_id = product.id
    `;

    // スネークケース→キャメルケース変換（1件ずつ）
    const result: AllReviewType[] = data.map((item) => ({
      productId: item.product_id,
      star: item.star,
      name: item.name,
    }));

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch review data.");
  }
}

//　評価の取得_商品指定
export async function fetchReviewDatas(productId: string) {
  try {
    type apiReviewType = {
      product_id: string;
      star: number;
      comment: string;
      date: Date;
      user_name: string;
      user_icon: number;
    };
    const data = await sql<apiReviewType[]>`
      SELECT
        re.product_id,
        re.star,
        re.comment,
        re.date,
        users.name AS user_name,
        users.icon AS user_icon
      FROM review re
      INNER JOIN users ON re.user_id = users.id
      WHERE re.product_id = ${productId}
      ORDER BY date DESC;
    `;

    // スネークケース→キャメルケース変換（1件ずつ）
    const result: ReviewType[] = data.map((item) => ({
      productId: item.product_id,
      star: item.star,
      comment: item.comment,
      date: new Date(item.date),
      userName: item.user_name,
      userIcon: item.user_icon,
    }));

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch review data.");
  }
}

// 評価の登録
export async function createReview(review: ReviewRecType) {
  try {
    if (!review.userId) {
      throw new Error("userId is required and must not be null or undefined.");
    }
    await sql`
      INSERT INTO review (product_id, star, comment, user_id, date)
      VALUES (${review.productId}, ${review.star}, ${review.comment}, ${review.userId}, NOW())
      RETURNING *;
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create review.");
  }
}

//　後で買うとお気に入りの取得
export async function fetchUserItemDatas(userId: string) {
  try {
    const data = await sql<
      {
        product_id: string;
        product_name: string;
      }[]
    >`
  SELECT
    ui.user_id,
    bl.product_id,
    p.name AS product_name
  FROM user_items ui
  LEFT JOIN LATERAL unnest(string_to_array(ui.buy_later, ',')) AS bl(product_id) ON TRUE
  LEFT JOIN product p ON p.id = bl.product_id
  WHERE ui.user_id = ${userId}
`;
    //データがなければ空を返す
    if (!data) {
      return data;
    }

    // スネークケース→キャメルケース変換（1件ずつ）
    const result: userItemsType[] = data.map((item) => ({
      userId: userId,
      productId: item.product_id,
      productName: item.product_name,
    }));

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to fetch review data.");
  }
}

// 後で購入の登録
type userItemsReq = {
  productId: string;
  userId: string;
};
export async function upUserItemDatas({ productId, userId }: userItemsReq) {
  const myLaterList: userItemsType[] = await fetchUserItemDatas(userId);

  try {
    if (!myLaterList || myLaterList.length === 0) {
      await sql`
        INSERT INTO user_items (user_id, buy_later)
        VALUES (${userId}, ${productId});
      `;
    } else {
      const isExist = myLaterList.some((item) => item.productId === productId);
      if (isExist) {
        return;
      } else {
        await sql`
            UPDATE user_items
            SET buy_later =
            CASE
              WHEN buy_later IS NULL OR buy_later = '' THEN ${productId}
              ELSE buy_later || ',' || ${productId}
            END
            WHERE user_id = ${userId}
          `;
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to create shift.");
  }
}

export async function deleteUserItemDatas({ productId, userId }: userItemsReq) {
  const myLaterList: userItemsType[] = await fetchUserItemDatas(userId);

  try {
    if (!myLaterList || myLaterList.length === 0) {
      return;
    } else {
      const isExist = myLaterList.some((item) => item.productId === productId);
      if (!isExist) {
        return;
      } else {
        await sql`
            UPDATE user_items
            SET buy_later = array_to_string(array_remove(string_to_array(buy_later, ','), ${productId}), ',')
            WHERE user_id = ${userId}
          `;
        // buy_laterがnullまたは空文字になった場合は行ごと削除
        await sql`
            DELETE FROM user_items
            WHERE user_id = ${userId} AND (buy_later IS NULL OR buy_later = '')
          `;
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error("Failed to create shift.");
  }
}

// TODOデータの取得
export async function fetchTodo() {
  try {
    const data = await sql<Todo[]>`
      SELECT
        todo.userId AS userId,
        todo.todoId,
        users.name,
        users.icon,
        todo.todo,
        todo.deadline,
        todo.checked
      FROM todo INNER JOIN users ON todo.userId = users.id
      ORDER BY deadline;
    `;

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
      INSERT INTO todo (userId,todo, deadline, checked)
      VALUES (${todo.userid}, ${todo.todo}, ${todo.deadline}, ${todo.checked})
      RETURNING *;
    `;

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
        userid = ${todo.userid},
        todo = ${todo.todo},
        deadline = ${todo.deadline},
        checked = ${todo.checked}
      WHERE
        todoId = ${todo.todoid}
      RETURNING *;
    `;

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
      WHERE todoId = ${todoId}
      RETURNING *;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete todo.");
  }
}

// 特定の月のシフトデータの取得
export async function fetchShiftByMonth(targetDate: string) {
  type apiShiftType = {
    user_id: string;
    name: string;
    icon: string;
    shift_date: Date;
    start_time: string;
    end_time: string;
    status: number;
  };

  try {
    const rawData = await sql<apiShiftType[]>`
      SELECT
        shift.user_id,
        users.name as name,
        users.icon as icon,
        shift.shift_date,
        shift.start_time,
        shift.end_time,
        shift.status
      FROM shift INNER JOIN users ON shift.user_id = users.id
  WHERE to_char(shift.shift_date, 'YYYY-MM') = ${targetDate}
      ORDER BY shift_date;
    `;
    // ユーザーごとにグループ化
    const grouped = Object.values(
      rawData.reduce((acc, item) => {
        if (!acc[item.user_id]) {
          acc[item.user_id] = {
            userId: item.user_id,
            name: item.name,
            icon: item.icon,
            shiftData: [],
          };
        }
        acc[item.user_id].shiftData.push({
          shiftDate: item.shift_date,
          startTime: item.start_time,
          endTime: item.end_time,
          status: item.status,
        });
        return acc;
      }, {} as Record<string, { userId: string; name: string; icon: string; shiftData: ShiftDataType[] }>)
    );

    return grouped;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}

// 特定のユーザーのシフトデータの取得
export async function fetchShiftByUserName(targetUserName: string) {
  type apiShiftType = {
    user_id: string;
    name: string;
    icon: string;
    shift_date: Date;
    start_time: string;
    end_time: string;
    status: number;
  };

  try {
    const rawData = await sql<apiShiftType[]>`
      SELECT
        shift.user_id,
        users.name as name,
        users.icon as icon,
        shift.shift_date,
        shift.start_time,
        shift.end_time,
        shift.status
      FROM shift INNER JOIN users ON shift.user_id = users.id
  WHERE name LIKE ${"%" + targetUserName + "%"}
      ORDER BY shift_date;
    `;
    // ユーザーごとにグループ化
    const grouped = Object.values(
      rawData.reduce((acc, item) => {
        if (!acc[item.user_id]) {
          acc[item.user_id] = {
            userId: item.user_id,
            name: item.name,
            icon: item.icon,
            shiftData: [],
          };
        }
        acc[item.user_id].shiftData.push({
          shiftDate: item.shift_date,
          startTime: item.start_time,
          endTime: item.end_time,
          status: item.status,
        });
        return acc;
      }, {} as Record<string, { userId: string; name: string; icon: string; shiftData: ShiftDataType[] }>)
    );

    return grouped;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
}

// シフトデータの登録
export async function createShift(shift: ShiftType, targetDate: string) {
  const shiftList = await fetchShiftByMonth(targetDate);
  const userShift = shiftList.find((t) => t.userId === shift.userId);

  try {
    for (const item of shift.shiftData) {
      const existingShift = (userShift?.shiftData || []).find(
        (es) =>
          item.shiftDate &&
          es.shiftDate &&
          new Date(item.shiftDate).toISOString().slice(0, 10) ===
            new Date(es.shiftDate).toISOString().slice(0, 10)
      );
      console.log("existingShift", existingShift);
      if (!existingShift) {
        await sql`
            INSERT INTO shift (user_id, shift_date, start_time, end_time, status)
            VALUES (
              ${shift.userId ? shift.userId : null},
              ${
                item.shiftDate
                  ? new Date(item.shiftDate).toISOString().slice(0, 10)
                  : null
              },
              ${
                item.startTime && item.startTime !== "" ? item.startTime : null
              },
              ${item.endTime && item.endTime !== "" ? item.endTime : null},
              ${typeof item.status === "number" ? item.status : null}
            )
            RETURNING *;
          `;
      } else {
        await sql`
            UPDATE shift
            SET
              start_time = ${
                item.startTime && item.startTime !== "" ? item.startTime : null
              },
              end_time = ${
                item.endTime && item.endTime !== "" ? item.endTime : null
              },
              status = ${typeof item.status === "number" ? item.status : null}
            WHERE
              user_id = ${shift.userId}
              AND shift_date = ${
                item.shiftDate
                  ? new Date(item.shiftDate).toISOString().slice(0, 10)
                  : null
              }
            RETURNING *;
          `;
      }
    }
  } catch (error) {
    console.error("Database Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    console.error("リクエスト内容:", shift);
    console.error("ユーザーのシフト情報:", userShift);
    throw new Error("Failed to create shift.");
  }
}
