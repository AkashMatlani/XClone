import { View, Text, Modal, TouchableOpacity } from 'react-native'
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
        <Modal visible={!!seletedPost} animationType='slide' presentationStyle='pageSheet'   >
            <View className='flex-row items-center justify-between px-4  py-3 border-b border-gray-100'>
                <TouchableOpacity onPress={handleClose}>
                    <Text className='text-blue-500 text-lg'>Close</Text>
                </TouchableOpacity>
                <Text className='text-lg font-semibold'>Comments</Text>
                <View className='w-12'></View>
            </View>
        </Modal>
    )
}

export default CommentsModal