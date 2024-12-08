import { Stack } from 'expo-router';
import { PaymentProvider } from './PaymentContext';

export default function PaymentLayout() {
  return (
    <PaymentProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{headerShown : false}}
          />
          <Stack.Screen
            name="carddetails"
            options={{headerShown : false}}
          />
          <Stack.Screen
            name="success"
            options={{headerShown : false}}
          />
      </Stack>
    </PaymentProvider>
    
  );
}
