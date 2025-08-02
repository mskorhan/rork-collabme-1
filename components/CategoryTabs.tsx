import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';

interface Category {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const IconComponent = category.icon;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              isSelected && styles.selectedTab,
            ]}
            onPress={() => onCategorySelect(category.id)}
          >
            <View style={styles.tabContent}>
              {IconComponent && (
                <IconComponent 
                  size={18} 
                  color={isSelected ? colors.primary : colors.gray[500]} 
                  style={styles.icon}
                />
              )}
              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.selectedTabText,
                ]}
              >
                {category.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    flexGrow: 1,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginHorizontal: 4,
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  selectedTabText: {
    color: colors.white,
  },
});

export default CategoryTabs;