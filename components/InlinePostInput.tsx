import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { Camera, Image as ImageIcon, Music, FileText, Send } from 'lucide-react-native';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

interface InlinePostInputProps {
  onPost: (content: { text: string; type: 'text' | 'photo' | 'video' | 'audio' | 'pdf'; media?: string }) => void;
  placeholder?: string;
}

export const InlinePostInput: React.FC<InlinePostInputProps> = ({
  onPost,
  placeholder = "Any new work recently?"
}) => {
  const [postText, setPostText] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'photo' | 'video' | 'audio' | 'pdf' | null>(null);

  const handlePost = () => {
    if (!postText.trim() && !selectedMediaType) {
      Alert.alert('Error', 'Please add some content to your post');
      return;
    }

    try {
      onPost({
        text: postText,
        type: selectedMediaType || 'text',
        media: selectedMediaType ? `https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60` : undefined
      });

      // Reset state
      setPostText('');
      setSelectedMediaType(null);
      setShowMediaModal(false);
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  const handleMediaSelect = async (type: 'photo' | 'video' | 'audio' | 'pdf') => {
    try {
      if (type === 'photo') {
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
        
        if (!result.canceled) {
          setSelectedMediaType(type);
        }
      } else if (type === 'video') {
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
        
        if (!result.canceled) {
          setSelectedMediaType(type);
        }
      } else if (type === 'audio') {
        const result = await DocumentPicker.getDocumentAsync({
          type: 'audio/*',
          copyToCacheDirectory: true,
        });
        
        if (!result.canceled) {
          setSelectedMediaType(type);
        }
      } else if (type === 'pdf') {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          copyToCacheDirectory: true,
        });
        
        if (!result.canceled) {
          setSelectedMediaType(type);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select media');
    }
    
    setShowMediaModal(false);
  };

  const showPostButton = () => {
    setShowMediaModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor={colors.gray[400]}
            value={postText}
            onChangeText={setPostText}
            multiline
            maxLength={500}
          />
          
          {selectedMediaType && (
            <View style={styles.selectedMediaContainer}>
              <Text style={styles.selectedMediaText}>
                {selectedMediaType.charAt(0).toUpperCase() + selectedMediaType.slice(1)} selected
              </Text>
              <TouchableOpacity onPress={() => setSelectedMediaType(null)}>
                <Text style={styles.removeMediaText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.postButton,
            (postText.trim() || selectedMediaType) && styles.postButtonActive
          ]} 
          onPress={postText.trim() || selectedMediaType ? handlePost : showPostButton}
        >
          <Send 
            size={20} 
            color={(postText.trim() || selectedMediaType) ? colors.white : colors.gray[400]} 
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMediaModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMediaModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowMediaModal(false)}
        >
          <View style={styles.mediaModal}>
            <Text style={styles.mediaModalTitle}>Add to your post</Text>
            
            <View style={styles.mediaOptions}>
              <TouchableOpacity
                style={styles.mediaOption}
                onPress={() => handleMediaSelect('photo')}
              >
                <ImageIcon size={24} color={colors.primary} />
                <Text style={styles.mediaOptionText}>Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaOption}
                onPress={() => handleMediaSelect('video')}
              >
                <Camera size={24} color={colors.primary} />
                <Text style={styles.mediaOptionText}>Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaOption}
                onPress={() => handleMediaSelect('audio')}
              >
                <Music size={24} color={colors.primary} />
                <Text style={styles.mediaOptionText}>Audio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mediaOption}
                onPress={() => handleMediaSelect('pdf')}
              >
                <FileText size={24} color={colors.primary} />
                <Text style={styles.mediaOptionText}>Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: 'flex-end',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  textInput: {
    fontSize: 16,
    color: colors.text,
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  selectedMediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  selectedMediaText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  removeMediaText: {
    fontSize: 14,
    color: colors.error,
  },
  postButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonActive: {
    backgroundColor: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaModal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 280,
  },
  mediaModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  mediaOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.gray[50],
    width: '48%',
    marginBottom: 12,
  },
  mediaOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});

export default InlinePostInput;