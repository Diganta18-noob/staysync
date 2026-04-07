const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async ({ booking, user }) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Security Deposit',
              description: `Security deposit for Room booking`,
            },
            unit_amount: Math.round(booking.depositAmount * 100), // Stripe uses paise
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: booking.proRataAmount > 0 ? 'Pro-Rata First Month Rent' : 'First Month Rent',
              description: booking.proRataAmount > 0
                ? `Pro-rata rent for remaining days`
                : `Full month rent`,
            },
            unit_amount: Math.round((booking.proRataAmount || booking.monthlyRent) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        userId: user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/bookings?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/bookings?status=cancelled`,
    });

    return session;
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    throw error;
  }
};

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      return {
        type: 'payment_success',
        bookingId: event.data.object.metadata.bookingId,
        sessionId: event.data.object.id,
      };

    case 'checkout.session.expired':
      return {
        type: 'payment_expired',
        bookingId: event.data.object.metadata.bookingId,
      };

    default:
      return { type: 'unhandled', eventType: event.type };
  }
};

module.exports = { createCheckoutSession, handleWebhookEvent };
