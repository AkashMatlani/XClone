import { View, Text, Alert, Image } from 'react-native'
import React from 'react'
import { Notification } from '@/types';
import { Feather } from '@expo/vector-icons';

interface NotificationCardProps {
    notification: Notification;
    onDelete: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onDelete }: NotificationCardProps) => {

    const getNotificationText = () => {
        const name = `${notification.from.firstName} ${notification.from.lastName}`;
        switch (notification.type) {
            case 'like':
                return `${name} liked your post.`;
            case 'comment':
                return `${name} commented on your post: "${notification.comment?.content}"`;
            case 'follow':
                return `${name} started following you.`;
            default:
                return '';
        }
    }

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'like':
                return <Feather name="heart" size={20} color="#E0245E" />;
            case 'comment':
                return <Feather name="message-circle" size={20} color="#1DA1F2" />;
            case 'follow':
                return <Feather name="user-plus" size={20} color="#17BF63" />;
            default:
                return <Feather name="bell" size={20} color="#657786" />;
        }
    }


    const handleDelete = () => {
        Alert.alert(
            "Delete Notification",
            "Are you sure you want to delete this notification?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: () => onDelete(notification.id),
                style: "destructive"
            }
        ]);
    }

    return (
        <View className='border-b border-gray-100 bg-white'>
            <View className='flex-row p-4'>
                <View className='relative mr-3'>
                    <Image
                        source={{ uri: notification.from.profilePicture }} className='size-12 rounded-full' />
                    <View className='absolute -bottom-1 -right-1 bg-white justify-center items-center'>
                        {getNotificationIcon()}
                    </View>
                </View>
                <View className='flex-1'>
                    <View className='flex-row items-start justify-between mb-1'>
                        <View className='flex-1'>
                            <Text className='font-semibold
                             text-gray-900 leading-5 mb-1'>
                                <Text className='font-semibold text-gray-900'>{notification.from.firstName}
                                    {notification.from.lastName}
                                </Text>
                                <Text className='text-gray-500'>@{notification.from.username}  </Text>
                            </Text>
                            <Text className='text-gray-900'>{getNotificationText()}
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        </View>
    )
}

export default NotificationCard