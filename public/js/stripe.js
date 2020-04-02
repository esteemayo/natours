import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_GGtwP3i2MudVjz4ZXRkw2yFG00rIhLjXZe');

export const bookTour = async tourId => {
    try {
        // 1)Get checkout session from API
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);

        // 2) Create checkout form + charge credit card (automatically)
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};