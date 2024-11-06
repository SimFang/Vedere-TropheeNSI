import { Stack } from 'expo-router';

export default function PhotographersLayout() {

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="filters" 
        options={{ headerShown : false }} 
      />
      <Stack.Screen 
        name="order/orderVisualisation" 
        options={{ headerShown : false }} 
      />
      {/* You can add more Home screens here */}
    </Stack>
  );
}
