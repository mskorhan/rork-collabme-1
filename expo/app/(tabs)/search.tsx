import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Search, Filter, X, User, Image as ImageIcon, Video, Headphones, FileText } from 'lucide-react-native';
import ProfileCard from '@/components/ProfileCard';
import FilterDrawer from '@/components/FilterDrawer';
import CategoryTabs from '@/components/CategoryTabs';
import { mockCreatives, mockCompanies } from '@/mocks/users';
import { mockPosts } from '@/mocks/posts';
import { useAuthStore } from '@/store/authStore';
import { UserProfile, Post, CreativeProfile, CompanyProfile } from '@/types';

type CategoryType = 'users' | 'photos' | 'videos' | 'audio' | 'pdf';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('users');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedAppearance, setSelectedAppearance] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  
  const { subscriptionTier } = useAuthStore();

  const categories = [
    { id: 'users' as const, label: 'Users', icon: User },
    { id: 'photos' as const, label: 'Photos', icon: ImageIcon },
    { id: 'videos' as const, label: 'Videos', icon: Video },
    { id: 'audio' as const, label: 'Audio', icon: Headphones },
    { id: 'pdf' as const, label: 'PDF', icon: FileText },
  ];

  const allUsers: (CreativeProfile | CompanyProfile)[] = [...mockCreatives, ...mockCompanies];

  // Get filter limits based on subscription tier
  const getFilterLimits = () => {
    switch (subscriptionTier) {
      case 'free':
        return { 
          maxFilters: 3, 
          canFilterByAppearance: false,
          canFilterByLocation: false,
          canFilterByMultipleRoles: false
        };
      case 'gold':
        return { 
          maxFilters: 5, 
          canFilterByAppearance: true,
          canFilterByLocation: true,
          canFilterByMultipleRoles: true
        };
      case 'diamond':
        return { 
          maxFilters: Infinity, 
          canFilterByAppearance: true,
          canFilterByLocation: true,
          canFilterByMultipleRoles: true
        };
      default:
        return { 
          maxFilters: 3, 
          canFilterByAppearance: false,
          canFilterByLocation: false,
          canFilterByMultipleRoles: false
        };
    }
  };

  const filterLimits = getFilterLimits();
  const totalActiveFilters = selectedRoles.length + selectedAppearance.length + selectedLocation.length;

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Search query filter
      const matchesQuery = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Role filter - add null checks
      const matchesRole = selectedRoles.length === 0 || 
        ('role' in user && user.role && selectedRoles.includes(user.role)) ||
        ('companyType' in user && user.companyType && selectedRoles.includes(user.companyType));
      
      // Location filter (simplified for demo)
      const matchesLocation = selectedLocation.length === 0 || 
        (user.location && selectedLocation.some(loc => 
          user.location.toLowerCase().includes(loc.toLowerCase())
        ));
      
      return matchesQuery && matchesRole && matchesLocation;
    });
  }, [searchQuery, selectedRoles, selectedAppearance, selectedLocation, allUsers]);

  const filteredPosts = useMemo(() => {
    const categoryType = selectedCategory === 'photos' ? 'photo' : 
                        selectedCategory === 'videos' ? 'video' :
                        selectedCategory === 'audio' ? 'audio' :
                        selectedCategory === 'pdf' ? 'pdf' : null;

    if (!categoryType) return [];

    return mockPosts.filter(post => {
      const matchesType = post.type === categoryType;
      const matchesQuery = searchQuery === '' || 
        (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.hashtags?.some(hashtag => hashtag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesType && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleFilterApply = (filters: {
    roles: string[];
    appearance: string[];
    location: string[];
  }) => {
    setSelectedRoles(filters.roles);
    setSelectedAppearance(filters.appearance);
    setSelectedLocation(filters.location);
    setShowFilterDrawer(false);
  };

  const handleClearFilters = () => {
    setSelectedRoles([]);
    setSelectedAppearance([]);
    setSelectedLocation([]);
  };

  const handleProfilePress = (profile: UserProfile) => {
    router.push(`/profile/${profile.id}`);
  };

  const renderProfile = ({ item, index }: { item: CreativeProfile | CompanyProfile; index: number }) => (
    <View style={styles.profileGridContainer}>
      <ProfileCard
        profile={item}
        onPress={() => handleProfilePress(item)}
        size="grid"
        showTierBasedRoles={true}
      />
    </View>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity style={styles.postContainer}>
      <View style={styles.postImageContainer}>
        {item.type === 'photo' && (
          <Image source={{ uri: item.content }} style={styles.postImage} />
        )}
        {item.type === 'video' && (
          <View style={styles.videoContainer}>
            <Image source={{ uri: item.content }} style={styles.postImage} />
            <View style={styles.playButton}>
              <Video size={24} color={colors.white} />
            </View>
          </View>
        )}
        {item.type === 'audio' && (
          <View style={styles.audioContainer}>
            <Image source={{ uri: item.coverArt || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }} style={styles.postImage} />
            <View style={styles.audioOverlay}>
              <Headphones size={24} color={colors.white} />
              <Text style={styles.duration}>{Math.floor((item.duration || 0) / 60)}:{((item.duration || 0) % 60).toString().padStart(2, '0')}</Text>
            </View>
          </View>
        )}
        {item.type === 'pdf' && (
          <View style={styles.pdfContainer}>
            <FileText size={48} color={colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.postInfo}>
        <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.postDescription} numberOfLines={1}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderUsersList = () => (
    <FlatList
      key={`users-grid-${selectedCategory}-columns-2`}
      data={filteredUsers}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={renderProfile}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No profiles found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      }
    />
  );

  const renderPostsList = () => (
    <FlatList
      key={`posts-${selectedCategory}-columns-2`}
      data={filteredPosts}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={renderPost}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {selectedCategory} found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      }
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.gray[500]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={selectedCategory === 'users' ? 'Search creators or companies...' : `Search ${selectedCategory}...`}
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {selectedCategory === 'users' && (
            <TouchableOpacity 
              style={[
                styles.filterButton,
                totalActiveFilters > 0 && styles.filterButtonActive
              ]}
              onPress={() => setShowFilterDrawer(true)}
            >
              <Filter size={20} color={totalActiveFilters > 0 ? colors.white : colors.text} />
              {totalActiveFilters > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{totalActiveFilters}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={(category) => setSelectedCategory(category as CategoryType)}
        />
      </View>
      
      {/* Results */}
      {selectedCategory === 'users' ? renderUsersList() : renderPostsList()}

      {/* Filter Drawer */}
      {selectedCategory === 'users' && (
        <FilterDrawer
          visible={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
          onApply={handleFilterApply}
          onClear={handleClearFilters}
          selectedRoles={selectedRoles}
          selectedAppearance={selectedAppearance}
          selectedLocation={selectedLocation}
          filterLimits={filterLimits}
          subscriptionTier={subscriptionTier || 'free'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  profileContainer: {
    marginBottom: 12,
  },
  profileGridContainer: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 16,
  },
  postContainer: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  audioContainer: {
    position: 'relative',
  },
  audioOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 4,
  },
  pdfContainer: {
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  postInfo: {
    padding: 12,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  postDescription: {
    fontSize: 12,
    color: colors.gray[500],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});