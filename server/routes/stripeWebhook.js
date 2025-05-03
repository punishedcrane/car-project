import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/bookingModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const metadata = event.data.object.metadata;

    await Booking.create({
      userId: metadata.userId,
      vehicleId: metadata.vehicleId,
      startDate: metadata.startDate,
      endDate: metadata.endDate,
      totalAmount: metadata.totalAmount,
      status: "confirmed"
    });
  }

  res.json({ received: true });
});

export default router;
