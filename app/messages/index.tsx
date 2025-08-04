import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';
import ConversationItem from '@/components/ConversationItem';
import CollabRequestItem from '@/components/CollabRequestItem';
import { mockConversations, mockMessages } from '@/mocks/conversations';
import { mockUsers } from '@/mocks/users';
import { mockCollabRequests, CollabRequest } from '@/mocks/collabRequests';
import { UserProfile } from '@/types';

type TabType = 'messages' | 'collab';

export default function MessagesScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  
  useEffect(() => {
    if (tab === 'collab') {
      setActiveTab('collab');
    }
  }, [tab]);

  const getOtherUserInConversation = (conversationId: string, currentUserId: string): UserProfile => {
    const conversation = mockConversations.find(c => c.id === conversationId);
    if (!conversation) return mockUsers[0];
    
    const otherUserId = conversation.participants.find((id: string) => id !== currentUserId);
    return mockUsers.find(user => user.id === otherUserId) || mockUsers[0];
  };

  const getUnreadMessageCount = (conversationId: string, currentUserId: string): number => {
    return mockMessages.filter(
      m => m.conversationId === conversationId && 
           m.receiverId === currentUserId && 
           !m.readAt
    ).length;
  };

  const handleBackPress = () => {
    // Always go back to the home tab
    router.replace('/(tabs)/');
  };

  const renderTabButton = (tab: TabType, title: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderMessagesTab = () => (
    <View style={styles.messagesTabContainer}>
      <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            otherUser={getOtherUserInConversation(item.id, '1')} // '1' is the current user ID
            unreadCount={getUnreadMessageCount(item.id, '1')}
            onPress={() => router.push(`/messages/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
            </View>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start connecting with creatives and companies to begin collaborating</Text>
          </View>
        }
      />
    </View>
  );

  const handleAcceptCollab = (requestId: string) => {
    console.log('Accepting collab request:', requestId);
    // TODO: Implement API call to accept collaboration
  };

  const handleDenyCollab = (requestId: string) => {
    console.log('Denying collab request:', requestId);
    // TODO: Implement API call to deny collaboration
  };

  const handleCollabPress = (request: CollabRequest) => {
    console.log('Opening collab request:', request.id);
    // TODO: Navigate to collab request detail page
  };

  const pendingRequests = mockCollabRequests.filter(req => req.status === 'pending');
  const deniedRequests = mockCollabRequests.filter(req => req.status === 'denied');

  const renderCollabTab = () => (
    <View style={styles.collabTabContainer}>
      <FlatList
        data={[
          { type: 'section', title: 'Pending Requests', requests: pendingRequests },
          { type: 'section', title: 'Denied Requests', requests: deniedRequests },
        ]}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={({ item }) => (
          <View style={styles.collabSection}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.requests.length > 0 ? (
              <FlatList
                data={item.requests}
                keyExtractor={(request) => request.id}
                renderItem={({ item: request }) => {
                  const fromUser = mockUsers.find(user => user.id === request.fromUserId) || mockUsers[0];
                  return (
                    <CollabRequestItem
                      request={request}
                      fromUser={fromUser}
                      onAccept={handleAcceptCollab}
                      onDeny={handleDenyCollab}
                      onPress={() => handleCollabPress(request)}
                    />
                  );
                }}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Text style={styles.emptyIcon}>
                    {item.title.includes('Pending') ? '🤝' : '❌'}
                  </Text>
                </View>
                <Text style={styles.emptyText}>
                  No {item.title.toLowerCase()}
                </Text>
                <Text style={styles.emptySubtext}>
                  {item.title.includes('Pending') 
                    ? 'New collaboration requests will appear here'
                    : 'Denied collaboration requests will appear here'
                  }
                </Text>
              </View>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          headerBackVisible: false
        }}
      />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {renderTabButton('messages', 'Messages')}
        {renderTabButton('collab', 'Collab Requests')}
      </View>
      
      {/* Tab Content */}
      {activeTab === 'messages' ? renderMessagesTab() : renderCollabTab()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  backButton: {
    padding: 8,
  },
  messagesTabContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[600],
  },
  activeTabButtonText: {
    color: colors.primary,
    fontWeight: '700',
  },
  collabTabContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  collabSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
});