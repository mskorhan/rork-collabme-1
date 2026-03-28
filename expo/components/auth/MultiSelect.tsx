import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface MultiSelectOption {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  maxSelections?: number;
  label?: string;
  required?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  maxSelections,
  label,
  required = false,
}) => {
  const handleToggle = (value: string) => {
    const isSelected = selectedValues.includes(value);
    
    if (isSelected) {
      onSelectionChange(selectedValues.filter(v => v !== value));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return; // Don't allow more selections
      }
      onSelectionChange([...selectedValues, value]);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
          {maxSelections && (
            <Text style={styles.limit}> (Max {maxSelections})</Text>
          )}
        </Text>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsContainer}
      >
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          const isDisabled = maxSelections && selectedValues.length >= maxSelections && !isSelected;
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                isDisabled && styles.disabledOption,
              ]}
              onPress={() => handleToggle(option.id)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                isSelected && styles.selectedOptionText,
                isDisabled && styles.disabledOptionText,
              ]}>
                {option.label}
              </Text>
              {isSelected && (
                <Check size={16} color={colors.white} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {maxSelections && (
        <Text style={styles.selectionCount}>
          {selectedValues.length} of {maxSelections} selected
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  limit: {
    color: colors.gray[500],
    fontWeight: '400',
  },
  optionsContainer: {
    paddingRight: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.white,
  },
  disabledOptionText: {
    color: colors.gray[400],
  },
  checkIcon: {
    marginLeft: 8,
  },
  selectionCount: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 8,
    textAlign: 'right',
  },
});

export default MultiSelect;