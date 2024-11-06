import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';


const Note = ({note}) => {
  return (
    <View style={styles.container}>
      <AntDesign name="star" size={15} color="black" style={styles.star}/>
      <Text style={styles.noteText}>{note}</Text>
    </View>
  )
}

export default Note

const styles = StyleSheet.create({
  container : {
    width : 100,
    backgroundColor : '#EDEDED',
    alignItems : 'center',
    justifyContent : 'center',
    flexDirection : 'row',
    padding : 10,
    gap : 12,
    borderRadius : 15
  },
  noteText : {
    fontFamily : 'Satoshi-Medium'
  }
})