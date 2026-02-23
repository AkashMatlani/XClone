import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import SignOutButton from '@/components/SignOutButton'

const ProfileScreen = () => {
  const { currentUser, isLoading } = useCurrentUser();
  const insets = useSafeAreaInsets();

  if (isLoading) {
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

      <ScrollView className='flex-1'
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}>
        <Image source={{ uri: currentUser.profilePicture || 'https://via.placeholder.com/150' }}
          className='w-full h-48'
          resizeMode='cover'
        />
        <View className='px-4 pb-4 border-b border-gray-100'>

          <View className='flex-row justify-between items-end -mt-16 mb-4'>
            <Image source={{ uri: currentUser.profilePicture || 'https://via.placeholder.com/150' }}    
              className='w-32 h-32 rounded-full border-4 border-white'
            />
            <TouchableOpacity className='border border-gray-300 px-6 py-2 rounded-full'>
              <Text className='text-gray-900font-semibold'>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen