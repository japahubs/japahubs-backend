export type UserDTO = {
  userId?: string;
  username: string;
  bio: string;
  avatar: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender: string;
  country: string;
  language: string;
  email: string;
  dateOfBirth: string;
  links: string[];
  role: string;
};

export type UserSearchResponseDTO = {
  userId: string;
  username: string;
  bio?: string;
  avatar: string;
  firstName: string;
  lastName: string;
  postCount?: number;
  journalCount?: number;
  opportunityCount?: number;
};
