import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
  const [newMessage, setNewMessage] = useState("");


  const deleteConversation = (conversationId: number) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete this Conversation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => { setConversationList((prev) => prev.filter((conv) => conv.id !== conversationId)) }
      },

    ]);
  };

  const openConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  }

  const closeChatModel = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    setNewMessage("");
  }

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      //update last message in conversation

      setConversationList((prev) => prev.map((conv) =>
        conv.id === selectedConversation.id ?
          { ...conv, lastMessage: newMessage, time: "now" }
          : conv));

      setNewMessage("");
      Alert.alert("Message Sent!", `Your Message sent to ${setSelectedConversation.name}`);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white' >
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

      {/* Conversations List */}
      <ScrollView className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        {
          conversationList.map(conversation => (
            <TouchableOpacity key={conversation.id}
              className='flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50'
              onPress={() => openConversation(conversation)}
              onLongPress={() => deleteConversation(conversation.id)}
            >
              <Image source={{ uri: conversation.user.avatar }}
                className='size-12 rounded-full mr-3'></Image>

              <View className='flex-1'>
                <View className='flex-row items-center justify-between mb-1'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='font-semibold text-gray-900'>{conversation.user.name}</Text>
                    {conversation.user.verified && (<Feather name='check-circle' size={16} color="#1DA1F2" className='ml-1'>
                    </Feather>)}
                    <Text className='text-gray-500 text-sm ml-1'>@{conversation.user.username}</Text>
                  </View>
                  <Text className='text-gray-500 text-sm '>{conversation.time}</Text>
                </View>
                <Text className='text-sm text-gray-500' numberOfLines={1}>{conversation.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          )
          )}
      </ScrollView>

    </SafeAreaView>
  )
}

export default MessagesScreen