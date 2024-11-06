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
import { fetchLastPropositionsWithResults } from '../../services/proposition/getLastPropositionsWithResults.js';
import LastShootingVisualisation from './chat/order/LastShootingVisualisation.jsx';

export default function Home() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const predefinedDat = [
    {
      conversation_id: "-OAHmRPeLQfnSjXG7mrW",
      date: "30/12",
      hour: "15:20",
      id: "uRfyDR0S7Ke7EuCnvl1W",
      isActive: false,
      isPaid: false,
      location: "11 rue du couvent, Erstein",
      p1_id: "YghK0bM6S8MWdbgeVxC5iP8FN7t2",
      p2_id: "sihnMxxOEIBNGmXFC6cl",
      price: "0",
      results: [
        "https://storage.googleapis.com/vedere-618d1.appspot.com/vedere/699db902-a6c5-4238-a639-acb0e5d08300.jpg?GoogleAccessId=firebase-adminsdk-py8pn%40vedere-618d1.iam.gserviceaccount.com&Expires=1735686000&Signature=qrVTqpdN6%2FFJRy%2B6HSzNv16SgZBJbuljZClIMscOvFfxNYxLMGsKeKeQVkLrJdxQnv6KwZJu9kP8Lkng6nIzaHyy20hTEk4bLNrc12VShCnW1v29F0gEXRkqtnhsQvsWyf%2Fyh3DymcGxRHIKNVB%2FjOkfQPScz77m%2FS66PRra9hgGFwEdw0v%2BPDgXInsjREXUWgOR6RDT7p%2FCFImNsp9UVem6OqHDJxil3ghwirTHyZwc1BTiCuvTICuwaNO6mNqPnzXM6jZbR4PNhPgZrYH%2B5m67zZr9WZrAck6jbhpjTEEfjp%2BR%2BOZLM6uyLdm%2BDUsgejS1QX3Xn%2BMww7cOfPE4CA%3D%3D"
      ],
      status: 1
    }
  ];
  
  // Create an array with 6 copies of the first element

  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [lastPropositions, setLastPropositions] = useState(predefinedDat);
  const [shownProposition, setShownProposition] = useState("")
 
  const handlePermissionGranted = () => {
    setLocationPermissionGranted(true);
  };

  const handleLastShootingClicked = (proposition) => {
    // Handle the image click event (e.g., navigate to another screen)
    console.log('Image clicked:', proposition);
    setShownProposition(proposition)
  };

  const maskShownShooting=()=>{
    setShownProposition("");
  }

  useEffect(()=>{
    handleFetchPropositions()
  },[])

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

  const handleFetchPropositions = async () => {
    try {
      const propositions = await fetchLastPropositionsWithResults(authState.token);
      setLastPropositions(propositions);
    } catch (error) {
      console.error('Error fetching last propositions:', error);
    }
  };

  if (authState.token == null || !authState.isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  const router = useRouter();

  return (
    <>
    {shownProposition && <LastShootingVisualisation proposition={shownProposition} onClose={maskShownShooting}/>}
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
        <Text style={styles.sectionTitle}>{t('LastShootings')}</Text>

        {/* Grid for Images */}
        <View style={styles.grid}>
          {lastPropositions.map((proposition, index) => (
            <TouchableOpacity key={index} onPress={() => handleLastShootingClicked(proposition)} style={styles.gridItem}>
              <Image
                source={{ uri: proposition.results[0] }}
                style={styles.image}
                resizeMode="cover"
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
    marginVertical: 20,
    padding: 30,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '49%', // Two images per row
    height: 100, // Adjust height as needed
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
