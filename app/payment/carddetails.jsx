import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CardForm, useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePayment } from './PaymentContext'; // Your payment context for storing payment info
import { useRouter } from 'expo-router';

const CardDetails = () => {
  const { confirmPayment, createPaymentMethod } = useStripe();
  const { paymentInfo, setPaymentInfo } = usePayment();
  const router = useRouter();

  const [cardDetails, setCardDetails] = useState(null);

  // Handle the form completion and create a PaymentMethod
  const handleFormComplete = async (cardDetails) => {
    console.log("Card details from form:", cardDetails);

    if (cardDetails.complete) {
      // Create PaymentMethod using Stripe API with the card details
      const { error, paymentMethod } = await createPaymentMethod({
        type: 'Card', // Ensure the type is 'Card'
        card: cardDetails, // Pass the card details from the form
      });

      if (error) {
        console.error("Error creating PaymentMethod:", error);
        Alert.alert('Error', 'Failed to create payment method. Please try again.');
      } else {
        console.log("PaymentMethod created:", paymentMethod);
        
        // Store the PaymentMethod ID (and other details) in your context
        setPaymentInfo({
          ...paymentInfo,
          paymentMethodId: paymentMethod.id,
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear,
          cvc: cardDetails.cvc,
          postalCode: cardDetails.postalCode,
        });
        
        Alert.alert('Success', 'Payment details saved successfully!');
      }
    } else {
      Alert.alert('Error', 'Please complete the card details.');
    }
  };

  // Handle saving payment details
  const handleSave = () => {
    if (cardDetails?.complete) {
      Alert.alert('Success', 'Payment details saved successfully!');
    } else {
      Alert.alert('Error', 'Please complete the card details.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Card Settings</Text>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethods}>
        <CardForm
          postalCodeEnabled={true} // Enable postal code entry
          style={styles.cardForm}
          onFormComplete={handleFormComplete} // Callback to handle card details once form is complete
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.payButton} onPress={handleSave}>
        <Text style={styles.payButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    textAlign: 'center',
    width: '80%',
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    marginLeft: 10,
  },
  paymentMethods: {
    marginBottom: 30,
  },
  cardForm: {
    marginVertical: 20,
    height: 500,
  },
  payButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  payButtonText: {
    fontFamily: 'Satoshi',
    fontSize: 18,
    color: '#fff',
  },
});

export default CardDetails;