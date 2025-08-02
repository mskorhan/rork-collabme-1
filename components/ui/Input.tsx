import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TextInputProps,
  TouchableOpacity
} from 'react-native';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  errorStyle?: TextStyle;
  secureTextEntry?: boolean;
  validate?: (value: string) => string | null;
  showValidation?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  validate,
  showValidation = true,
  value,
  onChangeText,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null);

  // Animation values - explicitly type as string to allow any color value
  const borderColor = useSharedValue<string>(theme.colors.neutral300);
  const scale = useSharedValue(1);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    
    // Inline validation
    if (validate && showValidation && text.length > 0) {
      const validationResult = validate(text);
      if (validationResult) {
        setInlineError(validationResult);
        setInlineSuccess(null);
      } else {
        setInlineError(null);
        setInlineSuccess('Looks good!');
      }
    } else {
      setInlineError(null);
      setInlineSuccess(null);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(theme.colors.primary500);
    scale.value = withSpring(1.02);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error || inlineError ? theme.colors.error600 : theme.colors.neutral300
    );
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    transform: [{ scale: scale.value }],
  }));

  const currentError = error || inlineError;
  const currentSuccess = success || inlineSuccess;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <Animated.View style={[
        styles.inputContainer,
        animatedStyle,
        currentError ? styles.inputError : null,
        currentSuccess && !currentError ? styles.inputSuccess : null,
        inputStyle
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.neutral400}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={theme.colors.neutral500} />
            ) : (
              <Eye size={20} color={theme.colors.neutral500} />
            )}
          </TouchableOpacity>
        )}

        {currentSuccess && !currentError && (
          <View style={styles.validationIcon}>
            <CheckCircle size={20} color={theme.colors.success600} />
          </View>
        )}

        {currentError && (
          <View style={styles.validationIcon}>
            <AlertCircle size={20} color={theme.colors.error600} />
          </View>
        )}
      </Animated.View>
      
      {currentError && (
        <Text style={[styles.errorText, errorStyle]}>{currentError}</Text>
      )}
      
      {currentSuccess && !currentError && (
        <Text style={styles.successText}>{currentSuccess}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: '500' as const,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral300,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.white,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.error600,
  },
  inputSuccess: {
    borderColor: theme.colors.success600,
  },
  errorText: {
    color: theme.colors.error600,
    fontSize: theme.fontSize.base,
    marginTop: theme.spacing.xs,
  },
  successText: {
    color: theme.colors.success600,
    fontSize: theme.fontSize.base,
    marginTop: theme.spacing.xs,
  },
  eyeIcon: {
    padding: theme.spacing.sm + 2,
  },
  validationIcon: {
    padding: theme.spacing.sm + 2,
  },
});

export default Input;