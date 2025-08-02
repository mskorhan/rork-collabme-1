import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';

import JobCard from '@/components/JobCard';
import FilterBar from '@/components/FilterBar';
import { mockJobs } from '@/mocks/jobs';
import { mockCompanies } from '@/mocks/users';
import { Job, CompanyProfile } from '@/types';

export default function JobsScreen() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'applied'>('all');

  const filters = [
    { id: 'actor', label: 'Actor' },
    { id: 'model', label: 'Model' },
    { id: 'director', label: 'Director' },
    { id: 'producer', label: 'Producer' },
    { id: 'designer', label: 'Designer' },
    { id: 'remote', label: 'Remote' },
  ];

  const getCompanyById = (companyId: string): CompanyProfile | undefined => {
    return mockCompanies.find(company => company.id === companyId);
  };

  const filteredJobs = mockJobs.filter(job => {
    if (activeTab === 'applied') {
      return job.applicants.some(applicantId => applicantId === '1'); // Current user ID
    }
    
    if (selectedFilters.length === 0) {
      return true;
    }
    
    // Check if job matches any selected filter
    // This is a simplified example - in a real app, you'd have more sophisticated filtering
    const jobTitle = job.title.toLowerCase();
    return selectedFilters.some(filter => {
      if (filter === 'remote') {
        return job.location.remote;
      }
      return jobTitle.includes(filter.toLowerCase());
    });
  });

  const handleFilterPress = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter(id => id !== filterId));
    } else {
      setSelectedFilters([...selectedFilters, filterId]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };



  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Jobs',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Jobs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'applied' && styles.activeTab]}
          onPress={() => setActiveTab('applied')}
        >
          <Text style={[styles.tabText, activeTab === 'applied' && styles.activeTabText]}>
            Applied
          </Text>
        </TouchableOpacity>
      </View>
      
      <FilterBar
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterPress={handleFilterPress}
        onClearFilters={clearFilters}
        onFilterIconPress={() => {}}
      />
      
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            company={getCompanyById(item.companyId)}
            onPress={() => router.push(`/job/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'all' ? 'No jobs found' : 'You haven\'t applied to any jobs yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'all' 
                ? 'Try adjusting your filters or check back later'
                : 'Browse available jobs and submit your applications'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[500],
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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