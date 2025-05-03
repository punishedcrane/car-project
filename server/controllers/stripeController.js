// controller/stripeController
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  const { vehicle, userId, startDate, endDate } = req.body;

  const rentalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalAmount = vehicle.price * rentalDays;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rent ${vehicle.name}`,
            description: `From ${startDate} to ${endDate}`
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

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: "Stripe session failed" });
  }
};
