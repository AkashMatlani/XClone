import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "@/utils/api";
import { useUser } from '@clerk/clerk-expo'

export const useUserSync = () => {
    const { isSignedIn, sessionId } = useAuth();
    const { user } = useUser();
    const api = useApiClient();

    const syncUserMutation = useMutation({
        mutationFn: () => userApi.syncUser(api),
        onSuccess: (response: any) =>
            console.log("User synced:", response.data.user),
        onError: (error) =>
            console.error("User Sync failed:", error),
    });

    useEffect(() => {
        if (isSignedIn && sessionId) {
            console.log("Syncing user:", user?.id);
            syncUserMutation.mutate();
        }
    }, [sessionId]); 

    return null;
};
