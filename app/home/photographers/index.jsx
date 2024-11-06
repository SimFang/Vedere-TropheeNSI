import React, { useEffect, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import Photographer from './photographer';
import { useSelector, useDispatch } from 'react-redux';
import { getNearestPhotographers } from '../../../services/getPhotographers/getnearest';
import { getUserLocation } from '../../../components/device/getUserLocation';
import { setPhotographer } from '../../../store/photographerSlice';
import FooterMessage from './components/FooterMessage';

const { height } = Dimensions.get('window');

const PhotographerScroll = () => {
    const photographersState = useSelector((state) => state.photographer.photographers);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true); // State to track loading status

    const waitForPosition = async () => { 
        let data = await getUserLocation();
        return data;
    };

    useEffect(() => {
        const fetchPositionAndPhotographers = async () => {
            try {
                // Get user's current position
                const location = await waitForPosition();

                // Fetch photographers if there are fewer than 1 in the state
                if (photographersState.length <= 1) {
                    const data = await getNearestPhotographers(location, "", "");
                
                    // Combine photographersState and data, ensuring photographersState comes first
                    const mergedList = [
                        ...photographersState, // Always keep photographersState first
                        ...data.filter((newPhotographer) => 
                            !photographersState.some(
                                (existingPhotographer) => existingPhotographer.id === newPhotographer.id
                            )
                        ) // Filter out duplicates based on the 'id'
                    ];
                
                    console.log(mergedList);
                    dispatch(setPhotographer(mergedList)); // Dispatch the merged list to update the store
                }
            } catch (error) {
                console.error("Error fetching photographers or position:", error);
            } finally {
                setLoading(false); // Set loading to false once the data is fetched
            }
        };

        fetchPositionAndPhotographers(); // Call the async function inside useEffect

    }, []); // Add dependencies for state and dispatch

    const renderItem = ({ item }) => (
        <View style={styles.pageContainer}>
            <Photographer photographer={item} />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        ); // Loading screen
    }

    return (
        <FlatList
            data={photographersState}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            snapToAlignment="start"
            ListFooterComponent={FooterMessage} // Use the FooterComponent as the footer
        />
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        height: height * 0.93, // Full-screen height for each page
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', // Black background
    },
});

export default PhotographerScroll;
