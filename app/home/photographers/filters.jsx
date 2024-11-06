import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { t } from "../../../localization";
import OptionButton from './components/OptionButton';
import SearchZone from '../chat/SearchZone';
import { useRouter } from 'expo-router';
import { changeFilterExpertise, changeFilterType, setPhotographer} from '../../../store/photographerSlice';
import { useSelector, useDispatch } from 'react-redux';
import CompanyLogo from '../../../components/elements/companyLogo';
import { getNearestPhotographers } from '../../../services/getPhotographers/getnearest';
import { getUserLocation } from '../../../components/device/getUserLocation';

const Filters = () => {
  const [selectedType, setSelectedType] = useState('Portrait'); // Default type
  const [selectedExpertise, setSelectedExpertise] = useState('Amateur'); // Default expertise
  const [userPosition, setUserPosition] = useState("")

  const types = ['Event', 'Portrait', 'Instagram'];
  const expertise = ['Amateur', 'Professional'];

    
  const router = useRouter()
  const dispatch = useDispatch()


  const waitForPosition = async () => { 
    let data = await getUserLocation();
    return data;
  };
  
  useEffect(() => {
    const fetchPosition = async () => {
      const location = await waitForPosition();
      setUserPosition(location)
    };
  
    fetchPosition(); // Call the async function inside useEffect
  }, []);

  async function handleSubmit(){
        // request the BE
    console.log("submitting")
    try {
        const data = await getNearestPhotographers(userPosition, selectedType, selectedExpertise)
        console.log(data)
        dispatch(setPhotographer(data))
    } catch(e){
        console.error(e)
    }
    router.replace("/home/photographers")
        
  }

  return (
    <View style={styles.container}>
    <CompanyLogo dark={false} />

      <Text style={styles.heading}>{t('whatareyoulookingfor')}</Text>
      
      {/* Type Section */}
      <View style={styles.section}>
        {types.map((type) => (
          <OptionButton
            key={type}
            option={type}
            selected={selectedType === type}
            onPress={() => {
                setSelectedType(type);
                dispatch(changeFilterType(type))
            }}
            width="30%"  // Pass width as prop
          />
        ))}
      </View>

      {/* Expertise Section */}
      <View style={styles.section}>
        {expertise.map((level) => (
          <OptionButton
            key={level}
            option={level}
            selected={selectedExpertise === level}
            onPress={() => {
                setSelectedExpertise(level);
                dispatch(changeFilterExpertise(level))
            }}
            width="48.5%"  // Pass width as prop
          />
        ))}
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton}>
            <SearchZone  url='' isText={false} myFunc={handleSubmit}/>
      </TouchableOpacity>

    </View>
  );
};

export default Filters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  searchButton: {
    marginTop : 20,
    height : '20%',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 24,
  },
});
