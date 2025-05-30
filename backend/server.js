
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret_key";
const app = express();
const PORT = 5000;

app.use(express.json());
// Middleware
app.use(cors());
app.use(bodyParser.json());







// اتصال بقاعدة بيانات MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // غيّر حسب إعداداتك
  password: "",         // أضف كلمة المرور إذا كانت موجودة
  database: "digital",  // اسم قاعدة البيانات
});

db.connect((err) => {
  if (err) {
    console.error("❌ خطأ في الاتصال:", err);
  } else {
    console.log("✅ تم الاتصال بقاعدة البيانات");
  }
});

// 🔐 إنشاء حساب جديد
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], async (err, result) => {
    if (err) {
      console.error("Database error during SELECT query:", err);  // سجل الخطأ هنا
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: "البريد الإلكتروني مستخدم بالفعل" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Database error during INSERT query:", err);  // سجل الخطأ هنا
        return res.status(500).json({ error: "فشل في إنشاء المستخدم" });
      }

      res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
    });
  });
});

// توليد التوكن JWT عند تسجيل الدخول
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length === 0) {
      return res.status(400).json({ error: "البريد الإلكتروني غير موجود" });
    }

    const user = results[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "كلمة المرور غير صحيحة" });
    }

    // تحقق إذا كان المستخدم Admin بناءً على البريد الإلكتروني
    const isAdmin = email === "dinimextaoufik@gmail.com";

    // توليد التوكن JWT
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    // const token = jwt.sign({ id: user.id, email: user.email, isAdmin }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // إرسال التوكن في الاستجابة
    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin, // إرسال صلاحيات المسؤول
      },
      token, // إرسال التوكن إلى الـ frontend
    });
  });
});

// Middleware للتحقق من صحة التوكن
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "توكن غير موجود أو التنسيق غير صحيح" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => { // ✅ استخدم نفس المفتاح
    if (err) {
      return res.status(401).json({ error: "توكن غير صالح" });
    }

    req.user = decoded;
    next();
  });
};

// مسار لإضافة منتج
// مسار لإضافة منتج
app.post("/api/products", verifyToken, (req, res) => {
  console.log("🟢 البيانات المرسلة من الواجهة:", req.body);
    const { title, description, price, category, image, featured } = req.body;
    const query = 'INSERT INTO products (title, description, price, category, image, featured) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [title, description, price, category, image, featured];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Failed to add product" });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    });
  });
  
// مسار لحصول المنتجات
app.get("/api/products", (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) {
      console.error('خطأ في جلب المنتجات:', err);
      return res.status(500).send('حدث خطأ أثناء جلب المنتجات');
    }
    res.json(result);
  });
});

// مسار لحذف منتج
app.delete("/api/products/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('خطأ في حذف المنتج:', err);
      return res.status(500).send('حدث خطأ أثناء حذف المنتج');
    }
    res.status(200).send('تم حذف المنتج');
  });
});
// مسار التعديل
// ✅ هذا الصحيح:
// ✅ جلب منتج حسب id
 // استرجاع المنتج



// تعديل المنتج
app.put("/api/products/:id", verifyToken, (req, res) => {
  console.log("Updating product with ID:", req.params.id); // سجل الـ ID
  const { id } = req.params;
  const { title, description, price, category, image, featured } = req.body;

  const query = `
    UPDATE products 
    SET title = ?, description = ?, price = ?, category = ?, image = ?, featured = ?
    WHERE id = ?
  `;
  const values = [title, description, price, category, image, featured, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating product:", err);
      return res.status(500).json({ error: "Failed to update product" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  });
});





// جلب منتج معين عبر ID
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM products WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(results[0]);
  });
});


//category
// إنشاء تصنيف جديد
app.post('/api/categories', (req, res) => {
  const { name, slug } = req.body;

  const sql = 'INSERT INTO categories (name, slug) VALUES (?, ?)';
  db.query(sql, [name, slug], (err, result) => {
    if (err) {
      console.error('خطأ في إنشاء التصنيف:', err);
      return res.status(500).json({ error: 'فشل في إنشاء التصنيف' });
    }
    res.status(201).json({ message: 'تم الإنشاء بنجاح', id: result.insertId });
  });
});

// تحديث تصنيف
app.put('/api/categories/:id', (req, res) => {
  const { name, slug } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE categories SET name = ?, slug = ? WHERE id = ?';
  db.query(sql, [name, slug, id], (err) => {
    if (err) {
      console.error('خطأ في التحديث:', err);
      return res.status(500).json({ error: 'فشل في تحديث التصنيف' });
    }
    res.json({ message: 'تم التحديث بنجاح' });
  });
});

// جلب تصنيف حسب ID
app.get('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM categories WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('خطأ في جلب التصنيف:', err);
      return res.status(500).json({ error: 'فشل في جلب التصنيف' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'التصنيف غير موجود' });
    }

    res.json(results[0]);
  });
});


// جلب كل التصنيفات
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('خطأ في جلب التصنيفات:', err);
      return res.status(500).json({ error: 'فشل في جلب التصنيفات' });
    }
    res.json(results);
  });
});


// حذف تصنيف حسب ID
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM categories WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('خطأ في حذف التصنيف:', err);
      return res.status(500).json({ error: 'فشل في حذف التصنيف' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'التصنيف غير موجود' });
    }

    res.status(200).json({ message: 'تم حذف التصنيف بنجاح' });
  });
});
// checout
 // تأكد من هذا في بداية ملف السيرفر

app.post("/api/orders", (req, res) => {
  console.log("Received order data:", req.body);

  const { orderNumber, date, firstName, lastName, email, address, city, postalCode, country, items } = req.body;

  const orderQuery = `
    INSERT INTO orders (order_number, date, first_name, last_name, email, address, city, postal_code, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderQuery,
    [orderNumber, date, firstName, lastName, email, address, city, postalCode, country],
    (err, result) => {
      if (err) {
        console.error("❌ خطأ أثناء حفظ الطلب:", err.message, err.stack);
        return res.status(500).json({ error: "فشل حفظ الطلب", details: err.message });
      }

      const orderId = result.insertId;

      const itemQueries = items.map((item) => {
        return new Promise((resolve, reject) => {
          db.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
            [orderId, item.product.id, item.quantity, item.product.price],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      });

      Promise.all(itemQueries)
        .then(() => res.status(201).json({ message: "تم حفظ الطلب بنجاح" }))
        .catch((error) => {
          console.error("❌ خطأ أثناء حفظ عناصر الطلب:", error.message, error.stack);
          res.status(500).json({ error: "فشل حفظ عناصر الطلب", details: error.message });
        });
    }
  );
});

// order
app.get('/api/orders', (req, res) => {
  console.log("START: getting orders");

  db.query('SELECT * FROM orders', (err, orders) => {
    if (err) {
      console.error("❌ خطأ في جلب الطلبات:", err);
      return res.status(500).json({ message: 'Server Error', error: err.message });
    }

    db.query(`
      SELECT 
        order_items.*, 
        products.title AS product_title,
        products.image AS product_image
      FROM order_items
      JOIN products ON order_items.product_id = products.id
    `, (err, items) => {
      if (err) {
        console.error("❌ خطأ في جلب عناصر الطلب:", err);
        return res.status(500).json({ message: 'Server Error', error: err.message });
      }

      const ordersWithItems = orders.map(order => {
        const orderItems = items.filter(item => item.order_id === order.id);
        return {
          ...order,
          items: orderItems.map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            title: item.product_title || 'Unknown',
            image: item.product_image || '',
          }))
        };
      });

      res.json({ orders: ordersWithItems });
    });
  });
});



// مثال Express.js مع mysql2/promise
app.put('/api/orders/:id/status', async (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "حالة الطلب مطلوبة" });
  }

  try {
    console.log("تحديث الطلب:", orderId, status);
    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    res.json({ message: "تم تحديث حالة الطلب بنجاح" });
  } catch (error) {
    console.error("خطأ في تحديث الحالة:", error);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
});



    



// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});


