import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react"
import { Alert } from "react-native";
import * as Linking from "expo-linking";

export const useSocialAuth = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        setIsLoading(true);
        try {
            const redirectUrl = Linking.createURL("/");
            const { createdSessionId, setActive } = await
                startSSOFlow({
                    strategy,
                    redirectUrl
                })
            //check user is authanticated 
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
            }
        } catch (error) {
            console.log("Error in social auth", error)
            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert("Error", `failed to sign  in with${provider}. please try again`)
        }
        finally {
            setIsLoading(false);
        }
    }

    return { isLoading, handleSocialAuth }
}