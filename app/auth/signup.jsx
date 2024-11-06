import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setSignUpData, clearSignUpData } from '../../store/authSlice'; // Adjust the path as needed
import InputField from './components/InputField';
import Button from './components/Button';
import {t} from '../../localization'
import { authPages } from './wrapper';
import { signupAPIRequest } from '../../services/signupRequest';
import { useRouter } from 'expo-router';

const Signup = ({setPage = ()=>{}}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [username, setUsername] = useState('')
  const [surname, setSurname] = useState('')

  const router = useRouter();

  const handlesignup = async () => {
    if (!email || !password || !username|| !surname) {
      Alert.alert('Please enter both email and password.');
      return;
    }
    if(password.length < 6){
      Alert.alert(t('yourpasswordmustbe6caracterslong'));
      return;
    }

    try {
      dispatch(setSignUpData({email : email, password : password, name : username, surname : surname}))
      console.log({email : email, password : password, name : username, surname : surname})
      router.push("auth/emailverification")
    } catch (error) {
      Alert.alert('signup failed. Please try again.');
    }
  };

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>{t('signup')}</Text>
      
      <View style={styles.inputs}>
      <InputField
          placeholder={t('name')}
          value={username}
          onChangeText={setUsername}
        />
        <InputField
          placeholder={t('surname')}
          value={surname}
          onChangeText={setSurname}
        />
        <InputField
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputField
          placeholder={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.line}></View>
      <View style={styles.center}>      
        <Button title={t('signup')} onPress={handlesignup} dark={true} width='60%' height={60}/>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account ? <Text style={styles.linkText} onPress={()=>{setPage(authPages[1])}}>{t('login')}</Text>
        </Text>
      </View>
    </View>
    </>
  );
};

export default Signup;

const styles = StyleSheet.create({
  center : {
    display : 'flex',
    width : '100%',
    alignItems : 'center'
  },
  inputs : {
    marginTop : 10,
    marginBottom : 30,
  },
  container: {
    fontFamily : 'Satoshi-Bold',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  line : {
    opacity : 0.1,
    backgroundColor : 'black',
    height : 1,
    width : '100%',
    marginBottom : 40
  },
  title: {
    fontFamily : 'Satoshi-Bold',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
