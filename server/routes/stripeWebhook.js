// routes/stripeWebhook.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/bookingModel.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    console.error("Missing Stripe signature");
    return res.status(400).send(`Webhook Error: Missing Stripe signature`);
  }

  try {
    console.log("Receiving webhook event...");
    
    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log(`Webhook received: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Processing completed checkout:", session.id);
      
      const metadata = session.metadata;
      
      if (!metadata || !metadata.userId || !metadata.vehicleId) {
        console.error("Webhook error: Missing required metadata", metadata);
        return res.status(400).send(`Webhook Error: Missing required metadata`);
      }
      
      // Create the booking in your database
      try {
        const booking = await Booking.create({
          userId: metadata.userId,
          vehicleId: metadata.vehicleId,
          startDate: new Date(metadata.startDate),
          endDate: new Date(metadata.endDate),
          totalAmount: parseFloat(metadata.totalAmount),
          status: "confirmed"
        });
        
        console.log(`Booking created: ${booking._id}`);
      } catch (dbError) {
        console.error("Database error while creating booking:", dbError);
        // We still return 200 to Stripe to prevent retries, but log the error
        return res.json({ 
          received: true,
          warning: "Payment processed but booking creation failed"
        });
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;