import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { use } from 'react'
import { Post } from '@/types';
import { useComments } from '@/hooks/useComments';
import { useCurrentUser } from '@/hooks/useCurrentUser';


interface CommentsModalProps {
    seletedPost: Post;
    onClose: () => void;
}
const CommentsModal = ({ seletedPost, onClose }: CommentsModalProps) => {

    const { comentText, setCommentText, createComment, isCreatingComment } = useComments();

    const { currentUser } = useCurrentUser();

    const handleClose = () => {
        setCommentText('');
        onClose();
    }
    return (
        <Modal visible={!!seletedPost} animationType='slide' presentationStyle='pageSheet'>
            {/* Modal Header */}
            <View className='flex-row items-center justify-between px-4  py-3 border-b border-gray-100'>
                <TouchableOpacity onPress={handleClose}>
                    <Text className='text-blue-500 text-lg'>Close</Text>
                </TouchableOpacity>
                <Text className='text-lg font-semibold'>Comments</Text>
                <View className='w-12'>
                </View>
            </View>
            {seletedPost && (
                <ScrollView className='flex-1'>
                    {/* Orignal Post */}
                    <View className='border-b border-gray-100 bg-white p-4'>
                        <View className='flex-row'>
                            <Image source={{ uri: seletedPost.user.profilePicture }}></Image>
                            <View className='flex-1' >
                                <View className='flex-row items-center mb-1'>
                                    <Text className='font-bold text-gray-900 mr-1'>{seletedPost.user.firstName}
                                        {seletedPost.user.lastName}
                                    </Text>
                                    <Text className='text-gray-500 ml-1'>@{seletedPost.user.username}</Text>
                                </View>

                                {seletedPost.content && (
                                    <Text className='text-gray-900 text-base leading-5 mb-3'>
                                        {seletedPost.content}
                                    </Text>
                                )}

                                {seletedPost.image && (
                                    <Image source={{ uri: seletedPost.image }}
                                        className='w-full h-48 rounded-2xl mb-3' resizeMode='cover'>

                                    </Image>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Comment List */}
                    {seletedPost.comments.map((comment) => (
                        <View key={comment._id} className='border-b border-gray-100 bg-white p-4'>
                            <View className='flex-row'>
                                <Image source={{ uri: comment.user.profilePicture }}
                                    className='w-10 h-10 rounded-full mr-3'></Image>
                            </View>
                            <View className='flex-1'>
                                <View className='flex-row items-center mb-1 '>
                                    <Text className='font-bold text-gray-900 mr-1'>
                                        {comment.user.firstName} {comment.user.firstName}{comment.user.lastName}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </Modal>
    )
}

export default CommentsModal