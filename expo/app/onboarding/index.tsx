import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { CREATIVE_ROLES, COMPANY_TYPES } from '@/constants/userTypes';

export default function OnboardingScreen() {
  const userType = useAuthStore(state => state.userType);
  const setOnboarded = useAuthStore(state => state.setOnboarded);
  const setCreativeProfile = useUserStore(state => state.setCreativeProfile);
  const setCompanyProfile = useUserStore(state => state.setCompanyProfile);
  
  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  
  // Validation functions
  const validateBio = (bio: string): string | null => {
    if (!bio.trim()) return 'Bio is required';
    if (bio.trim().length < 10) return 'Bio must be at least 10 characters';
    if (bio.trim().length > 500) return 'Bio must be less than 500 characters';
    return null;
  };

  const validateCity = (city: string): string | null => {
    if (!city.trim()) return 'City is required';
    if (city.trim().length < 2) return 'Please enter a valid city name';
    return null;
  };

  const validateCountry = (country: string): string | null => {
    if (!country.trim()) return 'Country is required';
    if (country.trim().length < 2) return 'Please enter a valid country name';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      const bioError = validateBio(bio);
      const roleError = userType === 'creative' && !selectedRole ? 'Please select a role' : null;
      const companyTypeError = userType === 'company' && !selectedCompanyType ? 'Please select a company type' : null;
      
      if (bioError || roleError || companyTypeError) {
        return; // Validation will show inline errors
      }
      
      setStep(2);
    } else {
      // Validate step 2
      const cityError = validateCity(city);
      const countryError = validateCountry(country);
      
      if (cityError || countryError) {
        return; // Validation will show inline errors
      }

      // Save profile data
      if (userType === 'creative') {
        setCreativeProfile({
          bio,
          role: selectedRole as any,
          location: {
            city,
            country,
          },
          skills: [],
          subscriptionTier: 'free',
        });
      } else {
        setCompanyProfile({
          bio,
          companyType: selectedCompanyType as any,
          location: {
            city,
            country,
          },
          expertise: [],
          subscriptionTier: 'free',
        });
      }
      
      // Mark as onboarded and navigate to main app
      setOnboarded(true);
      router.replace('/(tabs)');
    }
  };
  
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepDescription}>
        This helps others understand who you are and what you do
      </Text>
      
      <Input
        label="Bio"
        placeholder="Write a short bio..."
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        validate={validateBio}
        containerStyle={styles.inputContainer}
        inputStyle={styles.bioInput}
      />
      
      {userType === 'creative' ? (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>What is your role?</Text>
          <ScrollView style={styles.selectionList}>
            {CREATIVE_ROLES.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.selectionItem,
                  selectedRole === role.id && styles.selectedItem
                ]}
                onPress={() => setSelectedRole(role.id)}
              >
                <Text 
                  style={[
                    styles.selectionItemText,
                    selectedRole === role.id && styles.selectedItemText
                  ]}
                >
                  {role.label}
                </Text>
                {selectedRole === role.id && (
                  <ChevronRight size={20} color={colors.white} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>What type of company are you?</Text>
          <ScrollView style={styles.selectionList}>
            {COMPANY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.selectionItem,
                  selectedCompanyType === type.id && styles.selectedItem
                ]}
                onPress={() => setSelectedCompanyType(type.id)}
              >
                <Text 
                  style={[
                    styles.selectionItemText,
                    selectedCompanyType === type.id && styles.selectedItemText
                  ]}
                >
                  {type.label}
                </Text>
                {selectedCompanyType === type.id && (
                  <ChevronRight size={20} color={colors.white} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
  
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Where are you located?</Text>
      <Text style={styles.stepDescription}>
        This helps connect you with nearby opportunities
      </Text>
      
      <Input
        label="City"
        placeholder="Enter your city"
        value={city}
        onChangeText={setCity}
        validate={validateCity}
        containerStyle={styles.inputContainer}
      />
      
      <Input
        label="Country"
        placeholder="Enter your country"
        value={country}
        onChangeText={setCountry}
        validate={validateCountry}
        containerStyle={styles.inputContainer}
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Why we need this information</Text>
        <Text style={styles.infoText}>
          Your location helps us connect you with relevant opportunities and collaborators in your area. 
          You can always update this information later in your profile settings.
        </Text>
      </View>
    </View>
  );
  
  const isNextDisabled = () => {
    if (step === 1) {
      if (userType === 'creative') {
        return !bio || !selectedRole || validateBio(bio) !== null;
      } else {
        return !bio || !selectedCompanyType || validateBio(bio) !== null;
      }
    } else {
      return !city || !country || validateCity(city) !== null || validateCountry(country) !== null;
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Complete Your Profile',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(step / 2) * 100}%` }]} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
      
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            title="Back"
            onPress={() => setStep(step - 1)}
            variant="outline"
            style={styles.backButton}
          />
        )}
        
        <Button
          title={step === 2 ? "Finish" : "Next"}
          onPress={handleNext}
          disabled={isNextDisabled()}
          style={[styles.nextButton, step === 1 && styles.fullWidthButton]}
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
  progressContainer: {
    height: 4,
    backgroundColor: colors.gray[200],
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  selectionList: {
    maxHeight: 300,
  },
  selectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectionItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedItemText: {
    color: colors.white,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: colors.gray[100],
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[600],
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: 12,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
});