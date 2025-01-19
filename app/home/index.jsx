import { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CompanyLogo from '../../components/elements/companyLogo';
import SearchZone from './chat/SearchZone';
import { setIsPhotgrapher } from '../../store/photographerSlice';
import { checkPhotographer } from '../../services/checkPhotographer';
import { fetchUserInfo } from '../../services/getUserInfoByTokenRequest';
import { t } from "../../localization";
import AppTutorial from '../../components/tutorial/AppTutorial.jsx';
import { getNearestPhotographers } from '../../services/getPhotographers/getnearest.js';
import { getUserLocation } from '../../components/device/getUserLocation.js';
import { setPhotographer } from '../../store/photographerSlice';
import PhotographerPage from '../../components/homepage/PhotographerPage.jsx';

export default function Home() {
  const authState = useSelector((state) => state.auth);
  const photographersState = useSelector((state) => state.photographer.photographers);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State to track loading status
  const [showPhotographer, setShowPhotographer] = useState("");

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
                console.log("Home page photographers")
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

  useEffect(() => {
    const checkIfUserIsPhotographer = async () => {
      try {
        const userInfo = await fetchUserInfo(authState.token);
        const data = await checkPhotographer(userInfo.userId);
        console.log("is a photographer : " + data);
        dispatch(setIsPhotgrapher(data));
      } catch (error) {
        console.error("Error fetching photographer status:", error);
      }
    };

    checkIfUserIsPhotographer();
  }, [authState.token]);

  if (authState.token == null || !authState.isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  const router = useRouter();

  return (
    <>

    <AppTutorial/>
    {showPhotographer && <PhotographerPage photographer={showPhotographer} close={()=>{setShowPhotographer("")}}/>}
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CompanyLogo size={30} />
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color={"black"} onPress={() => { router.replace('/home/chat/') }} />
        </View>
      </View>

      <SearchZone />

      {/* Photographers Section */}
      <View style={styles.photographersSection}>
        <Text style={styles.mainText}>Photographers in your area</Text>
        {/* Grid for Images */}
        <View style={styles.grid}>
          {photographersState.map((photographer) => (
            <TouchableOpacity
              key={photographer.id}
              style={styles.gridItem}
              onPress={() => setShowPhotographer(photographer)} // Navigate to photographer's details
            >
              {/* Display the first image from photographer's work */}
              <Image
                source={{ uri: photographer.work[0] }} // Assuming photographer.work is an array of image URIs
                style={styles.image}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Satoshi-Black',
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 60,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  photographersSection: {
    marginVertical: 0,
    padding: 30,
  },
  mainText: {
    fontFamily: 'Satoshi-Black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '49%', // Two images per row
    height: 200, // Adjust height as needed
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom : 5,
  },
  fetchButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: '100%', // Make the image fill the container
    height: '100%', // Make the image fill the container
    borderRadius: 15,
  },
});