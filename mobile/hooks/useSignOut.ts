import { useClerk } from "@clerk/clerk-expo"
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";


export const useSignOut = () => {
    const { signOut } = useClerk();
  const queryClient = useQueryClient();

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
                    queryClient.clear();
                }
            }
        ])
    }
    return { handleSignOut };
}