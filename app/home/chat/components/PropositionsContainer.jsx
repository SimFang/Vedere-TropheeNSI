import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PropositionsContainer = ({children}) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  )
}

export default PropositionsContainer

const styles = StyleSheet.create({})