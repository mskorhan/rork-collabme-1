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
import { colors } from '@/constants/colors';
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
  const borderColor = useSharedValue<string>(colors.gray[300]);
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
    borderColor.value = withTiming(colors.primary);
    scale.value = withSpring(1.02);
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error || inlineError ? colors.error : colors.gray[300]
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
          placeholderTextColor={colors.gray[400]}
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
              <EyeOff size={20} color={colors.gray[500]} />
            ) : (
              <Eye size={20} color={colors.gray[500]} />
            )}
          </TouchableOpacity>
        )}

        {currentSuccess && !currentError && (
          <View style={styles.validationIcon}>
            <CheckCircle size={20} color={colors.success} />
          </View>
        )}

        {currentError && (
          <View style={styles.validationIcon}>
            <AlertCircle size={20} color={colors.error} />
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
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputSuccess: {
    borderColor: colors.success,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    marginTop: 4,
  },
  eyeIcon: {
    padding: 10,
  },
  validationIcon: {
    padding: 10,
  },
});

export default Input;