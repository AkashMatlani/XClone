import { useSocialAuth } from "@/hooks/useSocialAuth";
import { Image, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

//Login Page
export default function Index() {

  const { handleSocialAuth, isLoading } = useSocialAuth();
  const {isLoaded,isSignedIn} = useAuth();

  if(!isLoaded || isLoading || isSignedIn){

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor : "white"   }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
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
            onPress={() => {
              handleSocialAuth("oauth_google")

            }}
            disabled={isLoading}
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
            onPress={() => {
              handleSocialAuth("oauth_apple")
            }}
            disabled={isLoading}
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

        {/* Terms and Privacy */}
        <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
          By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
          {", "}
          <Text className="text-blue-500">Privacy Policy</Text>
          {", and "}
          <Text className="text-blue-500">Cookie Use</Text>
        </Text>
      </View>
    </View>
  </View>
}
