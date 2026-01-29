import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApiClient } from "@/utils/api";

export const useCreatePost = () => {
    const [content, setContent] = useState('');
    const [seletedImages, setSelectedImages] = useState<string[]>([]);
    const apiClient = useApiClient();
    const queryClient = useQueryClient();


    const createPost = useMutation({
        mutationFn: async (postData: { content: string; imageUri?: string }) => {
            const formData = new FormData();
            if (postData.content) formData.append('content', content);
            if (postData.imageUri) {

                const uriParts = postData.imageUri.split('.');
                const fileType = uriParts[uriParts.length - 1].toLowerCase();

                const mimeTypeMap: Record<string, string> = {
                    png: 'image/png',
                    gif: 'image/gif',
                    webp: 'image/webp',
                };

                const mimeType = mimeTypeMap[fileType] || 'image/jpeg';
                formData.append('image', {
                    uri: postData.imageUri,
                    type: mimeType,
                    name: `image.${fileType}`,
                } as any);
            }

            return apiClient.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

        },
        onSuccess: () => {
            //refresh posts list
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setContent('');
            setSelectedImages([]);
            Alert.alert('Success', 'Post created successfully!');
        },
        onError: (error) => {
            Alert.alert('Error', "Failed to create post.please try again.");
        }
    });

    const pickImageFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 4,
        });

        if (!result.canceled && result.assets) {
            const imageUris = result.assets.map(asset => asset.uri);
            setSelectedImages(prev => [...prev, ...imageUris]);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.canceled && result.assets) {
            setSelectedImages(prev => [...prev, result.assets[0].uri]);
        }
    };

    const removeImage = (uriToRemove: string) => {
        setSelectedImages(prev => prev.filter(uri => uri !== uriToRemove));
    };

    return {
        content,
        setContent,
        seletedImages,
        isCreating: createPost.isLoading,
        pickImageFromGallery,
        takePhoto,
        removeImage,
        createPost
    };
}