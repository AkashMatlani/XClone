import { useClerk } from "@clerk/clerk-expo"
import { Alert } from "react-native";


export const useSignOut = () => {
    const { signOut } = useClerk();

    const handleSignOut = () => {
        Alert.alert("LogOut", "Are you sure want to Logout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                }
            }
        ])
    }
    return { handleSignOut };
}