import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CompanyLogo from './companyLogo'; 
import { Ionicons } from '@expo/vector-icons'; // Import icons for customization
import { useRouter } from 'expo-router';


const Header = ({children}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CompanyLogo size={30}/>
        <View style={styles.headerIcons}>
            {children}
        </View>
      </View>
      </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
      fontFamily : 'Satoshi-Black',
      backgroundColor: '#fff',
    },
    header: {
        
      marginTop : 60,
      padding :30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerIcons: {
      flexDirection: 'row',
    }
  });