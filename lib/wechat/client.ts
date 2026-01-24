import type {
  WechatAccessToken,
  WechatDraftResponse,
  WechatPublishResponse,
  WechatRequestError
} from "@/types/wechat";

const BASE_URL = "https://api.weixin.qq.com/cgi-bin";

function assertWechatSuccess(response: WechatRequestError) {
  if (typeof response.errcode === "number" && response.errcode !== 0) {
    throw new Error(response.errmsg || "WeChat API error");
  }
}

export async function fetchAccessToken(
  appId: string,
  appSecret: string
): Promise<WechatAccessToken> {
  const endpoint =
    `${BASE_URL}/token` +
    `?grant_type=client_credential&appid=${encodeURIComponent(appId)}` +
    `&secret=${encodeURIComponent(appSecret)}`;

  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch WeChat access token");
  }

  const data = (await response.json()) as WechatAccessToken & WechatRequestError;
  assertWechatSuccess(data);
  return data;
}

export async function createNewsDraft(
  accessToken: string,
  payload: {
    title: string;
    content: string;
    digest?: string;
    author?: string;
    content_source_url?: string;
    thumb_media_id: string;
  }
): Promise<WechatDraftResponse> {
  const response = await fetch(`${BASE_URL}/draft/add?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      articles: [
        {
          title: payload.title,
          author: payload.author,
          digest: payload.digest,
          content: payload.content,
          content_source_url: payload.content_source_url,
          thumb_media_id: payload.thumb_media_id,
          need_open_comment: 0,
          only_fans_can_comment: 0
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Failed to create WeChat draft");
  }

  const data = (await response.json()) as WechatDraftResponse;
  assertWechatSuccess(data);
  return data;
}

export async function submitFreePublish(
  accessToken: string,
  mediaId: string
): Promise<WechatPublishResponse> {
  const response = await fetch(
    `${BASE_URL}/freepublish/submit?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media_id: mediaId })
    }
  );

  if (!response.ok) {
    throw new Error("Failed to submit WeChat publish");
  }

  const data = (await response.json()) as WechatPublishResponse;
  assertWechatSuccess(data);
  return data;
}
