export type ArticleStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export type ArticleInsert = {
  title: string;
  content: string;
  summary?: string;
  status?: ArticleStatus;
  cover_url?: string | null;
};

export type ArticleUpdate = {
  id: string;
  title?: string;
  content?: string;
  summary?: string;
  status?: ArticleStatus;
  cover_url?: string | null;
};

export type ArticleListItem = {
  id: string;
  title: string;
  status: ArticleStatus;
  updated_at: string;
  summary: string | null;
  cover_url: string | null;
};
