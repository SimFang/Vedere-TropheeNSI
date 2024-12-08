import React, { createContext, useState, useContext } from 'react';

// Create the Payment Context
const PaymentContext = createContext();

// Payment Provider component
export const PaymentProvider = ({ children }) => {
  const [orderInfo, setOrderInfo] = useState();

  return (
    <PaymentContext.Provider value={{ orderInfo, setOrderInfo }}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook for accessing the Payment Context
export const usePayment = () => {
  return useContext(PaymentContext);
};