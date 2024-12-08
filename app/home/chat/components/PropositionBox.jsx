import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formateDistance } from '../../../../helpers/formateDistance';
import { useDispatch } from 'react-redux';
import { setCurrentChatId } from '../../../../store/chatSlice';

const PropositionBox = ({ name = "", lastmessage = "", id, distance = 200, date = "", hour = "", location = "", isActive = true }) => {
  const dispatch = useDispatch();

  const handlePress = () => {
    dispatch(setCurrentChatId(id));
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.shadowContainer}>
        {isActive ? (
          <LinearGradient colors={['#327FAA', '#143344']} style={styles.mainContainer}>
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
            <View style={styles.lineCenter}>
              <View style={styles.textContainer}>
                <Text style={styles.info}>{date}</Text>
                <Text style={styles.info}>{hour}</Text>
                <Text style={styles.info}>{location}</Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.mainContainer, styles.inactiveContainer]}>
            <View style={styles.container}>
              <View style={styles.left}>
                <Text style={[styles.name, styles.inactiveText]}>{name}</Text>
                <Text style={[styles.lastmessage, styles.inactiveText]}>{lastmessage}</Text>
              </View>
              <View style={styles.right}>
                <Ionicons name="checkmark-circle" size={20} color={"#000"} />
                <Text style={[styles.doneText]}>Done</Text>
              </View>
            </View>
            <View style={styles.lineCenter}>
              <View style={styles.textContainer}>
                <Text style={[styles.info, styles.inactiveText]}>{date}</Text>
                <Text style={[styles.info, styles.inactiveText]}>{hour}</Text>
                <Text style={[styles.info, styles.inactiveText]}>{location}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PropositionBox;

const styles = StyleSheet.create({
  shadowContainer: {
    marginHorizontal: 30,
    marginTop: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mainContainer: {
    flexDirection: 'column',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  inactiveContainer: {
    backgroundColor: '#fff',
    borderColor: '#327FAA',
    borderWidth: 5,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    width: "50%",
    gap: 5,
  },
  right: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
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
  doneText: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#000',
  },
  inactiveText: {
    color: '#000',
  },
  lineCenter: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
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