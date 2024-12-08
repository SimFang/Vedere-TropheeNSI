import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const TutorialSection = ({ 
  illustration, 
  text, 
  goToPreviousSection, 
  goToNextSection, 
  currentSection, 
  totalSections 
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionImageContainer}>
        <Image source={typeof illustration === 'string' ? { uri: illustration } : illustration} style={styles.sectionImage} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.sectionText}>{text}</Text>
        <View style={styles.chevronContainer}>
          <TouchableOpacity
            onPress={goToPreviousSection}
            style={[
              styles.chevronButton,
              styles.leftChevron,
              { opacity: currentSection > 0 ? 1 : 0 },
            ]}
          >
            <Ionicons name="chevron-back-outline" size={30} color="#A0A0A0" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextSection}
            style={[
              styles.chevronButton,
              styles.rightChevron,
              { opacity: currentSection < totalSections - 1 ? 1 : 0 },
            ]}
          >
            <Ionicons name="chevron-forward-outline" size={30} color="#A0A0A0" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TutorialSection;

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ECECEC',
    borderRadius: 15,
    width: '100%',
    height: 300,
  },
  sectionImageContainer: {
    width: 150,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  sectionText: {
    fontSize: 14,
    fontFamily: 'Satoshi',
    color: 'gray',
    textAlign: 'left',
    marginBottom: 10,
  },
  chevronContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chevronButton: {
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
});