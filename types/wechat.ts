export type WechatAccessToken = {
  access_token: string;
  expires_in: number;
};

export type WechatRequestError = {
  errcode?: number;
  errmsg?: string;
};

export type WechatDraftResponse = {
  media_id: string;
} & WechatRequestError;

export type WechatPublishResponse = {
  publish_id: string;
} & WechatRequestError;

export type WechatMessageStatus = "draft" | "queued" | "sent" | "failed";

export type WechatMessageListItem = {
  id: string;
  status: WechatMessageStatus;
  wechat_media_id: string | null;
  created_at: string;
  article_title: string | null;
};
