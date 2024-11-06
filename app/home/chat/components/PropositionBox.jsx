import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formateDistance } from '../../../../helpers/formateDistance';
import { useDispatch } from 'react-redux';
import { setCurrentChatId } from '../../../../store/chatSlice';

const PropositionBox = ({ name = "", lastmessage = "", id, distance = 200, date = "", hour = "", location = "" }) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(setCurrentChatId(id));
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient 
        colors={['#327FAA', '#143344']} 
        style={styles.mainContainer}
      >
        <View style={styles.container}>
          <View style={styles.left}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.lastmessage}>{lastmessage}</Text>
          </View>
          <View style={styles.right}>
            <Ionicons name="location-sharp" size={20} color={"#fff"} />
            <Text style={styles.distance}>{formateDistance(distance)}</Text>
          </View>
        </View>

        {/* Line + Title */}
        <View style={styles.lineCenter}>
          <View style={styles.line}></View>
          <View style={styles.textContainer}>
            <Text style={styles.info}>{"° " + date}</Text>
            <Text style={styles.info}>{"° " + hour}</Text>
            <Text style={styles.info}>{"° " + location}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PropositionBox;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'space-between',
    marginHorizontal: 30,
    marginTop: 10,
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width : '100%',
  },
  left: {
    width: "50%",
    gap: 5,
  },
  right: {
    flexDirection: 'row',
    gap: 5,
  },
  distance: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 15,
    color: 'white',
  },
  name: {
    color: 'white',
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
  },
  lastmessage: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Satoshi-Regular',
    opacity: 0.6,
  },
  lineCenter: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'white',
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 5,
    width: '100%',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'Satoshi-Regular',
  },
});
