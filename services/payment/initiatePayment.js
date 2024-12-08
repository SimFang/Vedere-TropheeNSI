import routes from '../../constants/routes.json'

export const createPaymentIntent = async (amount) => {
    try {
      const response = await fetch(routes.serverUrl+routes.handlePayment, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
    } catch (e) {
      console.log("Error creating payment intent:", e);
      throw e;
    }
  };