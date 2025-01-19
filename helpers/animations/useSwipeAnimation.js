// useSwipeAnimation.js
import { useState } from 'react';
import { Animated, PanResponder } from 'react-native';

const useSwipeAnimation = (handleBack) => {
  const translateXAnim = useState(new Animated.Value(0))[0]; // For horizontal movement
  const fadeAnim = useState(new Animated.Value(1))[0]; // For fading effect

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => gestureState.dx > 0, // Detect swipe gesture
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx >= 0) { // Swipe to the right only
        translateXAnim.setValue(gestureState.dx);
        fadeAnim.setValue(1 - gestureState.dx / 300); // Adjust fade with distance
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 150) { // Threshold to close the view
        Animated.timing(translateXAnim, {
          toValue: 500, // Move out of screen
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          handleBack(); // Trigger the back action
        });
      } else {
        // Reset animation if threshold not met
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return { panResponder, translateXAnim, fadeAnim };
};

export default useSwipeAnimation;

// const App = () => {
//     const [shownPicture, setShownPicture] = useState(null);
//     const { panResponder, translateXAnim, fadeAnim } = useSwipeAnimation(handleBack);
  
//     const handleBack = () => {
//       console.log('Back action triggered');
//       // Handle back action logic here
//     };
  
//     return (
//       <Animated.View
//         {...panResponder.panHandlers} // Attach pan gesture handlers
//         style={[
//           styles.container,
//           {
//             transform: [{ translateX: translateXAnim }], // Apply horizontal movement
//             opacity: fadeAnim, // Apply fade effect
//           },
//         ]}
//       >
//         {/* Rest of your content */}
//         <TouchableOpacity onPress={() => setShownPicture('some_image_url')}>
//           <Text>Show Picture</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };
  