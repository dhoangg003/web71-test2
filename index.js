const express = require("express");
const jwt = require("jsonwebtoken");
const { connectToDb, db } = require("./db");

const app = express();
const port = 3000;
const secretKey = "web-mindx";

app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    const token = jwt.sign({ username }, secretKey);

    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected resource accessed" });
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

app.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await db.inventories.find().toArray();
    res.json(products);
  } catch (error) {
    console.error("Failed to get products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/lowquantity", verifyToken, async (req, res) => {
  try {
    const { lowQuantity } = req.query;
    let query = {};

    if (lowQuantity) {
      query.quantity = { $lt: 100 };
    }

    const products = await db.collection("inventories").find(query).toArray();
    res.json(products);
  } catch (error) {
    console.error("Failed to get products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
  connectToDb();
});