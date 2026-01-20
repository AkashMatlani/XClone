import { Image, TouchableOpacity, View, Text } from "react-native";

export default function Index() {
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
              shadowOffset:{width:0,height:1},
              shadowOpacity:0.1,
              shadowRadius:2,
              elevation:2, //only in android
            }}
          >
            <View className="flex-row items-center justify-center">
              <Image source={require("../../assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"></Image>

              <Text className="text-black font-medium text-base">Continue with Google</Text>
            </View>
          </TouchableOpacity>


        </View>
      </View>
    </View>
  </View>
}
