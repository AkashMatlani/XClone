import { useEffect,useRef  } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "@/utils/api";
import { useUser } from '@clerk/clerk-expo'

export const useUserSync = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
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

    // already synced
    if (lastSyncedUserId.current === user.id) return;

    const runSync = async () => {
      // 🔥 force fresh token for THIS user
      const token = await getToken({ skipCache: true });

      if (!token) return;

      console.log("Syncing for user:", user.id);
       if (!token) return;

      console.log("Syncing for user:", user.id);
      syncUserMutation.mutate();
    };

    // 🔥 delay ensures Clerk switches session
    const timeout = setTimeout(runSync, 800);

    return () => clearTimeout(timeout);
  }, [user?.id, isLoaded, isSignedIn]);
};



