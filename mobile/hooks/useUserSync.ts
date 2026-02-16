import { useEffect,useRef  } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "@/utils/api";
import { useUser } from '@clerk/clerk-expo'


export const useUserSync = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const api = useApiClient();

  // Track last synced user
  const lastSyncedUserId = useRef<string | null>(null);

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log("User synced:", response.data.user);
      lastSyncedUserId.current = user?.id || null; // mark current user as synced
    },
    onError: (error) => console.error("User Sync failed:", error),
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;

    //Prevent old token / same user from syncing again
    if (lastSyncedUserId.current === user.id) return;

    console.log("Syncing user:", user.id);
    syncUserMutation.mutate();
  }, [user?.id, isSignedIn, isLoaded]);

  return null;
};


