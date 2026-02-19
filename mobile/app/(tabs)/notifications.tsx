import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { use } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNotification } from '@/hooks/useNotification';
import { Feather } from '@expo/vector-icons';
import NoNotificationFound from '@/components/NoNotificationFound';
import { Notification } from '@/types';
import NotificationCard from '@/components/NotificationCard';

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
        <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
            <View className='flex-row justify-between items-center px-4 py-2 border-b border-gray-100'>
                <Text className='text-xl font-bold p-4'>Notifications</Text>
                <TouchableOpacity>
                    <Feather name="settings" size={24} color="#657786" />
                </TouchableOpacity>
            </View>

            {/* Conent */}
            <ScrollView className='flex-1'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={"#1DA1F2"}
                />
                }
            >
                {
                    isLoading ?
                        (
                            <View className='flex-1 items-center justify-center p-8'>
                                <ActivityIndicator size='large' color='#1DA1F2'>
                                </ActivityIndicator>
                                <Text className='text-gray-900 mt-4'>Loading notifications...</Text>
                            </View>
                        )
                        : notifications.length === 0 ? NoNotificationFound() : (
                            notifications.map((notification: Notification) => (
                                <NotificationCard
                                    key={notification._id}
                                    notification={notification}
                                    onDelete={() => deleteNotification(notification._id)}
                                />
                            ))
                        )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationScreen