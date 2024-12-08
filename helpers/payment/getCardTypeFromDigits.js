export const getCardType = (cardNumber) => {


  cardNumber = parseInt(cardNumber)

  if (!cardNumber) {
    return 'default';
  }

  const visaRegex = /^4[0-9]{0,}$/; // Visa cards start with 4
  const masterCardRegex = /^5[1-5][0-9]{0,}$/; // MasterCard cards start with 51–55
  const amexRegex = /^3[47][0-9]{0,}$/; // American Express starts with 34 or 37
  
  if (visaRegex.test(cardNumber)) {
    return 'visa';
  }
  if (masterCardRegex.test(cardNumber)) {
    return 'mastercard';
  }
  if (amexRegex.test(cardNumber)) {
    return 'amex';
  }
  return 'default'; // Default logo if card type is not recognized
};