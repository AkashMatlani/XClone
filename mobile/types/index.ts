export interface User {
  _id: string;
  clerkId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  profilePicture?: string;
  bannerImage?: string;
  bio?: string;
  location?: string;
  followers?: string[];
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  user: User;
  content: string;
  image?: string;
  likes: string[];
  comments: string[];
  createdAt: string;
}

