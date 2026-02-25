import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "../utils/api";

export const usePosts = (username?:string) => {
    const api = useApiClient();
    const queryClient = useQueryClient();

    const {
        data: postsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: username ? ["userPosts", username] : ["posts"],
        queryFn: () => (username ? postApi.getUserPosts(api, username) : postApi.getPosts(api)),
        select: (response) => response.data.posts,
    });

    const likePostMutation = useMutation({
        mutationFn: (postId: string) =>postApi.likePost(api, postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            if (username) {
                queryClient.invalidateQueries({ queryKey: ['userPosts', username] });
            }
        }
    });

    const deletePostMutation = useMutation({
        mutationFn: (postId: string) => postApi.deletePost(api, postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            if (username) {
                queryClient.invalidateQueries({ queryKey: ['userPosts', username] });
            }
        }
    });

    const checkIsLiked = (postLikes: any[] = [], currentUser: any) => {
        if (!currentUser || !currentUser._id) return false;
        return postLikes.some(id =>
            typeof id === 'string' ? id === currentUser._id : (id && id._id === currentUser._id)
        );
    };

    return {
        posts: postsData || [],
        isLoading,
        error,
        refetch,
        toggleLike: (postId: string) => likePostMutation.mutate(postId),
        deletePost: (postId: string) => deletePostMutation.mutate(postId),
        checkIsLiked,
    }; 

};