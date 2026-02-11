import { Text, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotification } from '@/hooks/useNotification';

const NotificationScreen = () => {

    const { notifications, isLoading, error, refetch, isRefetching, deleteNotification, isDeletingNotification } = useNotification();
    const insets = useSafeAreaInsets();

    if (error) {
        return (
            <View className='flex-1 items-center justify-center p-8'>
                <Text className='text-gray-500'>Failed to load notifications</Text>
                <TouchableOpacity onPress={() => refetch()} className='bg-blue-500  px-4 py-2 rounded-lg'>
                    <Text className='text-white font-semibold'>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <SafeAreaView className='flex-1'>
            <Text>NotificationScreen</Text>
        </SafeAreaView>
    )
}

export default NotificationScreen