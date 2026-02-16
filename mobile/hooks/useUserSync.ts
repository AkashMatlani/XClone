import { useEffect,useRef  } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "@/utils/api";
import { useUser } from '@clerk/clerk-expo'

export const useUserSync = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const api = useApiClient();

  // Track the last synced user to avoid old-token sync
  const lastSyncedUserId = useRef<string | null>(null);

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) => {
      console.log("User synced:", response.data.user);
      lastSyncedUserId.current = user?.id || null;
    },
    onError: (error) => console.error("User Sync failed:", error),
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;

    // Skip sync if this user was already synced
    if (lastSyncedUserId.current === user.id) return;

    console.log("Syncing user:", user.id);
    syncUserMutation.mutate();
  }, [user?.id, isSignedIn, isLoaded]);
};



