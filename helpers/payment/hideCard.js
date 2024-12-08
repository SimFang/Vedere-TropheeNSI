export const maskCreditCard = (cardNumber) => {
    // Check if the input is a valid string and has at least 4 digits
    if (typeof cardNumber === 'string' && cardNumber.length >= 4) {
      // Extract the last 4 digits
      const lastFour = cardNumber.slice(-5);
      
      // Mask the rest of the card number with "..."
      const masked = `...${lastFour}`;
      
      return masked;
    }
    
    return null; // Return null if the card number is invalid
  };