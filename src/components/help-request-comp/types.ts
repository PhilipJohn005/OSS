export type Task = {
  id?: number;
  card_name: string;
  tags: string[];
  user_email: string;
  product_description?: string;
  issues: {
    id: number;
    title: string;
    description: string;
    link: string;
    images: string[];
  }[];
};

export interface ToggleTagFn {
  (tag: string): void;
}

export interface AddCardRequest {
  repo_url: string;
  product_description: string;
  tags: string[];
}

export interface AddCardResponse {
  message: string;
  [key: string]: any;
}

export interface CustomSession {
  accessToken?: string;
  [key: string]: any;
}