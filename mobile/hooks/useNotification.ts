import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/utils/api";
import { use } from "react";

export const useNotification = () => {
    const api = useApiClient();
    const queryClient = useQueryClient();

    const { data: notificationData, isLoading, error, refetch, isRefetching } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => api.get("/notifications"),
        select: (res) => res.data.notifications
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: (notificationId: string) => api.delete(`/notifications/${notificationId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] })
    });


    const deleteNotification = (notificationId: string) => {
        deleteNotificationMutation.mutate(notificationId);
    }

    return {
        notifications: notificationData || [],
        isLoading,
        error,
        refetch,
        isRefetching,
        deleteNotification,
        isDeletingNotification: deleteNotificationMutation.isPending
    };

}
