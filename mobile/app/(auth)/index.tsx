import { Image, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";

export default function Index() {

  const isLoading = false;
  return <View className="flex-1 bg-white">
    <View className="flex-1 px-8 justify-between">
      <View className="flex-1 justify-center">
        {/* Image */}
        <View className="items-center">
          <Image source={require("../../assets/images/auth1.png")}
            className="size-96"
            resizeMode="contain"></Image>
        </View>

        <View className="flex-col gap-2">
          {/* Google button */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300  rounded-full py-3 px-6"
            onPress={() => { }}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2, //only in android
            }}
          >
            {isLoading ? (<ActivityIndicator size="small" color="#4285F4"></ActivityIndicator>
            ) : (<View className="flex-row items-center justify-center">
              <Image source={require("../../assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"></Image>

              <Text className="text-black font-medium text-base">Continue with Google</Text>
            </View>)}

          </TouchableOpacity>

          {/* Apple Sign in Icon */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300  rounded-full py-3 px-6"
            onPress={() => { }}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2, //only in android
            }}
          >
            {isLoading ? (<ActivityIndicator size="small" color="#000"></ActivityIndicator>
            ) : (
              <View className="flex-row items-center justify-center">
                <Image source={require("../../assets/images/apple.png")}
                  className="size-8 mr-3"
                  resizeMode="contain"></Image>

                <Text className="text-black font-medium text-base">Continue with Apple</Text>

              </View>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </View>
  </View>
}
