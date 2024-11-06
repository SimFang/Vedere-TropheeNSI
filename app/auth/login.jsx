import { StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {  loginSuccess, setToken } from '../../store/authSlice'; // Adjust the path as needed
import InputField from './components/InputField';
import Button from './components/Button';
import { useRouter } from 'expo-router';
import { authPages } from './wrapper';
import {t} from '../../localization'
import { loginAPIRequest } from '../../services/loginRequest';


const Login = ({setPage=()=>{}}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router= useRouter()

  const handleLogin = async () => {
    console.log()
    if (!email || !password) {
      return;
    }

    try {
      // Simulate an API call to log in
      
      const data = await loginAPIRequest(email, password)// Mock user data; replace with your API logic
      console.log(data.token);
      dispatch(setToken(data.token))
      dispatch(loginSuccess())
      router.replace("/home")

    } catch (error) {
      console.log("logging erro")
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>
      
      <View style={styles.inputs}>
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
        <Button title={t('login')} onPress={handleLogin} dark={true} width='60%' height={60}/>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('donthaveanaccount')} <Text style={styles.linkText} onPress={()=>{setPage(authPages[2])}}>{t('signup')}</Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  center : {
    display : 'flex',
    width : '100%',
    alignItems : 'center'
  },
  inputs : {
    marginTop : 50,
    marginBottom : 40,
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
