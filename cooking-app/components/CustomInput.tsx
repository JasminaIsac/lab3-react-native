import React, { useState } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomInputProps extends Partial<TextInputProps> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export default function CustomInput({
  value,
  onChangeText,
  placeholder = '',
  multiline = false,
  numberOfLines = 4,
  style,
  ...rest
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[styles.input, isFocused && styles.focus, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: { 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 10, 
    marginBottom: 10,
  },
  focus: {
    borderColor: "#FF6D45",
  },
});
