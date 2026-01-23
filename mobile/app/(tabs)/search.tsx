import { Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'

const SearchScreen = () => {
    const TRENDING_TOPICS = [
        { topic: "#ReactNative", tweets: "125K" },
        { topic: "#TypeScript", tweets: "89K" },
        { topic: "#WebDevelopment", tweets: "234K" },
        { topic: "#AI", tweets: "567K" },
        { topic: "#TechNews", tweets: "98K" },

    ]
    return (
        <SafeAreaView className='flex-1 bg-white' >
            {/* HEADER */}
            <View className='px-4 py-3 border-b border-gray-100'>
                <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-3'>
                    <Feather name='search' size={20} color="#657786" />
                    <TextInput placeholder='Search Twitter'
                        className='flex-1 mt-3 text-base'
                        placeholderTextColor="#657786" />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SearchScreen