
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json({ limit: "15mb" }));
// app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// /* ================= DB ================= */
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });

// const safeQuery = async (query, params = []) => {
//   try {
//     return await pool.query(query, params);
//   } catch (err) {
//     console.log("DB ERROR:", err.message);
//     return { rows: [] };
//   }
// };

// /* ================= HEALTH ================= */
// app.get("/", (req, res) => {
//   res.json({ status: "Backend working 🚀" });
// });

// /* ================= REGISTER ================= */
// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   const exists = await safeQuery(
//     "SELECT id FROM users WHERE email=$1",
//     [email]
//   );

//   if (exists.rows.length > 0) {
//     return res.status(400).json({ error: "User exists" });
//   }

//   const result = await safeQuery(
//     `INSERT INTO users (name, email, password, money, level, used_promo, discount, discount_cars, avatar)
//      VALUES ($1,$2,$3,1000,1,false,0,NULL,NULL)
//      RETURNING *`,
//     [name, email, password]
//   );

//   res.json({ success: true, user: result.rows[0] });
// });

// /* ================= LOGIN ================= */
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const result = await safeQuery(
//     "SELECT * FROM users WHERE email=$1 AND password=$2",
//     [email, password]
//   );

//   const user = result.rows[0];

//   if (!user) {
//     return res.status(400).json({ error: "wrong login" });
//   }

//   res.json({
//     success: true,
//     user,
//     token: "fake-" + user.id
//   });
// });

// /* ================= PROFILE ================= */
// app.get("/profile/:id", async (req, res) => {
//   const result = await safeQuery(
//     "SELECT * FROM users WHERE id=$1",
//     [req.params.id]
//   );

//   res.json(result.rows[0] || {});
// });

// /* ================= AVATAR ================= */
// app.post("/update-avatar", async (req, res) => {
//   const { userId, avatar } = req.body;

//   if (!userId || !avatar) {
//     return res.status(400).json({ error: "missing data" });
//   }

//   const result = await safeQuery(
//     "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING *",
//     [avatar, userId]
//   );

//   res.json({
//     success: true,
//     user: result.rows[0]
//   });
// });

// /* ================= CARS ================= */
// app.get("/cars", async (req, res) => {
//   const result = await safeQuery(
//     "SELECT * FROM cars WHERE user_id IS NULL"
//   );

//   res.json(result.rows);
// });

// /* ================= CONFIGS (если добавишь таблицу) ================= */
// /* ================= GLOBAL CONFIGS ================= */
// app.get("/configs", async (req, res) => {
//   const result = await safeQuery(
//     "SELECT * FROM global_car_configs ORDER BY type, id"
//   );

//   const grouped = {
//     power: [],
//     tuning: [],
//     wheels: []
//   };

//   result.rows.forEach((item) => {
//     if (grouped[item.type]) {
//       grouped[item.type].push(item);
//     }
//   });

//   res.json(grouped);
// });

// /* ================= BUY ================= */
// app.post("/buy", async (req, res) => {
//   const { userId, carId } = req.body;

//   const user = (await safeQuery(
//     "SELECT * FROM users WHERE id=$1",
//     [userId]
//   )).rows[0];

//   const car = (await safeQuery(
//     "SELECT * FROM cars WHERE id=$1",
//     [carId]
//   )).rows[0];

//   if (!user || !car) {
//     return res.status(404).json({ error: "not found" });
//   }

//   let price = car.price;

//   /* ================= DISCOUNT ================= */
//   if (user.discount && user.discount_cars) {
//     const allowed = user.discount_cars;

//     const can =
//       Array.isArray(allowed)
//         ? allowed.includes(car.id)
//         : String(allowed).includes(String(car.id));

//     if (can) {
//       price = price - (price * user.discount) / 100;
//     }
//   }

//   if (user.money < price) {
//     return res.status(400).json({ error: "not enough money" });
//   }

//   await safeQuery(
//     "UPDATE users SET money = money - $1 WHERE id=$2",
//     [price, userId]
//   );

//   await safeQuery(
//     "UPDATE cars SET user_id=$1 WHERE id=$2",
//     [userId, carId]
//   );

//   res.json({
//     success: true,
//     paid: price
//   });
// });

// /* ================= WHEEL ================= */
// app.get("/wheel", async (req, res) => {
//   const result = await safeQuery(
//     "SELECT * FROM wheel_items ORDER BY id ASC"
//   );

//   res.json(result.rows);
// });

// app.post("/wheel/spin", async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(400).json({ error: "no user" });
//   }

//   const items = (await safeQuery("SELECT * FROM wheel_items")).rows;

//   let total = items.reduce((s, i) => s + Number(i.chance || 0), 0);
//   let r = Math.random() * total;

//   let win = items[0];

//   for (let i = 0; i < items.length; i++) {
//     r -= Number(items[i].chance || 0);
//     if (r <= 0) {
//       win = items[i];
//       break;
//     }
//   }

//   if (win.type === "money") {
//     await safeQuery(
//       "UPDATE users SET money = money + $1 WHERE id=$2",
//       [win.value, userId]
//     );
//   }

//   if (win.type === "car") {
//     await safeQuery(
//       "UPDATE cars SET user_id=$1 WHERE id=$2",
//       [userId, win.value]
//     );
//   }

//   if (win.type === "promo") {
//     await safeQuery(
//       "UPDATE users SET level = level + 1 WHERE id=$1",
//       [userId]
//     );
//   }

//   res.json({
//     success: true,
//     win
//   });
// });

// /* ================= PROMO ================= */
// app.post("/promo/redeem", async (req, res) => {
//   const { userId, code } = req.body;

//   const promo = (await safeQuery(
//     "SELECT * FROM promo_codes WHERE code=$1",
//     [code]
//   )).rows[0];

//   if (!promo) {
//     return res.status(400).json({ error: "invalid promo" });
//   }

//   const usedBy = promo.used_by || [];

//   if (usedBy.includes(userId)) {
//     return res.status(400).json({ error: "already used" });
//   }

//   /* spin promo */
//   if (promo.type === "spin") {
//     await safeQuery(
//       "UPDATE users SET used_promo=true WHERE id=$1",
//       [userId]
//     );
//   }

//   /* discount promo */
//   if (promo.type === "discount") {
//     await safeQuery(
//       `UPDATE users 
//        SET discount=$1, discount_cars=$2
//        WHERE id=$3`,
//       [promo.value, promo.car_ids, userId]
//     );
//   }

//   await safeQuery(
//     "UPDATE promo_codes SET used_by = array_append(COALESCE(used_by, '{}'), $1) WHERE code=$2",
//     [userId, code]
//   );

//   res.json({
//     success: true,
//     type: promo.type,
//     value: promo.value
//   });
// });

// /* ================= START ================= */
// app.listen(5000, "0.0.0.0", () => {
//   console.log("🚀 SERVER RUNNING ON PORT 5000");
// });




require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

/* ================= DB ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const safeQuery = async (query, params = []) => {
  try {
    return await pool.query(query, params);
  } catch (err) {
    console.log("DB ERROR:", err.message);
    return { rows: [] };
  }
};

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ status: "Backend working 🚀" });
});

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await safeQuery(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (exists.rows.length > 0) {
    return res.status(400).json({ error: "User exists" });
  }

  const result = await safeQuery(
    `INSERT INTO users (name, email, password, money, level, used_promo, discount, discount_cars, avatar)
     VALUES ($1,$2,$3,1000,1,false,0,'[]',NULL)
     RETURNING *`,
    [name, email, password]
  );

  res.json({ success: true, user: result.rows[0] });
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await safeQuery(
    "SELECT * FROM users WHERE email=$1 AND password=$2",
    [email, password]
  );

  const user = result.rows[0];

  if (!user) {
    return res.status(400).json({ error: "wrong login" });
  }

  res.json({
    success: true,
    user,
    token: "fake-" + user.id
  });
});

/* ================= PROFILE ================= */
app.get("/profile/:id", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM users WHERE id=$1",
    [req.params.id]
  );

  res.json(result.rows[0] || {});
});

/* ================= AVATAR ================= */
app.post("/update-avatar", async (req, res) => {
  const { userId, avatar } = req.body;

  if (!userId || !avatar) {
    return res.status(400).json({ error: "missing data" });
  }

  const result = await safeQuery(
    "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING *",
    [avatar, userId]
  );

  res.json({
    success: true,
    user: result.rows[0]
  });
});

/* ================= CARS ================= */
app.get("/cars", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM cars WHERE user_id IS NULL"
  );

  res.json(result.rows);
});

/* ================= CONFIGS ================= */
app.get("/configs", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM global_car_configs ORDER BY type, id"
  );

  const grouped = {
    power: [],
    tuning: [],
    wheels: []
  };

  result.rows.forEach((item) => {
    if (grouped[item.type]) {
      grouped[item.type].push(item);
    }
  });

  res.json(grouped);
});

/* ================= BUY (FIXED DISCOUNT) ================= */
app.post("/buy", async (req, res) => {
  const { userId, carId, configIds } = req.body;

  const user = (await safeQuery(
    "SELECT * FROM users WHERE id=$1",
    [userId]
  )).rows[0];

  const car = (await safeQuery(
    "SELECT * FROM cars WHERE id=$1",
    [carId]
  )).rows[0];

  if (!user || !car) {
    return res.status(404).json({ error: "not found" });
  }

  // configs price
  let configPrice = 0;

  if (Array.isArray(configIds) && configIds.length > 0) {
    const configs = await safeQuery(
      "SELECT * FROM global_car_configs WHERE id = ANY($1)",
      [configIds]
    );

    configPrice = configs.rows.reduce((sum, c) => sum + Number(c.price || 0), 0);
  }

  let price = Number(car.price) + configPrice;

  // 🔥 FIX DISCOUNT LOGIC
  if (user.discount && Number(user.discount) > 0) {
    price = price - (price * Number(user.discount)) / 100;
  }

  if (user.money < price) {
    return res.status(400).json({ error: "not enough money" });
  }

  await safeQuery(
    "UPDATE users SET money = money - $1 WHERE id=$2",
    [price, userId]
  );

  await safeQuery(
    "UPDATE cars SET user_id=$1 WHERE id=$2",
    [userId, carId]
  );

  res.json({
    success: true,
    paid: price
  });
});

/* ================= WHEEL ================= */
app.get("/wheel", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM wheel_items ORDER BY id ASC"
  );

  res.json(result.rows);
});

app.post("/wheel/spin", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "no user" });
  }

  const items = (await safeQuery("SELECT * FROM wheel_items")).rows;

  let total = items.reduce((s, i) => s + Number(i.chance || 0), 0);
  let r = Math.random() * total;

  let win = items[0];

  for (let i = 0; i < items.length; i++) {
    r -= Number(items[i].chance || 0);
    if (r <= 0) {
      win = items[i];
      break;
    }
  }

  if (win.type === "money") {
    await safeQuery(
      "UPDATE users SET money = money + $1 WHERE id=$2",
      [win.value, userId]
    );
  }

  if (win.type === "car") {
    await safeQuery(
      "UPDATE cars SET user_id=$1 WHERE id=$2",
      [userId, win.value]
    );
  }

  if (win.type === "promo") {
    await safeQuery(
      "UPDATE users SET level = level + 1 WHERE id=$1",
      [userId]
    );
  }

  res.json({
    success: true,
    win
  });
});

/* ================= PROMO (FIXED) ================= */
app.post("/promo/redeem", async (req, res) => {
  const { userId, code } = req.body;

  const promo = (await safeQuery(
    "SELECT * FROM promo_codes WHERE code=$1",
    [code]
  )).rows[0];

  if (!promo) {
    return res.status(400).json({ error: "invalid promo" });
  }

  const usedBy = promo.used_by || [];

  if (usedBy.includes(userId)) {
    return res.status(400).json({ error: "already used" });
  }

  /* spin */
  if (promo.type === "spin") {
    await safeQuery(
      "UPDATE users SET used_promo=true WHERE id=$1",
      [userId]
    );
  }

  /* discount FIXED JSON */
  if (promo.type === "discount") {
    await safeQuery(
      `UPDATE users 
       SET discount=$1,
           discount_cars=$2
       WHERE id=$3`,
      [
        promo.value,
        JSON.stringify(promo.car_ids || []),
        userId
      ]
    );
  }

  await safeQuery(
    "UPDATE promo_codes SET used_by = array_append(COALESCE(used_by, '{}'), $1) WHERE code=$2",
    [userId, code]
  );

  res.json({
    success: true,
    type: promo.type,
    value: promo.value
  });
});

/* ================= START ================= */
app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING ON PORT 5000");
});