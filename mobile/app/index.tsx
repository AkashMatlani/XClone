import { View, Text, Button } from 'react-native'
import React from 'react'
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router';

const HomeScreen = () => {
    const { signOut } = useClerk();
    const router = useRouter();
    return (
        <View>
            <Text>Home Screen</Text>
            <Button title='Logout' onPress={async () => {
                await signOut();
                router.replace('/(auth)');
            }}></Button>
        </View>
    )
}

export default HomeScreen;