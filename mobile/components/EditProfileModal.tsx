import { View, Text, Modal, TouchableOpacity, ActivityIndicator, ScrollView, TextInput } from 'react-native'
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
                <Text className='text-lg font-semibold'>Edit Profile</Text>
                <TouchableOpacity
                    onPress={saveProfile}
                    disabled={isUpdating}
                    className={`${isUpdating ? 'opacity-50' : ''}`}
                >
                    {isUpdating ? (<ActivityIndicator size="small" color="#1DA1F2" />
                    )
                        :
                        (<Text className='text-blue-500 text-lg font-semibold'>Save</Text>)}
                </TouchableOpacity>
            </View>
            <ScrollView className='flex-1 px-4 py-6'>
                <View className='space-y-4'>
                    <View>
                        <Text className='text-sm text-gray-500 mb-2'>First Name</Text>
                        <TextInput
                            value={formData.firstName}
                            onChangeText={(text) => updateFormField('firstName', text)}
                            className='border border-gray-200 rounded-lg px-3 py-3 text-base'
                            placeholder='Your first name'
                        />
                    </View>
                    <View>
                        <Text className='text-sm text-gray-500 mb-2'>Last Name</Text>
                        <TextInput
                            value={formData.lastName}
                            onChangeText={(text) => updateFormField('lastName', text)}
                            className='border border-gray-200 rounded-lg px-3 py-3 text-base'
                            placeholder='Your last name'
                        />
                    </View>
                    <View>
                        <Text className='text-sm text-gray-500 mb-2'>Bio</Text>
                        <TextInput
                            value={formData.bio}
                            onChangeText={(text) => updateFormField('bio', text)}
                            className='border border-gray-200 rounded-lg px-3 py-3 text-base'
                            placeholder='Tell us about yourself'
                            multiline
                            numberOfLines={3}
                            textAlignVertical='top'
                        />
                    </View>
                    <View>
                        <Text className='text-sm text-gray-500 mb-2'>Location</Text>
                        <TextInput
                            value={formData.location}
                            onChangeText={(text) => updateFormField('location', text)}
                            className='border border-gray-200 rounded-lg px-3 py-3 text-base'
                            placeholder='Whwere are you located?'
                        />
                    </View>
                </View>
            </ScrollView>
        </Modal>
    )
}

export default EditProfileModal