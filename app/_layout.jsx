import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import store from '../store/store';
import FontLoader from '../components/FontLoader';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={"pk_test_51QPVJfBQamPSvLrspFSk7pTTimduQcVr6MGrYFuOMk8iNJHXHhHfSI9YgQhtZjnKLyYgvk2g4KL3HtWdgx0tj3eO00P6qqOCzT"}>
        <FontLoader>
          <Stack>
            <Stack.Screen 
              name="index"  // Default route to loading screen
              options={{ headerShown: false }}  // Optionally hide header
            />
            <Stack.Screen 
              name="auth" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="home" 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="payment" 
              options={{ headerShown: false }} 
            />
          </Stack>
        </FontLoader>
      </StripeProvider>
    </Provider>
  );
}