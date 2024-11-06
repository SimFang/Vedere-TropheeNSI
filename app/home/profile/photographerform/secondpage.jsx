import { StyleSheet, Text, View, Dimensions, Animated, Alert } from 'react-native';
import { useState } from 'react';
import CompanyLogo from '../../../../components/elements/companyLogo';
import Button from '../../../auth/components/Button';
import InputField from '../../../auth/components/InputField';
import { t } from '../../../../localization';
import GalleryPicker from '../../../../components/elements/gallerypicker';
import requestPhotographer from '../../../../services/requestPhotographer';
import { validateAddressOrCity } from '../../../../services/location/validateAdressOrCity';
import DottedButton from '../../../../components/button/dottedButton';
import { useRouter } from 'expo-router';

const FirstPage = () => {
  // States for form fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [images, setImages] = useState([])

    const router = useRouter()

  const handleSubmit = async () => {
            router.replace("/home/profile")
    };


  return (
    <View style={styles.mainContainer}>
      <View style={styles.logo}><CompanyLogo dark={false} size={40} /></View>
      <Animated.ScrollView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>{t('jointhecreation')}</Text>
          <Text style={styles.description}>{t('photographerformparagraph')}</Text>
        </View>

       

        {/* Submit button */}
        <DottedButton onPress={handleSubmit} title={t('Iaccept')} width={'100%'} dark={true}/>
      </Animated.ScrollView>
    </View>
  );
};

export default FirstPage;

const styles = StyleSheet.create({
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
    padding : 15,
    fontSize: 15,
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
  mainContainer: {
    minHeight: Dimensions.get('window').height,
    justifyContent: 'flex-end',
    backgroundColor: '#C16A6A',
  },
  container: {
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
});
