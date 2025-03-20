import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Address from "../models/addressModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

dotenv.config();
const router = express.Router();

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

// 📌 Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// 📌 Add Address
router.post("/address/add", authenticateUser, async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new address document
    const newAddress = new Address({ street, city, state, zipCode, country });
    await newAddress.save();

    // Push the address ID into the user's addresses array
    user.addresses.push(newAddress._id);
    await user.save();

    res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Error adding address", error });
  }
});


// 📌 Add to Cart
router.post("/cart/add", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, products: [] });
    }
    const productIndex = cart.products.findIndex((p) => p.product.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
});

// 📌 Get All Cart Items
router.get("/cart/items", authenticateUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
});


// 📌 Remove from Cart
router.delete("/cart/remove/:cartId", authenticateUser, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.body; // Get productId from request body

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ _id: cartId, user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.products.length;
    cart.products = cart.products.filter((p) => p.product.toString() !== productId);

    if (cart.products.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error });
  }
});


// 📌 Place Order
router.post("/order/place", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("addresses");
    const cart = await Cart.findOne({ user: req.userId }).populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!user.addresses.length) {
      return res.status(400).json({ message: "No address found. Please add an address." });
    }

    const address = user.addresses[0]._id;

    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const totalAmount = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = new Order({
      user: req.userId,
      products: cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "Pending",
      address,
    });

    await order.save();
    await Cart.findOneAndDelete({ user: req.userId });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
});

// 📌 Get User Orders
router.get("/orders", authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("products.product")
      .populate("address");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the actual error
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// 📌 Get Single Order
router.get("/orders/:id", authenticateUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("address");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// 📌 Cancel Order
router.put("/orders/cancel/:id", authenticateUser, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
});

console.log("User routes loaded at /api/users");
export default router;
