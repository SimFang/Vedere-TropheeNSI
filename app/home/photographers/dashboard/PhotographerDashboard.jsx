import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, RefreshControlComponent } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed
import { loadPhotographerDashboard } from '../../../../services/photographer/getOrders';
import { calculateTotalIncome } from '../../../../helpers/photographers/calculatePhotographerIncome';
import { setDisplayedOrder } from '../../../../store/photographerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { t } from "../../../../localization";
import { useRouter } from 'expo-router';

const PhotographerDashboard = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [data, setData] = useState([]);
    const photographerState = useSelector((state) => state.photographer);

    const loadDashboardInfo = async () => {
        try {
            const response = await loadPhotographerDashboard(photographerState.isPhotographer);
            console.log("photographer dashboard data : ")
            console.log(response)
            setData(response);
        } catch (e) {
            console.log("error : " + e);
        }
    };

    useEffect(() => {
        loadDashboardInfo();
    }, []);

    const handleEyeButtonClick = (projectId) => {
        console.log('Eye button clicked for project:', projectId);
        dispatch(setDisplayedOrder(projectId));
        router.push("/home/chat/order/orderVisualisation");
    };

    return (
        <View style={styles.container}>
            <View style={styles.lastprojects}>
                <Text style={styles.headerTitle}>{t('lastprojects')}</Text>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.projectContainer}
                    showsHorizontalScrollIndicator={false} // Optionally hide the scrollbar
                >
                    {Array.isArray(data) && data.length > 0 && data.map((project) => (
                        <TouchableOpacity
                            key={project.id}
                            style={styles.projectBox}
                            onPress={() => handleEyeButtonClick(project.id)} // Trigger on press of the entire box
                        >
                            <Image source={{ uri: project.client.profile_picture }} style={styles.projectImage} />
                            <View style={styles.projectDetails}>
                                <Text style={styles.projectPrice}>{}</Text>
                            </View>
                            <TouchableOpacity style={styles.eyeButton}>
                                <Ionicons name="eye-sharp" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.projectName}>{project.client.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.incomes}>
                <Ionicons name="cash-outline" size={24} color="#D8FFB1" style={styles.icon} />
                <Text style={styles.incomesTitle}>{t('incomes')}</Text>
                <Text style={styles.totalIncome}>${Array.isArray(data) && data.length > 0 ? calculateTotalIncome(data) : "0"}</Text>
                {/* <Text style={styles.lastMonthIncome}>{t('lastmonthincomes')} ${lastMonthIncome}</Text> */}
            </View>
        </View>
    );
};

export default PhotographerDashboard;

const styles = StyleSheet.create({
    projectContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center', // Ensure items are centered vertically
    },
    container: {
        paddingHorizontal: 10,
        gap : 10,
        flexDirection: 'row', // Align children horizontally
        justifyContent: 'center', // Space between for equal distribution
        alignItems: 'center', // Align items at the top
    },
    lastprojects: {
        width: "60%", // Set width for the last projects section
        height: 170, // Set height as specified
        backgroundColor: 'white', // Set background color to white
        padding: 10,
        borderWidth: 0,
        borderColor: 'black',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        borderRadius: 10, // Add border radius
        shadowOpacity: 0.10,
        shadowRadius: 2,
        elevation: 5, // Android shadow
    },
    incomes: {
        alignItems: 'center',
        width: "35%", // Set width for the incomes section
        height: 170, // Set height as specified
        backgroundColor: 'black', // Set background color to black
        padding: 10,
        borderRadius: 10, // Add border radius
        justifyContent: 'center', // Align content to the top
    },
    headerTitle: {
        fontFamily: 'Satoshi-Normal',
        fontSize: 18,
        marginBottom: 10,
        color : 'grey',
        textAlign: 'center',
    },
    projectBox: {
        marginVertical: 5,
        position: 'relative', // For positioning the eye button
        width: "auto", // Set width to prevent overflow and maintain scrollability
        height: "auto",
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
        borderWidth : 4,
        borderColor : "white",
        width: 70,
        height: 70,
        borderRadius: 100, // Make the image corners rounded
        opacity: 1,
        zIndex: 0, // Ensure the image is behind the text
    },
    projectName: {
        fontFamily: 'Satoshi-Medium',
        textAlign: "center",
        paddingTop : 5,
        width: '100%',
        fontSize: 13,
        zIndex: 1, // Ensure text is on top
        color: 'grey', // Change text color for better visibility
    },
    projectDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        zIndex: 1, // Ensure details are on top
    },
    projectDate: {
        fontSize: 10,
        fontFamily: 'Satoshi-Medium',
        color: '#fff',
    },
    projectPrice: {
        fontSize: 10,
        fontFamily: 'Satoshi-Medium',
        color: '#fff',
    },
    eyeButton: {
        display : "none",
        position: 'absolute',
        top: 0,
        right: 0,
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