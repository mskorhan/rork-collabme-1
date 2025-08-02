import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Job, CompanyProfile } from '@/types';
import { theme } from '@/constants/theme';
import { MapPin, Clock, Briefcase } from 'lucide-react-native';

interface JobCardProps {
  job: Job;
  company?: CompanyProfile;
  onPress: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  company,
  onPress,
}) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate days left until deadline
  const getDaysLeft = () => {
    if (!job.deadline) return null;
    
    const now = new Date();
    const deadline = new Date(job.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysLeft = getDaysLeft();
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Briefcase size={18} color={theme.colors.primary500} style={styles.icon} />
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        </View>
        
        <Text style={styles.company}>{job.company.name}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        {job.location && (
          <View style={styles.detailRow}>
            <MapPin size={16} color={theme.colors.neutral500} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {job.location.city}
              {job.location.city && job.location.country ? `, ${job.location.country}` : job.location.country}
              {job.location.remote ? ' (Remote)' : ''}
            </Text>
          </View>
        )}
        
        {job.compensation && (
          <View style={styles.detailRow}>
            <Text style={styles.compensation}>{job.compensation}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.postedDate}>Posted {formatDate(job.createdAt)}</Text>
        
        {daysLeft !== null && (
          <View style={styles.deadlineContainer}>
            <Clock size={14} color={daysLeft > 3 ? theme.colors.neutral500 : theme.colors.error600} />
            <Text 
              style={[
                styles.deadline, 
                daysLeft <= 3 && styles.urgentDeadline
              ]}
            >
              {daysLeft === 0 ? 'Closing today' : `${daysLeft} days left`}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.applicantsContainer}>
        <Text style={styles.applicantsText}>
          {job.applicants?.length || 0} {(job.applicants?.length || 0) === 1 ? 'applicant' : 'applicants'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    marginBottom: theme.spacing.sm + theme.spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600' as const,
    color: theme.colors.text,
    flex: 1,
  },
  company: {
    fontSize: theme.fontSize.md,
    color: theme.colors.neutral700,
    marginLeft: 26,
  },
  detailsContainer: {
    marginBottom: theme.spacing.sm + theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.neutral600,
  },
  compensation: {
    fontSize: theme.fontSize.base,
    fontWeight: '500' as const,
    color: theme.colors.success600,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm + theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral200,
  },
  postedDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.neutral500,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.neutral500,
    marginLeft: theme.spacing.xs,
  },
  urgentDeadline: {
    color: theme.colors.error600,
    fontWeight: '500' as const,
  },
  applicantsContainer: {
    marginTop: theme.spacing.sm,
  },
  applicantsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.neutral500,
  },
});

export default JobCard;