import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
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
            {seletedImages && (
                <View className='mt-3 ml-15'>
                    <View className='relative'>
                        <Image source={{ uri: seletedImages }}
                            className='w-full h-48 rounded-2xl'
                            resizeMode='cover' />
                        <TouchableOpacity
                            className='absolute top-2  right-2 w-8 h-8 bg-black bg-opacity-60 rounded-full items-center justify-center'
                            onPress={removeImage}
                        >
                            <Feather name='x' size={16} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View className='flex-row justify-between items-center mt-3'>
                <View className='flex-row'>
                    <TouchableOpacity className='mr-4' onPress={pickImageFromGallery}>
                        <Feather name='image' size={20} color='#1DA1F2' />
                    </TouchableOpacity>
                    <TouchableOpacity className='mr-4' onPress={takePhoto}>
                        <Feather name='camera' size={20} color='#1DA1F2' />
                        </TouchableOpacity>
                        </View>
                </View>
        </View>
    )
}

export default PostComposer