import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterButton = ({ state, setState }) => {
  const filterStates = ["all", "done", "shootings", "conversations"];
  const colors = ['#000000', '#327FAA', '#2B6E95', '#C7C5C5']; // Static colors for each state

  // Function to handle button press
  const handlePress = () => {
    const nextState = (state + 1) % 4; // Cycle through states 0 -> 1 -> 2 -> 3 -> 0
    setState(nextState);
  };

  // Get the appropriate icon based on the state
  const getStateDetails = () => {
    const icons = ['albums', 'checkmark-done', 'camera', 'chatbubbles'];
    return { icon: icons[state], label: filterStates[state] };
  };

  const { icon } = getStateDetails();

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={[styles.button, { backgroundColor: colors[state] }]}>
        <Ionicons name={icon} size={30} color="white" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: 50,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});

export default FilterButton;