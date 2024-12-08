import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import TutorialSection from './TutorialSection';

const TutorialPage = ({ title, description, sections }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TutorialSection
        illustration={sections[currentSection]?.illustration}
        text={sections[currentSection]?.text}
        goToPreviousSection={goToPreviousSection}
        goToNextSection={goToNextSection}
        currentSection={currentSection}           // Pass current section index
        totalSections={sections.length}           // Pass total number of sections
      />
    </View>
  );
};

export default TutorialPage;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Satoshi-Black',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    marginBottom: 20,
    color: 'gray',
    textAlign: 'center',
  },
});