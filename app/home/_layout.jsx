import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import icons for customization

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: 'black',  // Set the tab bar background color to black
          height: 70,  // Set the tab bar height
          paddingBottom: 10,  // Adjust padding if needed
        },
        tabBarActiveTintColor: 'white',  // Active tab icon color
        tabBarInactiveTintColor: 'gray', // Inactive tab icon color
       

        // Custom icons for home, chat, and profile
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home-sharp' : 'home-outline'; // Home icon
          } else if (route.name === 'chat/' || route.name.startsWith("ch")) {
            iconName = focused ? 'chatbox' : 'chatbox-outline'; // Chat icon
          } else if (route.name === 'profile/' || route.name.startsWith("pr")) {
            iconName = focused ? 'person' : 'person-outline'; // Profile icon
          } else if (route.name === 'photographers/' || route.name.startsWith("ph")) {
            iconName = focused ? 'aperture' : 'aperture-outline'; // Profile icon
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarIconStyle: {
          marginTop: 5,  // Adjust icon positioning
        },
      })}
    >
      {/* Only the desired screens are included */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          tabBarShowLabel : false
        }} 
        
      />
      <Tabs.Screen 
        name="chat" 
        options={{ 
          headerShown: false,
          tabBarShowLabel : false

        }} 
        
      />
      <Tabs.Screen 
        name="photographers" 
        options={{ 
          headerShown: false,
          tabBarShowLabel : false

        }} 
        
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          headerShown: false,
          tabBarShowLabel : false
        }} 
      />
    </Tabs>
  );
}
