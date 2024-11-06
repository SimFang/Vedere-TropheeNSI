import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="wrapper"
        options={{headerShown : false}}
      />
      <Stack.Screen
        name="emailverification"
        options={{headerShown : false}}
      />
      {/* You can add more Auth screens here */}
    </Stack>
  );
}
