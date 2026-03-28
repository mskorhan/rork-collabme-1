import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.button, styles.outlineButton, disabled && styles.disabledButton, style];
      case 'secondary':
        return [styles.button, styles.secondaryButton, disabled && styles.disabledButton, style];
      default:
        return [styles.button, styles.primaryButton, disabled && styles.disabledButton, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.text, styles.outlineText, disabled && styles.disabledText, textStyle];
      case 'secondary':
        return [styles.text, styles.secondaryText, disabled && styles.disabledText, textStyle];
      default:
        return [styles.text, styles.primaryText, disabled && styles.disabledText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.gray[200],
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  secondaryText: {
    color: colors.text,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;