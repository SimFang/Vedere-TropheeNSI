import { StyleSheet, Text, View, Dimensions, Animated, Alert, ScrollView, Switch, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import CompanyLogo from '../../../../components/elements/companyLogo';
import Button from '../../../auth/components/Button';
import InputField from '../../../auth/components/InputField';
import { t } from '../../../../localization';
import requestPhotographer from '../../../../services/requestPhotographer';
import { validateAddressOrCity } from '../../../../services/location/validateAdressOrCity';
import { fetchUserInfo } from '../../../../services/getUserInfoByTokenRequest';
import { useSelector } from 'react-redux';
import Loading from './loading';
import { useRouter } from 'expo-router';
import validateData from '../../../../helpers/photographerFormula/validateData';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import DottedButton from "../../../../components/button/dottedButton"
import { Ionicons } from '@expo/vector-icons'; // or from 'react-ionicons' if you're using that package

const FirstPage = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); // State for selected images
  const [isProfessional, setIsProfessional] = useState(false);
  const [price, setPrice] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false)

  const quitPage = () => {
    setLoading(false);
    setName('');
    setSurname('');
    setDescription('');
    setAge('');
    setState('');
    setLocation('');
    setPhoneNumber('');
    setSelectedImages([]); // Reset selected images
    setIsProfessional(false);
    setPrice(0);
    setSubmitLoading(false); // Reset submit loading
    router.replace('/home/profile');
  };

  // Function to open image picker
  const pickImages = async () => {
    console.log("Already selected images", selectedImages);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      selectionLimit: 0, // Unlimited selection
    });

    if (!result.canceled) {
      const images = result.assets.map(asset => asset.uri); // Map the selected assets to their URIs
      console.log(images);
      setSelectedImages(prevImages => [...prevImages, ...images]); // Save the image URIs
    }
  };

  // Helper function for real-time validation
  const validateTextInput = (text, type) => {
    if (type === 'string') {
      const lettersOnly = text.replace(/[^a-zA-Z\s]/g, '');
      return lettersOnly;
    } else if (type === 'number') {
      const numbersOnly = text.replace(/[^0-9]/g, '');
      return numbersOnly;
    }
    return text;
  };

  // Placeholder function to validate location
  const validateLocation = async (location) => {
    if(location.length < 3){
      return false
    }
    const data = await validateAddressOrCity(location);
    console.log(data)
    return data;
  };

  const handleSubmit = async () => {
    console.log("submitted");
    setLoading(true);
    setSubmitLoading(true)

    if (!(await validateLocation(location))) {
      console.log("invalid location");
      Alert.alert(t('invalidlocation'), t('pleaseentervalidlocation'));
      setLoading(false)
      setSubmitLoading(false)
      return;
    }

    const data = await fetchUserInfo(authState.token);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('description', description);
    formData.append('age', age);
    formData.append('state', state);
    formData.append('operationLocation', location);
    formData.append('phoneNumber', phoneNumber);
    formData.append('userId', data.userId);
    formData.append('isProfessional', isProfessional); // Add professional status
    formData.append('price', price); // Add price

    if (selectedImages.length === 0) {
      Alert.alert("No images selected", "Please select images first");
      setLoading(false)
      setSubmitLoading(false)
      return;
    }

    selectedImages.forEach((imageUri, index) => {
      formData.append('images', {
        uri: imageUri,
        name: `photo_${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      console.log("requesting the backend");
      await requestPhotographer(formData);
      router.replace('home/profile/photographerform/secondpage');
    } catch (error) {
      Alert.alert('Submission Error', error.message);
    } finally {
      setLoading(false);
    }
    setLoading(false)
    setSubmitLoading(false)
  };

  return (
    <>
      {loading && <Loading />}
      <View style={styles.mainContainer}>
        <View style={styles.logo}><CompanyLogo dark={false} size={40} /></View>
        <TouchableOpacity style={styles.quitButton} onPress={() => quitPage()}>
        <Ionicons name="chevron-back" size={30} color="white" />
      </TouchableOpacity>
        <Animated.ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.center}>
            <Text style={styles.title}>{t('jointhecreation')}</Text>
            <Text style={styles.description}>{t('descriptiontextforphotographerform')}</Text>
          </View>

          <View style={styles.inputRow}>
            <InputField
              placeholder={t('name')}
              value={name}
              onChangeText={setName}
              width="48%"
              rounded={false}
            />
            <InputField
              placeholder={t('surname')}
              value={surname}
              onChangeText={setSurname}
              width="48%"
              rounded={false}
            />
          </View>

          <InputField
            placeholder={t('describe')}
            value={description}
            onChangeText={setDescription}
            width="100%"
            rounded={false}
          />

          <View style={styles.inputRow}>
            <InputField
              placeholder={t('age')}
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              width="48%"
              rounded={false}
            />
            <InputField
              placeholder={t('state')}
              value={state}
              onChangeText={setState}
              width="48%"
              rounded={false}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScrollContainer}>
            {selectedImages.map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <DottedButton title="Pick Images" onPress={pickImages} />
          </View>
          <InputField
            placeholder={t('location')}
            value={location}
            onChangeText={setLocation}
            width="100%"
            rounded={false}
          />
          <InputField
            placeholder={t('phonenumber')}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            width="100%"
            rounded={false}
          />

          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>{t('areyouaprofessional')}</Text>
            <Switch
              value={isProfessional}
              onValueChange={setIsProfessional}
              thumbColor={isProfessional ? '#22223b' : '#f4f3f4'}
              trackColor={{ false: '#9a8c98', true: '#4a4e69' }}
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{t('selectPrice')}: {"$" + price}</Text>
            <InputField
              keyboardType="numeric"
              value={String(price)}
              onChangeText={(text) => setPrice(validateTextInput(text, 'number'))}
              width="100%"
              rounded={false}
            />
          </View>

          <Button onPress={handleSubmit} title={t('Sendrequest')} height={60} width={'100%'} dark={true} loading={submitLoading}/>
          <View style={styles.block}></View>
        </Animated.ScrollView>
      </View>
    </>
  );
};

export default FirstPage;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10, // Set padding to 10
    alignItems: 'center', // Center the button horizontally (optional)
  },
  imageScrollContainer: {
    paddingVertical: 10, // Add some vertical padding
  },
  imagePreview: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginHorizontal: 5, // Add some horizontal spacing between images
    borderRadius: 10,
  },
  center: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginVertical: 20,
    fontSize: 25,
    fontFamily: 'Satoshi-Bold',
  },
  description: {
    marginVertical: 20,
    fontSize: 12,
    color: '#969696',
    fontFamily: 'Satoshi-Regular',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  logo: {
    position: 'absolute',
    top: 50,
    left: 30,
  },
  quitButton : {
    position: 'absolute',
    top: 50,
    right: 30,
  },
  mainContainer: {
    justifyContent: 'flex-end',
    backgroundColor: '#C16A6A',
  },
  container: {
    height: 1000,
    marginTop: 200,
    paddingTop: 30,
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  block: {
    height: 300,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
  },
  sliderContainer: {
    marginVertical: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  sliderInput: {
    marginVertical: 10,
  },
  sliderText: {
    fontSize: 14,
    color: '#969696',
  },
});
