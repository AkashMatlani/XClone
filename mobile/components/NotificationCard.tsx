import { View, Text } from 'react-native'
import React from 'react'
import { useNotification } from '@/hooks/useNotification';
import { Notification } from '@/types';
import { Feather } from '@expo/vector-icons';

interface NotificationCardProps {
    notification: Notification;
    onDelete: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onDelete }: NotificationCardProps) => {

    const { } = useNotification();

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
        return (
            <View>
                <Text>NotificationCard</Text>
            </View>
        )
    }

    export default NotificationCard