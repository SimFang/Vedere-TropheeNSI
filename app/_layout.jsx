import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../store/store';
import FontLoader from '../components/FontLoader';

export default function RootLayout() {
  return (
    <Provider store={store}>
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
                options={{ headerShown: false}} 
            />
        </Stack>
      </FontLoader>
    </Provider>
  );
}


