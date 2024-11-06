import { Stack } from 'expo-router';

export default function ProfileLayout() {

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ headerShown : false }} 
      />
       <Stack.Screen 
        name="photographerform/firstpage" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="photographerform/secondpage" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="photographerProfile/photographerProfile" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="settings/confidentiality" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="settings/personal-info" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="settings/appearance" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="settings/security" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="settings/terms-and-conditions" 
        options={{ headerShown : false }} 
      />
      {/* You can add more Home screens here */}
    </Stack>
  );
}
