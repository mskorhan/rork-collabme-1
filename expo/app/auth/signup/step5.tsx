import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  TouchableOpacity,
  Image,
  Modal,
  Pressable
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Camera, Upload, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { MultiSelect } from '@/components/auth/MultiSelect';
import { ProfileField } from '@/components/auth/ProfileField';
import { CREATIVE_ROLES } from '@/constants/userTypes';
import { CreativeRole, UserType } from '@/types';
import { useAuthStore } from '@/store/authStore';

const EYE_COLORS = [
  { id: 'blue', label: 'Blue' },
  { id: 'brown', label: 'Brown' },
  { id: 'green', label: 'Green' },
  { id: 'hazel', label: 'Hazel' },
  { id: 'gray', label: 'Gray' },
  { id: 'amber', label: 'Amber' },
];

const HAIR_COLORS = [
  { id: 'blonde', label: 'Blonde' },
  { id: 'brown', label: 'Brown' },
  { id: 'black', label: 'Black' },
  { id: 'red', label: 'Red' },
  { id: 'gray', label: 'Gray' },
  { id: 'white', label: 'White' },
  { id: 'other', label: 'Other' },
];

const SKIN_TONES = [
  { id: 'fair', label: 'Fair' },
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'olive', label: 'Olive' },
  { id: 'tan', label: 'Tan' },
  { id: 'dark', label: 'Dark' },
];

export default function SignupStep5() {
  const { method, contact, username, password } = useLocalSearchParams<{ 
    method: string; 
    contact: string; 
    username: string;
    password: string;
  }>();

  const setAuthenticated = useAuthStore(state => state.setAuthenticated);
  const setOnboarded = useAuthStore(state => state.setOnboarded);

  // Basic profile fields
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skillTags, setSkillTags] = useState('');

  // Actor/Model specific fields
  const [eyeColor, setEyeColor] = useState<string[]>([]);
  const [hairColor, setHairColor] = useState<string[]>([]);
  const [skinTone, setSkinTone] = useState<string[]>([]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
  });
  const [shoeSize, setShoeSize] = useState('');

  // Terms agreement
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActorOrModel = selectedRoles.some(role => 
    ['actor', 'actress', 'model'].includes(role)
  );

  const validateDisplayName = (value: string): string | null => {
    if (!value.trim()) return 'Display name is required';
    if (value.trim().length < 2) return 'Display name must be at least 2 characters';
    return null;
  };

  const validatePortfolioUrl = (value: string): string | null => {
    if (!value) return null; // Optional field
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(value)) return 'Please enter a valid URL (starting with http:// or https://)';
    return null;
  };

  const validateHeight = (value: string): string | null => {
    if (!value && isActorOrModel) return 'Height is required for actors and models';
    if (value && !/^\d+(\.\d+)?$/.test(value)) return 'Please enter a valid height';
    return null;
  };

  const validateWeight = (value: string): string | null => {
    if (value && !/^\d+(\.\d+)?$/.test(value)) return 'Please enter a valid weight';
    return null;
  };

  const isFormValid = () => {
    const displayNameValid = !validateDisplayName(displayName);
    const rolesSelected = selectedRoles.length > 0;
    const portfolioValid = !validatePortfolioUrl(portfolioUrl);
    const heightValid = !validateHeight(height);
    const weightValid = !validateWeight(weight);
    
    const actorModelFieldsValid = !isActorOrModel || (
      eyeColor.length > 0 && 
      hairColor.length > 0 && 
      skinTone.length > 0 && 
      height.trim() !== ''
    );

    return displayNameValid && 
           rolesSelected && 
           portfolioValid && 
           heightValid && 
           weightValid && 
           actorModelFieldsValid && 
           agreedToTerms;
  };

  const handleImagePicker = () => {
    // In a real app, you would use expo-image-picker here
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleFinish = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields and agree to the terms.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call to create account
      const profileData = {
        method,
        contact,
        username,
        password,
        displayName,
        profilePicture,
        roles: selectedRoles,
        portfolioUrl: portfolioUrl || undefined,
        skillTags: skillTags ? skillTags.split(',').map(tag => tag.trim()) : [],
        ...(isActorOrModel && {
          physicalAttributes: {
            eyeColor: eyeColor[0],
            hairColor: hairColor[0],
            skinTone: skinTone[0],
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            measurements: measurements.bust || measurements.waist || measurements.hips ? measurements : undefined,
            shoeSize: shoeSize || undefined,
          }
        })
      };

      console.log('Creating account with data:', profileData);

      // In real app, call your backend API here
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });

      setTimeout(() => {
        setLoading(false);
        
        // Set user as authenticated
        setAuthenticated('1', 'creative' as UserType, 'free');
        setOnboarded(true);
        
        // Navigate to main app
        router.replace('/(tabs)');
      }, 2000);

    } catch (error) {
      setLoading(false);
      console.error('Failed to create account:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const getMaxRoleSelections = () => {
    // In a real app, this would be based on subscription tier
    return 3; // Free: 1, Gold: 2, Diamond: 3
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Profile Setup',
          headerBackTitle: 'Back',
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete your profile</Text>
          <Text style={styles.subtitle}>
            Tell us about yourself to help others find and collaborate with you
          </Text>
        </View>

        {/* Profile Picture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity style={styles.profilePictureContainer} onPress={handleImagePicker}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Camera size={32} color={colors.gray[400]} />
                <Text style={styles.profilePictureText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <AuthInput
            label="Display Name"
            placeholder="How should others see your name?"
            value={displayName}
            onChangeText={setDisplayName}
            validate={validateDisplayName}
            required
          />

          <MultiSelect
            label="Creative Types"
            options={CREATIVE_ROLES}
            selectedValues={selectedRoles}
            onSelectionChange={setSelectedRoles}
            maxSelections={getMaxRoleSelections()}
            required
          />
        </View>

        {/* Actor/Model Specific Fields */}
        {isActorOrModel && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Attributes</Text>
            
            <MultiSelect
              label="Eye Color"
              options={EYE_COLORS}
              selectedValues={eyeColor}
              onSelectionChange={setEyeColor}
              maxSelections={1}
              required
            />

            <MultiSelect
              label="Hair Color"
              options={HAIR_COLORS}
              selectedValues={hairColor}
              onSelectionChange={setHairColor}
              maxSelections={1}
              required
            />

            <MultiSelect
              label="Skin Tone"
              options={SKIN_TONES}
              selectedValues={skinTone}
              onSelectionChange={setSkinTone}
              maxSelections={1}
              required
            />

            <View style={styles.row}>
              <ProfileField
                label="Height"
                value={height}
                onChangeText={setHeight}
                placeholder="5.8"
                keyboardType="numeric"
                validate={validateHeight}
                required
                unit="ft"
                containerStyle={styles.halfWidth}
              />

              <ProfileField
                label="Weight"
                value={weight}
                onChangeText={setWeight}
                placeholder="150"
                keyboardType="numeric"
                validate={validateWeight}
                unit="lbs"
                containerStyle={styles.halfWidth}
              />
            </View>

            <Text style={styles.subsectionTitle}>Measurements (Optional)</Text>
            <View style={styles.row}>
              <ProfileField
                label="Bust/Chest"
                value={measurements.bust}
                onChangeText={(text) => setMeasurements(prev => ({ ...prev, bust: text }))}
                placeholder="34"
                keyboardType="numeric"
                unit="in"
                containerStyle={styles.thirdWidth}
              />

              <ProfileField
                label="Waist"
                value={measurements.waist}
                onChangeText={(text) => setMeasurements(prev => ({ ...prev, waist: text }))}
                placeholder="26"
                keyboardType="numeric"
                unit="in"
                containerStyle={styles.thirdWidth}
              />

              <ProfileField
                label="Hips"
                value={measurements.hips}
                onChangeText={(text) => setMeasurements(prev => ({ ...prev, hips: text }))}
                placeholder="36"
                keyboardType="numeric"
                unit="in"
                containerStyle={styles.thirdWidth}
              />
            </View>

            <ProfileField
              label="Shoe Size"
              value={shoeSize}
              onChangeText={setShoeSize}
              placeholder="9"
              keyboardType="numeric"
              containerStyle={styles.halfWidth}
            />
          </View>
        )}

        {/* Other Creative Fields */}
        {!isActorOrModel && selectedRoles.length > 0 && (
          <View style={styles.section}>
            <AuthInput
              label="Portfolio URL"
              placeholder="https://yourportfolio.com"
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
              keyboardType="email-address"
              autoCapitalize="none"
              validate={validatePortfolioUrl}
            />

            <AuthInput
              label="Skill Tags"
              placeholder="Photography, Editing, Photoshop"
              value={skillTags}
              onChangeText={setSkillTags}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Terms Agreement */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={() => setShowTermsModal(true)}>
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <AuthButton
            title="Create Account"
            onPress={handleFinish}
            disabled={!isFormValid()}
            loading={loading}
          />
        </View>
      </ScrollView>

      {/* Terms Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Terms & Privacy</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>
              This is where the Terms of Service and Privacy Policy content would be displayed.
              {'\n\n'}
              In a real application, you would load this content from your backend or include it as static content.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
  },
  profilePictureText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.gray[500],
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  termsContainer: {
    marginBottom: 30,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});