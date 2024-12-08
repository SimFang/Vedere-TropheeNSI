import { StyleSheet, Text, View, TextInput, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, useRouter } from 'expo-router';
import CompanyLogo from '../../components/elements/companyLogo';
import { t } from "../../localization"
import Button from './components/Button';
import { sendEmailVerificationAPIRequest } from '../../services/emailVerificationRequest';
import { loginAPIRequest } from '../../services/loginRequest';
import { useDispatch, useSelector } from 'react-redux';
import { clearSignUpData, loginSuccess, setToken } from '../../store/authSlice';
import { signupAPIRequest } from '../../services/signupRequest';

const EmailVerification = ({email, password}) => {
    const [secretCode, setSecret] = useState("")
  const [code, setCode] = useState(['', '', '', '', '', '']); // State to hold 6 digits
  const authState = useSelector((state)=>state.auth)

const router = useRouter();
  const dispatch = useDispatch()
  // Function to handle input changes
  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    if (value && index < 5) {
      inputs[index + 1].focus();
    }
    if (!value && index > 0) {
      inputs[index - 1].focus();
    }
    setCode(newCode);
  };

  const inputs = [];

  const sendEmail = async()=> {
    try {
        let data = await sendEmailVerificationAPIRequest(authState.signUpData.email);
        console.log(data)
        setSecret(data.verificationCode)
    } catch(e){
        console.log("An error happened sending the email: "+e)
    }
  }

  useEffect(()=>{
    sendEmail()
  },[])

  useEffect(()=>{
    console.log(authState.signUpData)
    //sendEmail()
    checkCode()
  },[code])

  const checkCode = async() => {
    // Join the entered code array into a string
    const enteredCode = code.join('');
    if(!enteredCode || enteredCode == "") return;
    console.log("check code")
    if (enteredCode === secretCode && secretCode !== null) {
        console.log("correct code")

        try {
            await signupAPIRequest(authState.signUpData.email, authState.signUpData.password, authState.signUpData.name, authState.signUpData.surname) // Mock user data; replace with your API logic       
            try {
                let data = await loginAPIRequest(authState.signUpData.email, authState.signUpData.password);
                dispatch(setToken(data.token))
                dispatch(loginSuccess())
                dispatch(clearSignUpData())
                router.replace("/home")
            } catch(e){
                console.log(e)
            }
        } catch(e){
            console.log(e)
        }
    } else {
      if(enteredCode.length == 6) Alert.alert("Error", t('codedoesntmatch'));
    }
  };

  if(authState.signUpData == null ){
    return <Redirect href="/auth"/>
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logo}><CompanyLogo dark={false} size={40} /></View>
      <View style={styles.container}>
        <Text style={styles.title}>{t('emailVerification')}</Text>
        <View style={styles.center}>
          <Text style={styles.desc}>
            {t('wevesentaverificationemailto')} <Text style={{ fontWeight: 'bold' }}>{authState.signUpData !== null ? authState.signUpData.email : ""}</Text>. {t('tocompletethesignup')}
          </Text>
          {/* Code input fields */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                keyboardType="numeric"
                maxLength={1} // Limit input to 1 character
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                ref={(input) => { inputs[index] = input }} // Store ref for auto-focus
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                    inputs[index - 1].focus(); // Move back on delete
                  }
                }}
              />
            ))}
          </View>
          <Button title={t('sendcode')} width='80%'onPress={()=>{sendEmail()}}/>
          <Button title={t('confirm')} width='80%' dark={true} onPress={()=>{checkCode()}}/>
        </View>
      </View>
    </View>
  );
}

export default EmailVerification

const styles = StyleSheet.create({
  center: {
    width: "100%",
    display: 'flex',
    alignItems: "center",
  },
  desc: {
    width: "80%",
    fontSize: 18,
    fontFamily: 'Satoshi-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    position: 'absolute',
    top: 50,
    left: 30,
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  mainContainer: {
    minHeight: Dimensions.get('window').height,  // Minimum height of full screen
    justifyContent: 'flex-end',  // Content at the bottom
    backgroundColor: 'black',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: Dimensions.get('window').height * 0.6,  // Minimum height of full screen
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
    marginBottom : 60,
  },
  codeInput: {
    borderWidth: 1,
    backgroundColor : "#EDEDED",
    borderColor: '#EDEDED',
    borderRadius: 5,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 20,
  },
});
