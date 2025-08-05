import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar, Building2, CheckCircle } from 'lucide-react-native';
import Button from '@/components/Button';
import BackButton from '@/components/BackButton';
import { mockJobs } from '@/mocks/jobs';
import { mockCompanies } from '@/mocks/users';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [hasApplied, setHasApplied] = useState(false);
  
  const job = mockJobs.find(j => j.id === id);
  const company = job ? mockCompanies.find(c => c.id === job.companyId) : null;
  
  if (!job || !company) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        
        {/* Custom Header with Back Button */}
        <View style={styles.customHeader}>
          <BackButton fallbackUrl="/jobs" />
          <Text style={styles.customHeaderTitle}>Job Not Found</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Job not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButtonStyle}
          />
        </View>
      </View>
    );
  }

  const handleApply = () => {
    if (hasApplied) {
      Alert.alert('Already Applied', 'You have already applied to this job.');
      return;
    }

    Alert.alert(
      'Apply for Job',
      `Are you sure you want to apply for ${job.title} at ${company.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Apply',
          onPress: () => {
            setHasApplied(true);
            Alert.alert('Application Sent', 'Your application has been submitted successfully!');
          },
        },
      ]
    );
  };

  const handleCompanyPress = () => {
    router.push(`/profile/${company.id}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Custom Header with Back Button */}
      <View style={styles.customHeader}>
        <BackButton fallbackUrl="/jobs" />
        <Text style={styles.customHeaderTitle}>{job.title}</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Company Header */}
        <TouchableOpacity style={styles.companyHeader} onPress={handleCompanyPress}>
          <Image source={{ uri: company.avatar }} style={styles.companyLogo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.gray[500]} />
              <Text style={styles.locationText}>
                {job.location.city}, {job.location.country}
                {job.location.remote && ' • Remote'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Job Title */}
        <View style={styles.titleSection}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.gray[500]} />
              <Text style={styles.metaText}>{job.type}</Text>
            </View>
            {job.salary && (
              <View style={styles.metaItem}>
                <DollarSign size={16} color={colors.gray[500]} />
                <Text style={styles.metaText}>{job.salary}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Users size={16} color={colors.gray[500]} />
              <Text style={styles.metaText}>{job.applicants.length} applicants</Text>
            </View>
          </View>
          <View style={styles.postedDate}>
            <Calendar size={16} color={colors.gray[400]} />
            <Text style={styles.postedText}>Posted {job.postedAt}</Text>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <CheckCircle size={16} color={colors.primary} />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        {/* Company Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {company.name}</Text>
          <Text style={styles.description}>{company.bio}</Text>
          <View style={styles.companyStats}>
            <View style={styles.statItem}>
              <Building2 size={16} color={colors.gray[500]} />
              <Text style={styles.statText}>{company.companyType?.replace('_', ' ')}</Text>
            </View>
            <View style={styles.statItem}>
              <MapPin size={16} color={colors.gray[500]} />
              <Text style={styles.statText}>{company.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.applyContainer}>
        <Button
          title={hasApplied ? 'Applied' : 'Apply Now'}
          onPress={handleApply}
          disabled={hasApplied}
          style={[styles.applyButton, hasApplied && styles.appliedButton]}
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
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  backButtonStyle: {
    marginTop: 20,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  titleSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '500',
  },
  postedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  postedText: {
    fontSize: 12,
    color: colors.gray[400],
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    flex: 1,
  },
  companyStats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  bottomPadding: {
    height: 100,
  },
  applyContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    backgroundColor: colors.white,
  },
  applyButton: {
    width: '100%',
  },
  appliedButton: {
    backgroundColor: colors.gray[300],
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
});