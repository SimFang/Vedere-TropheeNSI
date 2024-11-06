import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../../components/elements/header';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { t } from "../../../../localization";
import SettingBox from '../components/SettingBox';
import { fetchUserInfo } from '../../../../services/getUserInfoByTokenRequest';
import { useSelector } from 'react-redux';
import InputsSettingPage from './personal-info/InputsSettingPage';
import ProfilePicture from '../../../../components/elements/profilePic';
import { updateUserEmail } from '../../../../services/userInfo/updateUserEmail';
import { updateUserPassword } from '../../../../services/userInfo/updateUserPassword';
import { updateUserName } from '../../../../services/userInfo/updateUserName'; 
import { updateUserSurname } from '../../../../services/userInfo/updateUserSurname'; 

const PersonalInfo = () => {
    const [user, setUser] = useState();
    const [displayedSection, setDisplayedSection] = useState("");
    const authState = useSelector(state => state.auth);

    const boxes = [
        { title: t('name'), text: user?.name || '', section: "name" },
        { title: t('email'), text: user?.email || '', section: "email" },
        { title: t('phonenumber'), text: user?.phone || '', section: "phonenumber" },
        { title: t('password'), text: '', section: "password" },
    ];

    const pages = [
        {
            title1: t("name"),
            title2: t("surname"),
            initialFirstValue: user?.name || '',
            initialSecondValue: user?.surname || '',
            id: user?.userId,
            onClose: closeSection,
            onSubmit: [
                (id, value) => {
                    setUser(prevUser => ({ ...prevUser, name: value })); // Update name
                    updateUserName(id, value);
                },
                (id, value) => {
                    setUser(prevUser => ({ ...prevUser, surname: value })); // Update surname
                    updateUserSurname(id, value);
                }
            ]
        },
        {
            title1: t("email"),
            title2: '',
            initialFirstValue: user?.email || '',
            initialSecondValue: '',
            id: [user?.userId, authState.token],
            onClose: closeSection,
            onSubmit: (userId, idtoken, value) => {
                setUser(prevUser => ({ ...prevUser, email: value })); // Update email
                updateUserEmail(userId, idtoken, value);
            }
        },
        {
            title1: t("password"),
            title2: t('confirmyourpassword'),
            initialFirstValue: '',
            initialSecondValue: '',
            id: authState.token,
            onClose: closeSection,
            onSubmit: updateUserPassword
        },
    ];

    const closeSection = () => { setDisplayedSection(""); };

    useEffect(() => {
        const getUserInfo = async () => {
            const data = await fetchUserInfo(authState.token);
            setUser(data);
        };
        getUserInfo();
    }, [authState.token]);

    const router = useRouter();

    const handleBoxClick = (section) => {
        setDisplayedSection(section);
        console.log(`Clicked on section: ${section}`);
    };

    return (
        <>
        {/* Render the appropriate InputsSettingPage based on displayedSection */}
        {pages.map((page, index) => (
                displayedSection === page.title1 && (
                    <InputsSettingPage
                        key={index}
                        onClose={closeSection}
                        initialFirstValue={page.initialFirstValue}
                        initialSecondValue={page.initialSecondValue}
                        title1={page.title1}
                        title2={page.title2}
                        onSubmit={page.onSubmit}
                    />
                )
            ))}
        
        <View style={styles.mainContainer}>
            <Header>
                <Entypo name="chevron-left" size={24} color="black" onPress={() => router.back()} />
            </Header>
            <Text style={styles.title}>{t('personalinformations')}</Text>

            

            <View style={styles.ProfilePicture}>
                <ProfilePicture 
                    img={user?.profile_picture || 'https://i.sstatic.net/l60Hf.png'} 
                    size={80} 
                    modificationId={user?.userId} 
                    onUpload={() => {}} 
                />
            </View>

            {boxes.map((box, index) => (
                <SettingBox
                    key={index}
                    title={box.title}
                    text={box.text}
                    url={() => handleBoxClick(box.title)}
                >
                    {box.children}
                </SettingBox>
            ))}
        </View>
        </>
    );
};

export default PersonalInfo;

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        minHeight: Dimensions.get('window').height,
        padding: 16,
    },
    title: {
        padding: 30,
        fontFamily: 'Satoshi-Black',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    ProfilePicture: {
        width: "100%",
        alignItems: 'flex-start',
        paddingHorizontal: 30,
        marginBottom: 16,
    },
});
