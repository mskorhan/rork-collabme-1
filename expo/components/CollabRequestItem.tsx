import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { Clock, DollarSign, Handshake, X } from 'lucide-react-native';
import { CollabRequest } from '@/mocks/collabRequests';
import { UserProfile } from '@/types';

interface CollabRequestItemProps {
  request: CollabRequest;
  fromUser: UserProfile;
  onAccept: (requestId: string) => void;
  onDeny: (requestId: string) => void;
  onPress: () => void;
}

export default function CollabRequestItem({ 
  request, 
  fromUser, 
  onAccept, 
  onDeny, 
  onPress 
}: CollabRequestItemProps) {
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return colors.green[500];
      case 'denied':
        return colors.red[500];
      default:
        return colors.gray[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'denied':
        return 'Denied';
      default:
        return 'Pending';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: fromUser.avatar || 'https://via.placeholder.com/40' }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{fromUser.name}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(request.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {getStatusText(request.status)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{request.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {request.description}
        </Text>
        
        <View style={styles.details}>
          {request.budget && (
            <View style={styles.detailItem}>
              <DollarSign size={14} color={colors.gray[600]} />
              <Text style={styles.detailText}>{request.budget}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Clock size={14} color={colors.gray[600]} />
            <Text style={styles.detailText}>{request.timeline}</Text>
          </View>
        </View>
      </View>

      {request.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => onDeny(request.id)}
            activeOpacity={0.7}
          >
            <X size={16} color={colors.red[600]} />
            <Text style={[styles.actionButtonText, styles.denyButtonText]}>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => onAccept(request.id)}
            activeOpacity={0.7}
          >
            <Handshake size={16} color={colors.white} />
            <Text style={[styles.actionButtonText, styles.acceptButtonText]}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.gray[500],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  denyButton: {
    backgroundColor: colors.red[50],
    borderWidth: 1,
    borderColor: colors.red[200],
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: colors.white,
  },
  denyButtonText: {
    color: colors.red[600],
  },
});