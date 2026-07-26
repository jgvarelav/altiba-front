export interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}
