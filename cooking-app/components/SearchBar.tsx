import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  handleSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({
  query,
  setQuery,
  handleSearch,
  placeholder = ""
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);  

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, isFocused && styles.focus]}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <CustomButton title="Search" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10,
  },
  focus: {
    borderColor: "#ff914d",
  }
});
