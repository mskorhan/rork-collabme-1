import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Camera } from 'lucide-react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { getCurrentUser } from '@/mocks/users';
import { CREATIVE_ROLES, COMPANY_TYPES } from '@/constants/userTypes';

export default function EditProfileScreen(): React.ReactElement {
  const updateProfile = useUserStore(state => state.updateProfile);
  const currentUser = getCurrentUser();
  
  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  // Parse location string into city and country
  const parseLocation = (location: string) => {
    const parts = location.split(', ');
    return {
      city: parts[0] || '',
      country: parts[1] || ''
    };
  };
  
  const locationParts = parseLocation(currentUser.location || '');
  const [city, setCity] = useState(locationParts.city);
  const [country, setCountry] = useState(locationParts.country);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [website, setWebsite] = useState(currentUser.socialLinks?.website || '');
  const [instagram, setInstagram] = useState(currentUser.socialLinks?.instagram || '');
  const [loading, setLoading] = useState(false);
  
  // Creative-specific fields
  const [height, setHeight] = useState(
    'physicalAttributes' in currentUser ? currentUser.physicalAttributes?.height?.toString() || '' : ''
  );
  const [weight, setWeight] = useState(
    'physicalAttributes' in currentUser ? currentUser.physicalAttributes?.weight?.toString() || '' : ''
  );
  const [hairColor, setHairColor] = useState(
    'physicalAttributes' in currentUser ? currentUser.physicalAttributes?.hairColor || '' : ''
  );
  const [eyeColor, setEyeColor] = useState(
    'physicalAttributes' in currentUser ? currentUser.physicalAttributes?.eyeColor || '' : ''
  );
  
  const isCreative = 'role' in currentUser;
  
  // Validation functions
  const validateName = (name: string): string | null => {
    if (!name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return null;
  };

  const validateBio = (bio: string): string | null => {
    if (bio.trim().length > 500) return 'Bio must be less than 500 characters';
    return null;
  };

  const validateHeight = (height: string): string | null => {
    if (height && (isNaN(Number(height)) || Number(height) < 100 || Number(height) > 250)) {
      return 'Height must be between 100-250 cm';
    }
    return null;
  };

  const validateWeight = (weight: string): string | null => {
    if (weight && (isNaN(Number(weight)) || Number(weight) < 30 || Number(weight) > 200)) {
      return 'Weight must be between 30-200 kg';
    }
    return null;
  };
  
  const handleSave = (): void => {
    // Validate inputs
    const nameError = validateName(name);
    const bioError = validateBio(bio);
    const heightError = validateHeight(height);
    const weightError = validateWeight(weight);
    
    if (nameError || bioError || heightError || weightError) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedProfile: any = {
        name,
        bio,
        phone,
        location: city && country ? `${city}, ${country}` : city || country || '',
        socialLinks: {
          ...currentUser.socialLinks,
          website,
          instagram,
        },
      };
      
      // Add physical attributes for creatives
      if (isCreative) {
        updatedProfile.physicalAttributes = {
          ...('physicalAttributes' in currentUser ? currentUser.physicalAttributes : {}),
          height: height ? Number(height) : undefined,
          weight: weight ? Number(weight) : undefined,
          hairColor: hairColor || undefined,
          eyeColor: eyeColor || undefined,
        };
      }
      
      updateProfile(updatedProfile);
      setLoading(false);
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1500);
  };
  
  const handleChangeProfilePicture = (): void => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity 
            style={styles.profilePictureButton}
            onPress={handleChangeProfilePicture}
          >
            <Camera size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.profilePictureText}>Change Profile Picture</Text>
        </View>
        
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            validate={validateName}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Bio"
            placeholder="Tell us about yourself..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            validate={validateBio}
            containerStyle={styles.inputContainer}
            inputStyle={styles.bioInput}
          />
          
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />
        </View>
        
        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <Input
            label="City"
            placeholder="Enter your city"
            value={city}
            onChangeText={setCity}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Country"
            placeholder="Enter your country"
            value={country}
            onChangeText={setCountry}
            containerStyle={styles.inputContainer}
          />
        </View>
        
        {/* Physical Attributes (for creatives only) */}
        {isCreative && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Attributes</Text>
            
            <View style={styles.row}>
              <Input
                label="Height (cm)"
                placeholder="170"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                validate={validateHeight}
                containerStyle={[styles.inputContainer, styles.halfWidth]}
              />
              
              <Input
                label="Weight (kg)"
                placeholder="65"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                validate={validateWeight}
                containerStyle={[styles.inputContainer, styles.halfWidth]}
              />
            </View>
            
            <View style={styles.row}>
              <Input
                label="Hair Color"
                placeholder="Brown"
                value={hairColor}
                onChangeText={setHairColor}
                containerStyle={[styles.inputContainer, styles.halfWidth]}
              />
              
              <Input
                label="Eye Color"
                placeholder="Blue"
                value={eyeColor}
                onChangeText={setEyeColor}
                containerStyle={[styles.inputContainer, styles.halfWidth]}
              />
            </View>
          </View>
        )}
        
        {/* Social Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          
          <Input
            label="Website"
            placeholder="https://yourwebsite.com"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Instagram"
            placeholder="@yourusername"
            value={instagram}
            onChangeText={setInstagram}
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.cancelButton}
        />
        
        <Button
          title="Save Changes"
          onPress={handleSave}
          disabled={loading}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePictureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profilePictureText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});