import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Job, CompanyProfile } from '@/types';
import { colors } from '@/constants/colors';
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
          <Briefcase size={18} color={colors.primary} style={styles.icon} />
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        </View>
        
        <Text style={styles.company}>{job.company.name}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        {job.location && (
          <View style={styles.detailRow}>
            <MapPin size={16} color={colors.gray[500]} style={styles.detailIcon} />
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
            <Clock size={14} color={daysLeft > 3 ? colors.gray[500] : colors.error} />
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
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  company: {
    fontSize: 16,
    color: colors.gray[700],
    marginLeft: 26,
  },
  detailsContainer: {
    marginBottom: 12,
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
    fontSize: 14,
    color: colors.gray[600],
  },
  compensation: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.success,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  postedDate: {
    fontSize: 12,
    color: colors.gray[500],
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: colors.gray[500],
    marginLeft: 4,
  },
  urgentDeadline: {
    color: colors.error,
    fontWeight: '500',
  },
  applicantsContainer: {
    marginTop: 8,
  },
  applicantsText: {
    fontSize: 12,
    color: colors.gray[500],
  },
});

export default JobCard;