export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
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

export interface Comment{
  _id:string,
  content:string,
  createdAt:string,
  user:User;
}

