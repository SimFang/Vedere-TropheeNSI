import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

// Data for each privacy policy section
const privacyPolicySections = [
  {
    title: "Introduction",
    content: "Welcome to Vedere! We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, how we protect it, and the options you have regarding your information."
  },
  {
    title: "1. Information We Collect",
    content: "We collect the following types of personal information:\n• Account Information: Name, email address, phone number, and location.\n• User-Generated Content: Photos, videos, and other content uploaded to the app.\n• Usage Information: Data about how you interact with our app, including location data (if enabled), device information, and usage logs."
  },
  {
    title: "2. How We Use Your Information",
    content: "We use your information for the following purposes:\n• To provide and improve our services, including connecting users with photographers.\n• To communicate with you about your account, bookings, and customer support requests.\n• To personalize your experience and recommend photographers or locations."
  },
  {
    title: "3. How We Protect Your Information",
    content: "We implement industry-standard security measures, including encryption and secure servers, to protect your personal data. However, please note that no data transmission over the internet can be guaranteed 100% secure."
  },
  {
    title: "4. Sharing Your Information",
    content: "We may share your personal information with third-party service providers that assist us in operating the app, such as payment processors, hosting services, or marketing partners. We do not sell or rent your personal information to third parties."
  },
  {
    title: "5. Your Rights",
    content: "You have the right to access, update, or delete your personal information. You may also withdraw consent for data collection at any time by adjusting your app settings."
  },
  {
    title: "6. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any significant changes through the app or via email."
  }
];

const Confidentiality = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      {privacyPolicySections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Confidentiality;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    marginTop: 100,
    fontFamily: 'Satoshi-Bold',
    fontSize: 24,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    marginBottom: 5,
  },
  sectionContent: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    lineHeight: 24,
  },
});