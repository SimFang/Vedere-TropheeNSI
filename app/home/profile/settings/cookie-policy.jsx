import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const cookiePolicySections = [
  {
    title: 'Introduction',
    content: 'This Cookie Policy explains how Vedere uses cookies and similar technologies to improve your experience when using our app.',
  },
  {
    title: '1. What Are Cookies?',
    content: 'Cookies are small text files placed on your device that allow us to recognize your preferences and improve functionality. Cookies can be either first-party (set by Vedere) or third-party (set by partners or advertisers).',
  },
  {
    title: '2. Types of Cookies We Use',
    content: '• Essential Cookies: Necessary for the app to function, such as for login and session management.\n\n• Performance Cookies: Collect data about how you use the app to help us improve the service.\n\n• Functionality Cookies: Remember your preferences and settings to enhance your experience.\n\n• Advertising Cookies: Used to deliver personalized ads.',
  },
  {
    title: '3. Managing Cookies',
    content: 'You can manage your cookie preferences through your device settings. You may choose to disable cookies, but please note that some features of the app may not function properly without them.',
  },
  {
    title: '4. Changes to This Policy',
    content: 'We may update this Cookie Policy from time to time. We will notify you of any significant changes through the app or via email.',
  },
];

const CookiePolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cookie Policy</Text>
      {cookiePolicySections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CookiePolicy;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    marginBottom: 10,
    marginTop : 100,
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