import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/elements/header';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import SettingBox from './components/SettingBox';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../../../localization';
import { fetchUserInfo } from '../../../services/getUserInfoByTokenRequest';
import { useSelector } from 'react-redux';
import LogoutComponent from './components/SignOutButton';


const Settings = () => {
    const authState = useSelector((state)=>state.auth)

  const sections = [
    {
      title: t('personalinformations'),
      text: t('profileinformations'),
      children: <Ionicons name="person-sharp" size={24} color="black" />,
      url: '/home/profile/settings/personal-info',
    },
    {
      title: t('confidentialityparameters'),
      text: t('manage-your-data'),
      children: <Ionicons name="shield-half-outline" size={24} />,
      url: '/home/profile/settings/confidentiality',
    },
    {
      title: t('appearance'),
      text: t('userthedeviceparameters'),
      children: <Ionicons name="brush-outline" size={24} />,
      url: '/home/profile/settings/appearance',
    },
    {
      title: t('securitypreferences'),
      text: t('chooseandplanifyyoursecuritytools'),
      children: <Ionicons name="lock-closed" size={24} />,
      url: '/home/profile/settings/security',
    },
    {
      title: t('termsofuse'),
      text: t('legal'),
      children: <Ionicons name="newspaper-outline" size={24} />,
      url: '/home/profile/settings/terms-and-conditions',
    },
  ];

  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      <Header>
        <Entypo name="chevron-left" size={24} color="black" onPress={() => router.back()} />
      </Header>

      {sections.map((section, index) => (
        <SettingBox
          key={index}
          title={section.title}
          text={section.text}
          url={section.url}
        >
          {section.children}
        </SettingBox>
      ))}
      <LogoutComponent/>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    minHeight: Dimensions.get('window').height,
    padding: 16,
  },
});
