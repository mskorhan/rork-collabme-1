import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { colors } from '@/constants/colors';
import { Filter } from 'lucide-react-native';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilters: string[];
  onFilterPress: (filterId: string) => void;
  onClearFilters?: () => void;
  showFilterIcon?: boolean;
  onFilterIconPress?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  selectedFilters,
  onFilterPress,
  onClearFilters,
  showFilterIcon = true,
  onFilterIconPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilters.includes(filter.id) && styles.selectedFilter
            ]}
            onPress={() => onFilterPress(filter.id)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.filterText,
                selectedFilters.includes(filter.id) && styles.selectedFilterText
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
        
        {selectedFilters.length > 0 && onClearFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClearFilters}
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {showFilterIcon && onFilterIconPress && (
        <TouchableOpacity 
          style={styles.filterIconButton}
          onPress={onFilterIconPress}
        >
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  selectedFilterText: {
    color: colors.white,
    fontWeight: '500',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
  },
  clearText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  filterIconButton: {
    padding: 8,
    marginRight: 16,
  },
});

export default FilterBar;