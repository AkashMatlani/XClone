import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useUser } from '@clerk/clerk-expo'
import { useCreatePost } from '@/hooks/useCreatePost'

const PostComposer = () => {

    const {
        content,
        setContent,
        seletedImages,
        isCreating,
        pickImageFromGallery,
        takePhoto,
        removeImage,
        createPost,
    } = useCreatePost();

    const { user } = useUser();
    return (
        <View className='border-b border-gray-100 p-4 bg-white'>
            <View className='flex-row'>
                <Image source={{ uri: user?.imageUrl }} className='w-12 h-12  rounded-full mr-3' />
                <View className='flex-1'>
                    <TextInput className='text-gray-900 text-lg'
                        placeholder='What is happening?'
                        placeholderTextColor='#657786'
                        multiline
                        value={content}
                        onChangeText={setContent}
                        maxLength={280}
                    />
                </View>
            </View>
        </View>
    )
}

export default PostComposer