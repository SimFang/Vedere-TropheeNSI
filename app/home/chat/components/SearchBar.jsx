import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ query, setQuery }) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={query}
        onChangeText={setQuery}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  
  searchContainer: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});