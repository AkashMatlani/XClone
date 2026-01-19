import { Image, View } from "react-native";

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

      </View>
    </View>
  </View>
}
