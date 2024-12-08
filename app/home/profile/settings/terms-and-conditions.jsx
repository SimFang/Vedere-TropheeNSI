import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const termsSections = [
  {
    title: 'Introduction',
    content: 'These Terms of Service govern your use of the Vedere app. By accessing or using our app, you agree to these terms. If you do not agree, do not use the app.',
  },
  {
    title: '1. User Responsibilities',
    content: 'As a user, you agree to:\n\n• Provide accurate and complete information during registration.\n\n• Comply with all applicable laws and regulations.\n\n• Not engage in any prohibited activities, including but not limited to fraud, harassment, or infringement of intellectual property.',
  },
  {
    title: '2. Prohibited Activities',
    content: 'You may not:\n\n• Post any content that is illegal, offensive, or harmful to others.\n\n• Use the app to solicit or engage in illegal activities.\n\n• Attempt to hack or interfere with the app’s functionality.',
  },
  {
    title: '3. Dispute Resolution',
    content: 'Any disputes arising from these Terms of Service will be resolved through binding arbitration in accordance with [Arbitration Rules]. By agreeing to these Terms, you waive your right to a trial by jury or participate in a class action.',
  },
  {
    title: '4. Limitation of Liability',
    content: 'Vedere is not liable for any damages arising from the use of the app, including but not limited to loss of data, interruptions in service, or disputes between users.',
  },
  {
    title: '5. Changes to Terms',
    content: 'We reserve the right to update these Terms of Service at any time. We will notify you of any changes through the app or via email.',
  },
];

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Use</Text>
      {termsSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    marginBottom: 10,
    marginTop : 80,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 16,
    marginBottom: 5,
  },
  sectionContent: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    lineHeight: 24,
  },
});