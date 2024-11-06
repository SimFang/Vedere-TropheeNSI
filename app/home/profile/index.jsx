import { StyleSheet, Text, View, Image, Dimensions, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/elements/header';
import { useRouter, Redirect } from 'expo-router';
import Note from '../../../components/elements/note';
import ProfilePicture from '../../../components/elements/profilePic';
import { useSelector } from 'react-redux';
import { fetchUserInfo } from '../../../services/getUserInfoByTokenRequest';
import Carousel from 'react-native-reanimated-carousel';
import DottedButton from '../../../components/button/dottedButton';
import {t} from '../../../localization'

const ProfilePage = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const photographerState = useSelector((state)=>state.photographer)
  
  const [lastpictures, setLastPictures] = useState([])
  const [user, setUser] = useState("")
  const width = Dimensions.get('window').width; // Get device width

  const onUpload = (newImageUri) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_picture: newImageUri, // Update the profile picture URI
    }));
  };

  useEffect(() => {
    const waitForUserInfo = async () => {
      const data = await fetchUserInfo(authState.token);
      console.log(data); // Log the fetched user info
      setUser(data);
      return data; // You can return data if needed
    };
  
    // Call the async function
    waitForUserInfo()
  }, [authState.token]);

  if (photographerState.isPhotographer) {
    return <Redirect href="/home/profile/photographerProfile/photographerProfile" />;
  }

  return (
    <View style={styles.container}>
      <Header>
        <Ionicons
          name="settings-sharp"
          size={24}
          color={"black"}
          onPress={() => { router.push('/home/profile/settings') }}
        />
      </Header>
      <View style={styles.top}>
        <View style={styles.left}>
          <Text style={styles.title}>{user?.name+" "+user?.surname}</Text>
          <Note note={user?.note} />
        </View>
        <View style={styles.right}>
        <ProfilePicture size={100} img={user?.profile_picture} modificationId={user?.userId} onUpload={onUpload} />
        </View>
      </View>
      <View style={styles.line} />
      {lastpictures.length > 0 ? (
        <Carousel
          loop
          width={width}
          height={width / 2}
          autoPlay={true}
          data={lastpictures}
          scrollAnimationDuration={1000}
          renderItem={({ index }) => (
            <View style={styles.carouselItem}>
              <Image
                style={styles.lastpic}
                source={{ uri: lastpictures[index] }}
              />
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noShootingsText, { height: width / 2 }]}>{t('noShootingsMessage')}</Text>
      )}
      <View style={styles.dottedButtonContainer}><DottedButton title={t('wannabecomephotographer')} width={300} onPress={()=>{
          router.replace('home/profile/photographerform/firstpage')
        }}/></View>
    </View>
  );
}

export default ProfilePage;

const styles = StyleSheet.create({
  dottedButtonContainer : {
      height : '20%',
      width : "100%",
      alignItems : 'center',
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 0,
    justifyContent: 'flex-start',
  },
  top: {
    padding: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,

  },
  left: {
    maxWidth : '70%',
    gap : 20,
  },
  right: {},
  title: {
    fontSize: 35,
    fontFamily: 'Satoshi-Black',
  },
  note: {
    padding: 20,
    backgroundColor: 'lightgrey',
    fontFamily: 'Satoshi-Regular',
  },
  profilepicture: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
  },
  line: {
    marginHorizontal: 20,
    height: 1,
    backgroundColor: 'lightgrey',
    width: "100%",
    marginVertical: 10,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastpic: {
    width: '20%', // Set width to full
    height: '100%', // Set height to full
    borderRadius: 10, // Optional: Add rounded corners
  },
  noShootingsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
    marginTop: 20,
    fontFamily: 'Satoshi-Regular',
  },
});
