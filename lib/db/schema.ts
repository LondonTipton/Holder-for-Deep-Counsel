// Database schema types - currently stubbed for development
export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  documentId: string;
  isUpvote: boolean;
  createdAt: Date;
}

export interface Suggestion {
  id: string;
  documentId: string;
  text: string;
  createdAt: Date;
}