import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { CONVERSATIONS, ConversationType } from '@/data/conversations';
import { Feather } from '@expo/vector-icons';

const MessagesScreen = () => {

  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [conversationList, setConversationList] = useState(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("")

  return (
    <SafeAreaView className='flex-1'>
      {/* Header Componenet */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-900'>Messages</Text>
        <TouchableOpacity>
          <Feather name='edit' size={24} color="#1DA1F2"></Feather>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className='px-4 py-3 border-b border-gray-100'>
        <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-3'>
          <Feather name='search' size={20} color="#657786"></Feather>
          <TextInput placeholder='Search for people and groups'
          className='flex-1 ml-3 text-base'
          placeholderTextColor="#657786"
          value={searchText}
          onChangeText={setSearchText}></TextInput>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MessagesScreen