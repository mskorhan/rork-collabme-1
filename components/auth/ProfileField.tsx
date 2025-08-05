import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { AuthInput } from './AuthInput';

interface ProfileFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  validate?: (value: string) => string | null;
  required?: boolean;
  containerStyle?: ViewStyle;
  unit?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  validate,
  required = false,
  containerStyle,
  unit,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <AuthInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        validate={validate}
        required={required}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {unit && value && (
        <Text style={styles.unit}>{unit}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  unit: {
    position: 'absolute',
    right: 16,
    top: 50,
    fontSize: 16,
    color: colors.gray[500],
  },
});

export default ProfileField;