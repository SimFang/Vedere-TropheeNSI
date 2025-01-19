import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import icons for customization
import { Text } from 'react-native'; // Ensure Text is imported for custom labeling

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: route.name === 'photographers' ? 'black' : 'white',  // Change background color on photographers page
          height: 90,  // Increase the height of the tab bar to accommodate labels
          paddingBottom: 10,  // Adjust padding if needed
          shadowColor: '#000', // Shadow color
          shadowOffset: { width: 0, height: 3 }, // Shadow offset
          shadowOpacity: 0.1,  // Shadow opacity
          shadowRadius: 5, // Shadow radius
          elevation: 5, // Shadow for Android devices
        },
        tabBarActiveTintColor: route.name === 'photographers' ? 'white' : 'black',  // Change active icon color on photographers page
        tabBarInactiveTintColor: route.name === 'photographers' ? 'white' : 'gray', // Change inactive icon color on photographers page
       
        // Custom icons for home, chat, profile, and photographers
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home-sharp' : 'home-outline'; // Home icon
          } else if (route.name === 'chat' || route.name.startsWith("ch")) {
            iconName = focused ? 'chatbox' : 'chatbox-outline'; // Chat icon
          } else if (route.name === 'profile' || route.name.startsWith("pr")) {
            iconName = focused ? 'person' : 'person-outline'; // Profile icon
          } else if (route.name === 'photographers' || route.name.startsWith("ph")) {
            iconName = focused ? 'aperture' : 'aperture-outline'; // Photographer icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarIconStyle: {
          marginTop: 5,  // Adjust icon positioning
        },
        // Add text labels below icons
        tabBarLabel: ({ focused }) => {
          let label;

          if (route.name === 'index') {
            label = 'Home';
          } else if (route.name === 'chat' || route.name.startsWith("ch")) {
            label = 'Chat';
          } else if (route.name === 'profile' || route.name.startsWith("pr")) {
            label = 'Profile';
          } else if (route.name === 'photographers' || route.name.startsWith("ph")) {
            label = 'Discover';
          }

          return (
            <Text style={{
              color: route.name === 'photographers' ? 'white' : 'black',  // Change text color on photographers page
              fontSize: 12, // Adjust text size
              marginTop: 5, // Space between icon and text
              fontFamily: 'Satoshi', // Apply Satoshi font
            }}>
              {label}
            </Text>
          );
        },
      })}
    >
      {/* Only the desired screens are included */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          tabBarShowLabel: false
        }} 
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          headerShown: false,
          tabBarShowLabel: false
        }} 
      />
      <Tabs.Screen 
        name="photographers" 
        options={{ 
          headerShown: false,
          tabBarShowLabel: false
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          headerShown: false,
          tabBarShowLabel: false
        }} 
      />
    </Tabs>
  );
}