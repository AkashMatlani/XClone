import { View, Text } from 'react-native'
import React, { use } from 'react'
import { Post } from '@/types';
import { useComments } from '@/hooks/useComments';


interface CommentsModalProps {
    seletedPost: Post;
    onClose: () => void;
}
const CommentsModal = ({seletedPost, onClose}: CommentsModalProps) => {

    const {comentText,setCommentText,createComment,isCreatingComment} = useComments();
  return (
    <View>
      <Text>CommentsModal</Text>
    </View>
  )
}

export default CommentsModal