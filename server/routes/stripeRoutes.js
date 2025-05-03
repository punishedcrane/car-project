// routes/stripeRoutes.js
import express from "express";
import { createStripeSession } from "../controllers/stripeController.js";

const router = express.Router();

router.post("/create-checkout-session", createStripeSession);

export default router;
