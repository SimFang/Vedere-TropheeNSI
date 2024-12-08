import { StyleSheet, Text, View, Image, Dimensions, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../components/elements/header';
import { useRouter } from 'expo-router';
import Note from '../../../../components/elements/note';
import { useSelector } from 'react-redux';
import DottedButton from '../../../../components/button/dottedButton';
import { t } from "../../../../localization";
import ProfilePicture from '../../../../components/elements/profilePic';
import { fetchPhotographerById } from '../../../../services/getPhotographers/getPhotographerById';
import ModifyInfoPopup from './modifyInfoPopup';
import { modifyPhotographerDescription, modifyPhotographerPrice, modifyPhotographerOperationLocation, modifyPhotographerState } from '../../../../services/photographer/updatePhotographerInfo';
import { validateAddressOrCity } from '../../../../services/location/validateAdressOrCity';
import EditWorkPage from './editWorkPage';

const ProfilePage = () => {

  const photographerState= useSelector((state)=>state.photographer)
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const width = Dimensions.get('window').width; // Get device width

  const [editingSection, setEditingSection] = useState(null)
  const [editingInitialValue, setEditingInitialValue] = useState('')

  const [showEditWorkPage, setShowEditWorkPage] = useState(false); // New state to control visibility
  const [workImages, setWorkImages] = useState([]);
  
  const [user, setUser] = useState(null)

  const handleEdit = (field, value) => {
    setEditingSection(field);
    setEditingInitialValue(value);
  };

  const handleClose = () => {
    setEditingInitialValue(null)
    setEditingSection(null)
  }

  const onUpload = (newImageUri) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_picture: newImageUri, // Update the profile picture URI
    }));
  };


  // Function to handle showing EditWorkPage
  const handleEditWork = (initialImages) => {
    setWorkImages(initialImages);
    setShowEditWorkPage(true);
  };

  // Function to handle closing EditWorkPage
  const handleCloseEditWork = () => {
    setShowEditWorkPage(false);
  };


  const onSubmit = async (newValue) => {
    try {
      switch (editingSection) {
        case "price":
          await modifyPhotographerPrice(photographerState.isPhotographer, newValue);
          setUser((prevUser) => ({ ...prevUser, price: newValue })); // Update price in user state
          break;
        case "operationLocation":
          if (await validateAddressOrCity(newValue)) {
            await modifyPhotographerOperationLocation(photographerState.isPhotographer, newValue);
            setUser((prevUser) => ({ ...prevUser, operationLocation: newValue })); // Update operationLocation in user state
          } else {
            Alert.alert(t('pleaseentervalidlocation'));
          }
          break;
        case "state":
          await modifyPhotographerState(photographerState.isPhotographer, newValue);
          setUser((prevUser) => ({ ...prevUser, state: newValue })); // Update state in user state
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error updating information:", error);
      // Optionally, show an alert or notification to the user
    }
  };

  const fetchData = async () => {
    try {
        const data = await fetchPhotographerById(photographerState.isPhotographer);
        setUser(data.photographer);
    } catch (error) {
        console.error("Error fetching photographer data:", error);
    }
};

  useEffect(() => {
    fetchData();
}, []);
  return (
    <>
      {showEditWorkPage && (
        <View style={styles.absoluteOverlay}>
          <EditWorkPage
            initialImages={workImages}
            photographerId={photographerState.isPhotographer}
            onClose={()=>{
              handleCloseEditWork(),
              fetchData();
            }} // Optional close handler
          />
        </View>
      )}
    {editingSection && <ModifyInfoPopup isVisible={editingSection} initialValue={editingInitialValue} onSubmit={onSubmit} onClose={handleClose} currentSection={editingSection}/>}
        <View style={styles.container}>
            <Header>
                <Ionicons
                    name="settings-sharp"
                    size={24}
                    color={"black"}
                    onPress={() => router.push('/home/profile/settings')}
                />
            </Header>
            <View style={styles.top}>
                <View style={styles.left}>
                    <Text style={styles.title}>
                        {user?.name} {user?.surname}
                    </Text>
                    <Note note={user?.note} />
                    <Text style={styles.bio}>{user?.bio}</Text>
                </View>
                <View style={styles.right}>
                    <ProfilePicture size={100} img={user?.profile_picture} modificationId={photographerState.isPhotographer} onUpload={onUpload} />
                </View>
            </View>
            <View style={styles.line} />

            <View style={styles.editableRow}>
                <View
                    style={[styles.case, styles.greyCase]}
                    onTouchEnd={() => handleEdit('operationLocation', user?.operationLocation)}
                >
                    <Text style={{ fontFamily: 'Satoshi-Light' }}>{user?.operationLocation}</Text>
                </View>
                <View
                    style={[styles.case, styles.greyCase]}
                    onTouchEnd={() => handleEdit('state', user?.state)}
                >
                    <Text style={{ fontFamily: 'Satoshi-Light' }}>{user?.state}</Text>
                </View>
                <View
                    style={[styles.case, styles.blackCase]}
                    onTouchEnd={() => handleEdit('price', user?.price)}
                >
                    <Text style={styles.whiteText}>{"$" + user?.price}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Portfolio</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.horizontalScroller}>
                    {user?.work?.map((workPic, index) => (
                        <Image key={index} style={styles.workPic} source={{ uri: workPic }} />
                    ))}
                </View>
            </ScrollView>

            <View style={styles.dottedButtonContainer}>
              <DottedButton
                title={t('updateyourwork')}
                width={300}
                onPress={() => handleEditWork(user?.work || [])}
              />
            </View>
        </View>

        </>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  dottedButtonContainer: {
    height: '10%',
    width: "100%",
    alignItems: 'center',
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
    
  },
  right: {

  },
  title: {
    fontSize: 35,
    fontFamily: 'Satoshi-Black',
  },
  bio: {
    paddingTop : 20,
    width : '50%',
    fontSize: 15,
    fontFamily: 'Satoshi-Medium',
    marginTop: 5,
    color : '#ACACAC',
  },
  line: {
    marginHorizontal: 20,
    height: 1,
    backgroundColor: 'lightgrey',
    width: "100%",
    marginVertical: 10,
  },
  editableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  case: {
    width: '30%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  greyCase: {
    backgroundColor: '#F4F4F4',
  },
  blackCase: {
    backgroundColor: 'black',
  },
  whiteText: {
    color: 'white',
    fontFamily: 'Satoshi-Medium',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  horizontalScroller: {
    flexDirection: 'row',
  },
  lastpic: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  workPic: {
    width: 150,
    height: 250,
    marginRight: 2,
  },
});
