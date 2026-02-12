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
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string,
  content: string,
  createdAt: string,
  user: User;
}

export interface Notification {
  id: string;
  from: {
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  to: string;
  type: 'like' | 'comment' | 'follow';
  post?: {
    _id: string;
    content: string;
    image?: string;
  };
  comment?: {
    _id: string;
    content: string;
  }
  createdAt: string;
}

