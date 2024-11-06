import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed
import { loadPhotographerDashboard } from '../../../../services/photographer/getOrders';
import { calculateTotalIncome, calculateLastIncomeForMonth } from '../../../../helpers/photographers/calculatePhotographerIncome';
import { setDisplayedOrder } from '../../../../store/photographerSlice';
import { useDispatch, useSelector } from 'react-redux';
import {t} from "../../../../localization"
import { useRouter } from 'expo-router';

const PhotographerDashboard = () => {

    const dispatch = useDispatch()
    const router = useRouter()
    const [data, setData] = useState([])
    const photographerState = useSelector((state)=>state.photographer)
    const loadDashboardInfo = async() => {
        try {
            const response = await loadPhotographerDashboard(photographerState.isPhotographer)
            setData(response)
        } catch(e){
            console.log("error : "+e)
        }
    }

    useEffect(()=>{
        loadDashboardInfo();
    },[])

  const handleEyeButtonClick = (projectId) => {
    console.log('Eye button clicked for project:', projectId);
    dispatch(setDisplayedOrder(projectId));
    router.push("/home/chat/order/orderVisualisation");
};

  return (
    <View style={styles.container}>
      <View style={styles.lastprojects}>
        <Text style={styles.headerTitle}>{t('lastprojects')}</Text>
        <View style={styles.projectContainer}>
        {Array.isArray(data) && data.length > 0 && data.map((project) => (
            <TouchableOpacity 
                key={project.id} 
                style={styles.projectBox} 
                onPress={() => handleEyeButtonClick(project.id)} // Trigger on press of the entire box
            >
                <Image source={{ uri: project.picUrl }} style={styles.projectImage} />
                <Text style={styles.projectName}>{project.location}</Text>
                <View style={styles.projectDetails}>
                    <Text style={styles.projectDate}>{project.date}</Text>
                    <Text style={styles.projectPrice}>{project.price}</Text>
                </View>
                <TouchableOpacity style={styles.eyeButton}>
                    <Ionicons name="eye-sharp" size={24} color="black" />
                </TouchableOpacity>
            </TouchableOpacity>
        ))}

        </View>
      </View>

      <View style={styles.incomes}>
        <Ionicons name="cash-outline" size={24} color="#D8FFB1" style={styles.icon} />
        <Text style={styles.incomesTitle}>{t('incomes')}</Text>
        <Text style={styles.totalIncome}>${Array.isArray(data) && data.length > 0?calculateTotalIncome(data):"0"}</Text>
        {/* <Text style={styles.lastMonthIncome}>{t('lastmonthincomes')} ${lastMonthIncome}</Text> */}
      </View>
    </View>
  );
};

export default PhotographerDashboard;

const styles = StyleSheet.create({
  projectContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  container: {
    paddingHorizontal: 20,
    gap : 5,
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'space-between', // Space between for equal distribution
    alignItems: 'flex-end', // Align items at the top
  },
  lastprojects: {
    width: "65%", // Set width for the last projects section
    height: 200, // Set height as specified
    backgroundColor: 'white', // Set background color to white
    padding: 10,
    borderWidth : 2,
    borderColor : 'black',
    borderRadius: 15, // Add border radius
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // Android shadow
  },
  incomes: {
    alignItems: 'center',
    width: "35%", // Set width for the incomes section
    height: 170, // Set height as specified
    backgroundColor: 'black', // Set background color to black
    padding: 10,
    borderRadius: 15, // Add border radius
    justifyContent: 'center', // Align content to the top
  },
  headerTitle: {
    fontFamily: 'Satoshi-Black',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  projectBox: {
    backgroundColor: '#F9F9F9', // Grey background for project boxes
    borderRadius: 15, // Add border radius
    padding: 0,
    marginVertical: 5,
    position: 'relative', // For positioning the eye button
    width: '40%',
    height: '60%',
    alignItems: 'center',
    // Add shadow effect
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Adjust for lighter shadow
    shadowRadius: 3, // Adjust for more or less blur
    elevation: 2, // Android shadow
  },
  projectImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15, // Make the image corners rounded
    position: 'absolute',
    opacity : 0.2,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Ensure the image is behind the text
  },
  projectName: {
    fontFamily: 'Satoshi-Bold',
    textAlign: "center",
    width: '100%',
    fontSize: 12,
    fontWeight: 'bold',
    position: 'absolute', // Position text over the image
    bottom: 40,
    zIndex: 1, // Ensure text is on top
    color: 'black', // Change text color for better visibility
  },
  projectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 1, // Ensure details are on top
  },
  projectDate: {
    fontSize: 10,
    fontFamily: 'Satoshi-Medium',
    color: '#333',
  },
  projectPrice: {
    fontSize: 10,
    fontFamily: 'Satoshi-Medium',
    color: '#333',
  },
  eyeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: 200,
  },
  incomesTitle: {
    fontSize: 18,
    color: '#F6F6F6',
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Satoshi-Light',
  },
  totalIncome: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Satoshi-Black',
  },
  lastMonthIncome: {
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    fontSize: 12,
    maxWidth: '80%',
    color: '#949494',
    marginTop: 10,
  },
  icon: {
    position: 'absolute', // Position the icon at the top left
    top: 10,
    right: 10,
    opacity: 0.45,
    transform: [{ rotate: '30deg' }], // Apply rotation here
  },
});
