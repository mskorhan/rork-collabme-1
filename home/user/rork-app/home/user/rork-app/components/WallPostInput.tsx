import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Image, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { Send, Image as ImageIcon, Video, Music, FileText, Smile, AtSign } from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface WallPostInputProps {
  onPost: (content: { text: string; type: 'text' | 'photo' | 'video' | 'audio' | 'pdf'; media?: string }) => void;
  placeholder?: string;
}

const WallPostInput: React.FC<WallPostInputProps> = ({
  onPost,
  placeholder = "Any new work recently?"
}) => {
  const [postText, setPostText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{uri: string, type: 'photo' | 'video' | 'audio' | 'pdf'} | null>(null);
  const currentUser = mockUsers[0]; // Current user

  const handlePost = () => {
    if (!postText.trim() && !selectedMedia) {
      Alert.alert('Error', 'Please add some content to your post');
      return;
    }

    // Post with media or text
    onPost({
      text: postText,
      type: selectedMedia ? selectedMedia.type : 'text',
      media: selectedMedia?.uri,
    });

    // Reset state
    setPostText('');
    setSelectedMedia(null);
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: currentUser.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }}
          style={styles.avatar}
        />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userHandle}>@{currentUser.username}</Text>
        </View>
      </View>
      
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          value={postText}
          onChangeText={setPostText}
          multiline
          maxLength={500}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlignVertical="top"
        />
      </View>
      
      {/* Selected Media Preview */}
      {selectedMedia && (
        <View style={styles.mediaPreview}>
          {selectedMedia.type === 'photo' && (
            <Image source={{ uri: selectedMedia.uri }} style={styles.previewImage} />
          )}
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaType}>{selectedMedia.type.toUpperCase()} selected</Text>
            <TouchableOpacity onPress={() => setSelectedMedia(null)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.mediaButtons}>
          <TouchableOpacity style={styles.mediaButton} onPress={async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
                return;
              }
              
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
              
              if (!result.canceled && result.assets && result.assets[0]) {
                setSelectedMedia({
                  uri: result.assets[0].uri,
                  type: 'photo'
                });
                Alert.alert('Success', 'Image selected!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to select image');
            }
          }}>
            <ImageIcon size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permissions to upload videos.');
                return;
              }
              
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                videoMaxDuration: 60,
                quality: 1,
              });
              
              if (!result.canceled && result.assets && result.assets[0]) {
                setSelectedMedia({
                  uri: result.assets[0].uri,
                  type: 'video'
                });
                Alert.alert('Success', 'Video selected!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to select video');
            }
          }}>
            <Video size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
              });
              
              if (!result.canceled && result.assets && result.assets[0]) {
                setSelectedMedia({
                  uri: result.assets[0].uri,
                  type: 'audio'
                });
                Alert.alert('Success', 'Audio file selected!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to select audio file');
            }
          }}>
            <Music size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
              });
              
              if (!result.canceled && result.assets && result.assets[0]) {
                setSelectedMedia({
                  uri: result.assets[0].uri,
                  type: 'pdf'
                });
                Alert.alert('Success', 'Document selected!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to select document');
            }
          }}>
            <FileText size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={() => {
            Alert.alert('Add Emoji', 'Emoji picker coming soon!');
          }}>
            <Smile size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton} onPress={() => {
            Alert.alert('Mention User', 'User mention feature coming soon!');
          }}>
            <AtSign size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.postButton,
            (postText.trim().length > 0 || selectedMedia) ? styles.postButtonActive : styles.postButtonInactive
          ]} 
          onPress={handlePost}
          disabled={!postText.trim() && !selectedMedia}
        >
          <Text style={[
            styles.postButtonText,
            (postText.trim().length > 0 || selectedMedia) ? styles.postButtonTextActive : styles.postButtonTextInactive
          ]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    color: colors.gray[500],
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputContainerFocused: {
    // Add focused styles if needed
  },
  textInput: {
    fontSize: 18,
    color: colors.text,
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[200],
  },
  mediaButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  postButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  postButtonActive: {
    backgroundColor: colors.primary,
  },
  postButtonInactive: {
    backgroundColor: colors.gray[200],
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postButtonTextActive: {
    color: colors.white,
  },
  postButtonTextInactive: {
    color: colors.gray[500],
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.gray[50],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.gray[200],
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mediaInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mediaType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.red[100],
    borderRadius: 12,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.red[600],
  },
});

export default WallPostInput;