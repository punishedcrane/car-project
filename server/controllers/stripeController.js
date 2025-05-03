import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  try {
    console.log("Creating Stripe session with data:", req.body);
    const { vehicle, userId, startDate, endDate } = req.body;

    if (!vehicle || !vehicle._id || !vehicle.name || !vehicle.price) {
      return res.status(400).json({ 
        message: "Invalid vehicle data provided",
        received: req.body
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const rentalDays = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    if (rentalDays <= 0) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const totalAmount = Math.round(vehicle.price * rentalDays);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rent ${vehicle.name}`,
            description: `From ${startDate} to ${endDate} (${rentalDays} days)`
          },
          unit_amount: totalAmount * 100, // in cents
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        userId,
        vehicleId: vehicle._id,
        startDate,
        endDate,
        totalAmount
      }
    });

    console.log("Stripe session created:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: "Stripe session failed", error: error.message });
  }
};