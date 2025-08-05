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

interface AuthInputProps extends TextInputProps {
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
  required?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
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
  required = false,
  value,
  onChangeText,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null);

  const borderColor = useSharedValue<string>(colors.gray[300]);
  const scale = useSharedValue(1);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    
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
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
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
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 12,
    backgroundColor: colors.white,
    minHeight: 56,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    marginTop: 6,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    marginTop: 6,
  },
  eyeIcon: {
    padding: 12,
  },
  validationIcon: {
    padding: 12,
  },
});

export default AuthInput;