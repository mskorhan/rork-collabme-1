import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { FilterLimits, SubscriptionTier } from '@/types';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { roles: string[]; appearance: string[]; location: string[] }) => void;
  onClear: () => void;
  selectedRoles: string[];
  selectedAppearance: string[];
  selectedLocation: string[];
  filterLimits: FilterLimits;
  subscriptionTier: SubscriptionTier;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  visible,
  onClose,
  onApply,
  onClear,
  selectedRoles,
  selectedAppearance,
  selectedLocation,
  filterLimits,
  subscriptionTier,
}) => {
  const handleApply = () => {
    onApply({
      roles: selectedRoles,
      appearance: selectedAppearance,
      location: selectedLocation,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Filter Options</Text>
          <Text style={styles.subtitle}>Subscription: {subscriptionTier}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    color: colors.text,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: colors.white,
    fontWeight: '500',
  },
  closeButton: {
    padding: 12,
    alignItems: 'center',
  },
  closeText: {
    color: colors.gray[500],
  },
});

export default FilterDrawer;