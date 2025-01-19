import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { usePayment } from './PaymentContext';
import { sendPropositionToConversation } from '../../services/chat/sendPropositionToConversation';
import { updatePropositionStatusInChat } from '../../services/chat/updatePropositionStatus';
import { createProposition } from '../../services/chat/createProposition';

const PaymentSuccesful = () => {
  const router = useRouter();
  const {orderInfo} = usePayment()

  const handleConfirm = async()=>{
     // create the proposition
     await updatePropositionStatusInChat(orderInfo.conversationId, orderInfo.personalIdInChat, 1, orderInfo.timeStamp )   
     await createProposition(
       orderInfo.chatId,
       orderInfo.date,
       orderInfo.hour,
       orderInfo.location,
       true,
       false,
       orderInfo.userId,
       orderInfo.photographerId,
       orderInfo.photographer.price,
       1
     );     
     console.log("succesfully created") 
     router.push('/home/chat')
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Text style={styles.checkMark}>✔</Text>
        </View>
        <Text style={styles.headerTitle}>Payment Successful</Text>
        <Text style={styles.headerSubtitle}> {`Successfully paid ${orderInfo?.photographer.price}$`}
        </Text>
      </View>

      {/* Payment Information */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Transaction ID</Text>
          <Text style={styles.value}>4512 2151 3250</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Type of Transaction</Text>
          <Text style={styles.value}>Credit Card</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nominal</Text>
          <Text style={styles.value}>{orderInfo?.photographer.price + '$'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>TVA</Text>
          <Text style={styles.value}>{orderInfo?.photographer.price * 0.15 + '$'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.valueSuccess}>Success</Text>
        </View>
      </View>

      {/* Shooting Proposition */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Shooting Proposition</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>📍</Text>
          <Text style={styles.value}>{orderInfo?.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>⏰</Text>
          <Text style={styles.value}>{orderInfo?.hour}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>📅</Text>
          <Text style={styles.value}>{orderInfo?.date}</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm} // Replace with your next route
      >
        <Text style={styles.confirmButtonText}>Validate the proposition</Text>
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
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    backgroundColor: '#E8F7EC',
    borderRadius: 50,
    padding: 20,
    marginBottom: 10,
  },
  checkMark: {
    fontSize: 24,
    color: '#4CAF50',
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    color: '#333',
  },
  headerSubtitle: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    color: '#555',
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: '#333',
  },
  valueSuccess: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: '#4CAF50',
  },
  confirmButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default PaymentSuccesful;