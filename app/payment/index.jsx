import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { createPaymentIntent } from '../../services/payment/initiatePayment';
import { usePayment } from './PaymentContext';
import { useRouter, useParams } from 'expo-router';
import { getCardType } from '../../helpers/payment/getCardTypeFromDigits';
import { maskCreditCard } from '../../helpers/payment/hideCard';
import { useLocalSearchParams } from 'expo-router';



import VisaLogo from '../../assets/images/cards/visa.png'  
import AmexLogo from '../../assets/images/cards/amex.png'  
import MastercardLogo from '../../assets/images/cards/mastercard.png'


const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const { orderInfo, setOrderInfo } = usePayment();
  const router = useRouter()
  const data = useLocalSearchParams();

    const InitiatePayment = async (amount) => {
      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = await createPaymentIntent(amount);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        //methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
        returnURL: 'your-app://stripe-redirect'
      });
      if (!error) {
        setLoading(true);
      }
    };

    useEffect(()=>{
      const photographerData = JSON.parse(data.photographerInfo).photographer
      setOrderInfo({
        conversationId : data.conversationId,
        date : data.date, 
        hour : data.hour,
        location : data.location,
        userId : data.userId,
        photographer : photographerData,
        chatId : data.chatId,
        personalIdInChat : data.personalIdInChat,
        timeStamp : data.timeStamp,
        photographerProfilePicture : JSON.parse(data.photographerProfilePicture),
        photographerId : data.photographerId
      })
      console.log("initializing the payment")
      InitiatePayment(parseInt(photographerData.price) * 100)
    },[])

    const openPaymentSheet = async () => {
      console.log("open payment")
      const { error } = await presentPaymentSheet();
  
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        router.replace("/payment/success")
      }
    };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{router.back()}}>        
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Confirm your proposition</Text>
      </View>

      {/* Payment Title */}
      <Text style={styles.boldText}>Payment informations</Text>

      <View style={styles.photographerInformation}>
        <View style={styles.leftSide}>
          <Text style={styles.shootingWith}>Shooting with:</Text>
          <Text style={styles.photographerName}>
            {orderInfo?.photographer.name + " " + orderInfo?.photographer.surname}
          </Text>
        </View>
        <Image source={{ uri: orderInfo?.photographerProfilePicture }} style={styles.photographerProfilePicture} />
      </View>

      {/* Payment Methods */}
      {/* <View style={styles.paymentMethods}>
        <View style={styles.paymentMethod}>
          {paymentInfo.cardNumber && getCardType(paymentInfo.cardNumber) == "visa" && <Image source={VisaLogo} style={styles.cardLogo} />        }
          {paymentInfo.cardNumber && getCardType(paymentInfo.cardNumber) == "amex" && <Image source={AmexLogo} style={styles.cardLogo} />        }
          {paymentInfo.cardNumber && getCardType(paymentInfo.cardNumber) == "mastercard" && <Image source={MastercardLogo} style={styles.cardLogo} />        }

          <Text style={styles.cardNumber}>{maskCreditCard(paymentInfo.cardNumber)}</Text>
        </View>
        <View>
          <TouchableOpacity 
            style={styles.addCardContainer} 
            onPress={() => router.push('/payment/carddetails')} // Navigate to CardDetails
          >
          <Text style={styles.addCardText}>Add a new card</Text>
        </TouchableOpacity>

        </View>
      </View> */}

      <View></View>

      {/* Shooting Details */}
      <View style={styles.shootingDetails}>
        <Text style={styles.detailsTitle}>Shooting details</Text>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={20} color="black" />
          <Text style={styles.detailText}>{orderInfo?.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={20} color="black" />
          <Text style={styles.detailText}>{orderInfo?.hour}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={20} color="black" />
          <Text style={styles.detailText}>{orderInfo?.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={22} color="black" />
          <Text style={styles.priceText}>{parseInt(orderInfo?.photographer.price)+"$"}</Text>
        </View>
       
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={openPaymentSheet}>
        <Text style={styles.payButtonText}>Pay</Text>
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
    marginTop : 70,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    textAlign : 'center',
    width: "80%",
    fontFamily: 'Satoshi',
    fontSize: 18,
    marginLeft: 10,
  },
  boldText: {
    marginTop : 40,
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    marginBottom: 20,
  },
  paymentMethods: {
    marginBottom: 30,
  },
  paymentButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth : 2,
    borderColor : "#EFEFEF"
  },
  paymentButtonText: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  paymentMethod : {
    padding : 20,
    marginVertical : 25,
    flexDirection : 'row',
    alignItems : 'center'
  },
  cardNumber : {
    fontSize : 18,
    fontFamily : 'Satoshi-Medium',
    marginLeft : 40,

  },
  cardField: {
    height: 50,
    marginVertical: 20,
  },
  shootingDetails: {
    marginTop : 80,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth : 2,
    borderColor : "#f0f0f0",
  },
  detailsTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceText : {
    fontSize: 14,
    marginLeft: 10,
    fontFamily : 'Satoshi-Bold'
  },
  detailText: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    marginLeft: 10,
  },
  payButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 200,
    alignItems: 'center',
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Required for Android
},
  payButtonText: {
    fontFamily: 'Satoshi',
    fontSize: 18,
    color: '#fff',
  },
  addCardContainer : {
    marginTop : 50,
    backgroundColor : '#f0f0f0',
    paddingHorizontal : 16,
    paddingVertical : 8
  },
  addCardText : {
    fontFamily : 'Satoshi-Medium',
    color : '#8B8787',
    textAlign : 'center',
  },
  cardLogo : {
    width:  60,
    height : 40,
    objectFit : 'contain',
  },
  photographerInformation: {
    flexDirection: 'row', // Aligns the content horizontally (left text + image on the right)
    alignItems: 'center', // Aligns items vertically
    justifyContent: 'space-between', // Space between the left side and right image
    padding: 20, // Padding around the container
  },
  leftSide: {
    flexDirection: 'column', // Arranges text vertically (Shooting with, name, surname)
    justifyContent: 'center', // Vertically centers the content in the left side
  },
  shootingWith: {
    fontFamily: 'Satoshi-Light', // Light weight font
    fontSize: 16,
    color: '#333', // A dark color for better readability
  },
  photographerName: {
    fontFamily: 'Satoshi-Medium', // Medium weight for the name
    fontSize: 20,
    color: '#000', // Black color for better emphasis
    marginTop: 5, // Adds a small space between the "Shooting with" and the name
  },
  photographerSurname: {
    fontFamily: 'Satoshi-Bold', // Bold weight for the surname
    fontSize: 20,
    color: '#000', // Black color for the surname
  },
  photographerProfilePicture: {
    width: 80, // Adjust size as needed
    height: 80, // Square image, you can adjust the size based on your design
    borderRadius: 10, // Rounded corners for the image
    marginLeft: 20, // Space between text and image
    objectFit: 'cover', // Ensures the image covers the space properly
  },
});

export default Payment;