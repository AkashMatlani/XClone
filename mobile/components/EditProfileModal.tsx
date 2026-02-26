import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'


interface EditProfileModalProps {
    isVisible: boolean;
    onClose: () => void;    

    formData: {
        firstName: string;
        lastName: string;   
        bio: string;
        location: string;
    };  
    saveProfile: () => void;
    updateFormField: (field: string, value: string) => void;
    isUpdating: boolean;
}
const EditProfileModal = ({ isVisible, onClose, formData, updateFormField, saveProfile, isUpdating }: EditProfileModalProps) => {

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
        <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
                <TouchableOpacity onPress={onClose}>
                    <Text className='text-blue-500 text-lg'>Cancel</Text>
                </TouchableOpacity>
            </View>
    </Modal>
  )
}

export default EditProfileModal