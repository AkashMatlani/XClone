import {  ActivityIndicator, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import SignOutButton from '@/components/SignOutButton'

const ProfileScreen = () => {
  const {currentUser,isLoading}=useCurrentUser();
  const insets=useSafeAreaInsets();

  if(isLoading){  
   return (
   <View className='flex-1 bg-white items-center justify-center'>
    <ActivityIndicator size="large" color="#1DA1F2" />
   </View>
   )
  }

  return (
    <SafeAreaView className='flex-1'>
     {/* Header */}
     <View className='flex-row items-center justify-between px-4 py-2 border-b border-gray-100'>
      <View>
        <Text className='text-xl font-bold text-gray-900'>{currentUser.firstName} {currentUser.lastName}
        </Text>
        <Text className='text-sm text-gray-500'>3 Posts</Text>
      </View>
      <SignOutButton />
     </View>
    </SafeAreaView>
  )
}

export default ProfileScreen