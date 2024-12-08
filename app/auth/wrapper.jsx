import { StyleSheet, Text, View, Dimensions, Animated, Alert } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Login from './login';
import Signup from './signup';
import CompanyLogo from '../../components/elements/companyLogo';
import Button from './components/Button';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { t } from '../../localization'; // Your localization function
import { resetAuthState } from '../../store/authSlice';
import { resetChatState } from '../../store/chatSlice';
import { resetPhotographerState } from '../../store/photographerSlice';
import { loginSuccess, setToken } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangeLanguagePanel from '../../components/ChangeLanguagePanel';
import { getAuth, signInWithCustomToken, getIdToken } from 'firebase/auth';
import GoogleLogo from '../../assets/images/googlelogo.png';
import { useRouter } from 'expo-router';
import { jwtDecode } from "jwt-decode";

export const authPages = ["main", "login", "signup"];

const Wrapper = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Initialize dispatch
  const [currentPage, setPage] = useState(authPages[0]);

  // Initialize animated value for height
  const animatedHeight = useRef(new Animated.Value(Dimensions.get('window').height * 0.5)).current;
  const animateHeight = (toValue) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 200,  // Duration of animation (200ms)
      useNativeDriver: false,  // Native driver is false for layout animations
    }).start();
  };

  useEffect(() => {
    const targetHeight = currentPage === authPages[0]
      ? Dimensions.get('window').height * 0.5
      : Dimensions.get('window').height * 0.7;
    animateHeight(targetHeight);
  }, [currentPage]);  // Trigger the effect when currentPage changes

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve token from AsyncStorage

      if (token) {
        try {
          console.log("JWT Token:", token);
          const decodedToken = jwtDecode(token);
          console.log(decodedToken);
          const currentTime = Date.now() / 1000; // Get the current time in seconds
      
          // Check if the token's expiration is greater than the current time
          if (decodedToken.exp > currentTime) {
            // Token is still valid, dispatch the token
            dispatch(setToken(token));
            dispatch(loginSuccess());
            router.replace("/home");
          } else {
            // If the token is expired, do nothing and let the user log in again
            await AsyncStorage.setItem('userToken', "");
            console.log("Token has expired, user needs to log in again.");
            // Optionally, prompt the user to log in again
          }
        } catch (error) {
          console.error("Error decoding or validating token:", error);
        }
      } else {
        console.log("No token found, user will need to log in.");
      }
    };

    checkLoginStatus();

    // Reset auth state when component mounts
    dispatch(resetAuthState());
    dispatch(resetChatState());
    dispatch(resetPhotographerState());
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.logo}><CompanyLogo dark={false} size={40}/></View>
      <ChangeLanguagePanel />

      <Animated.View style={[styles.container, { height: animatedHeight }]}>
        {currentPage !== authPages[1] && currentPage !== authPages[2] && <>
          <View>
            <View style={styles.firstLineContainer}>
              <Button onPress={() => { setPage(authPages[1]) }} title={t('login')} dark={true} height={60} />
              <Button onPress={() => { setPage(authPages[2]) }} title={t('signup')} height={60} />
            </View>

            <View style={styles.secondLineContainer}>
              <View style={styles.line}></View>
              <Text>or Login with</Text>
              <View style={styles.line}></View>
            </View>
            <Button onPress={() => { }} title={'Continue with Google'} height={60} width={'100%'} icon={GoogleLogo} />
          </View>
        </>}
        {currentPage === authPages[1] && <Login setPage={setPage} />}
        {currentPage === authPages[2] && <Signup setPage={setPage} />}
        
      </Animated.View>
    </View>
  );
};

export default Wrapper;

const styles = StyleSheet.create({
  firstLineContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  secondLineContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 20,
    marginTop: 50,
    marginBottom: 50,
  },
  line: {
    width: 100,
    height: 1,
    backgroundColor: 'black',
  },
  logo: {
    position: 'absolute',
    top: 50,
    left: 30,
  },
  mainContainer: {
    minHeight: Dimensions.get('window').height,  // Minimum height of full screen
    justifyContent: 'flex-end',  // Content at the bottom
    backgroundColor: 'black',
  },
  container: {
    backgroundColor: '#f7f7f7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the language buttons
    marginTop: 20, // Add some space above
  },
});