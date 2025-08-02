import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import * as LucideIcons from 'lucide-react-native';

// Create a type for the icon component
type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}>;

// Create a type for the icon item
interface IconItem {
  name: string;
  component: IconComponent;
}

export default function IconBrowser() {
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<IconItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null);

  useEffect(() => {
    // Extract all icons from the Lucide library
    const iconEntries = Object.entries(LucideIcons).filter(
      ([name, component]) => typeof component === 'function' && name !== 'createLucideIcon'
    );

    const iconList: IconItem[] = iconEntries.map(([name, component]) => ({
      name,
      component: component as IconComponent,
    }));

    setIcons(iconList);
    setFilteredIcons(iconList);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = icons.filter(icon => 
        icon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIcons(filtered);
    } else {
      setFilteredIcons(icons);
    }
  }, [searchQuery, icons]);

  const handleIconPress = (icon: IconItem) => {
    setSelectedIcon(icon);
  };

  const renderIcon = ({ item }: { item: IconItem }) => {
    const IconComponent = item.component;
    return (
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => handleIconPress(item)}
      >
        <IconComponent size={24} color={colors.text} />
        <Text style={styles.iconName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Lucide Icons',
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search icons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading icons...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.resultsText}>
            {filteredIcons.length} {filteredIcons.length === 1 ? 'icon' : 'icons'} found
          </Text>

          <FlatList
            data={filteredIcons}
            renderItem={renderIcon}
            keyExtractor={item => item.name}
            numColumns={4}
            contentContainerStyle={styles.iconList}
          />

          {selectedIcon && (
            <View style={styles.selectedIconContainer}>
              <View style={styles.selectedIconContent}>
                <selectedIcon.component size={32} color={colors.primary} />
                <Text style={styles.selectedIconName}>{selectedIcon.name}</Text>
                <Text style={styles.selectedIconUsage}>
                  {`import { ${selectedIcon.name} } from 'lucide-react-native';`}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedIcon(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray[600],
  },
  resultsText: {
    padding: 16,
    fontSize: 14,
    color: colors.gray[600],
  },
  iconList: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  iconContainer: {
    width: '25%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconName: {
    marginTop: 8,
    fontSize: 10,
    color: colors.gray[700],
    textAlign: 'center',
  },
  selectedIconContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedIconContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedIconName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  selectedIconUsage: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 8,
    backgroundColor: colors.gray[100],
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});