/*eslint-disable */
import { showAlert } from './alerts';
import { loadStripe } from '@stripe/stripe-js';

export const bookTour = async (tourId) => {
  const stripe = await loadStripe(
    'pk_test_51P7W5WP1NQuXXZ3y6F2xdXAfn8x9CgMLKXGpMpNNLK8MxOTLG4s3RDcGzn3V0f7ubgbzOmk3c7vZPwo5rR8G1rlI00SjXEQRkO',
  );

  try {
    const response = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    const session = response.data.session;

    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
