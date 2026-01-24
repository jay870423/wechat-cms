export type Locale = "en" | "zh";

export const locales: Locale[] = ["en", "zh"];
export const defaultLocale: Locale = "en";

export const messages = {
  en: {
    brand: {
      name: "WeChat CMS"
    },
    nav: {
      dashboard: "Dashboard",
      editor: "Editor",
      login: "Login",
      signOut: "Sign out",
      checking: "Checking session..."
    },
    footer: {
      product: "WeChat CMS starter",
      poweredBy: "Powered by Next.js, Supabase, and Vercel"
    },
    common: {
      loading: "Loading...",
      retry: "Retry"
    },
    home: {
      title: "Content operations for WeChat",
      subtitle: "Plan, edit, and publish across teams with realtime drafts and clean editorial flow.",
      kicker: "Official account control center",
      heroTitle: "A calm workspace for your next viral story.",
      heroBody:
        "Pull briefs, manage assets, and review edits without leaving the editor. Designed for teams shipping weekly WeChat content.",
      ctaDashboard: "Open dashboard",
      ctaEditor: "Start a draft",
      queue: {
        today: "Today",
        queueCount: "Queue 03",
        items: [
          "New launch story - ready for review",
          "Founder interview - awaiting assets",
          "Weekly roundup - scheduled 10:00"
        ],
        notice: "WeChat push window opens in 3 hours."
      },
      highlights: [
        {
          title: "Plan with intent",
          body: "Sync campaign themes, approval stages, and release cadence in one place."
        },
        {
          title: "Edit in real time",
          body: "Collaborate on drafts with structured sections, assets, and live preview."
        },
        {
          title: "Ship confidently",
          body: "Queue WeChat pushes and keep an audit trail across versions."
        }
      ]
    },
    dashboard: {
      title: "Editorial dashboard",
      subtitle: "Track what is shipping, what needs review, and what is ready for WeChat.",
      stats: [
        { label: "Drafts", value: "14", trend: "+4 this week", accent: "jade" },
        { label: "In review", value: "6", trend: "2 awaiting", accent: "amber" },
        { label: "Published", value: "28", trend: "No delays", accent: "jade" }
      ],
      recentActivity: "Recent activity",
      updatedToday: "Updated today",
      emptyState: "No updates yet. Start a draft to see activity here.",
      loadError: "Unable to load articles.",
      wechatTitle: "WeChat messages",
      wechatEmpty: "No WeChat messages yet.",
      wechatLoadError: "Unable to load WeChat messages."
    },
    editor: {
      title: "Draft editor",
      subtitle: "Capture ideas, structure your story, and prep for a WeChat push.",
      summary: "Summary",
      summaryPlaceholder: "Write a short summary for the CMS and WeChat preview.",
      checklistTitle: "Publishing checklist",
      checklistItems: ["Cover selected", "Assets uploaded", "Review requested", "Schedule set"],
      toolbarTitle: "Draft editor",
      preview: "Preview",
      saveDraft: "Save draft",
      savingDraft: "Saving...",
      saved: "Draft saved.",
      saveError: "Unable to save. Please try again.",
      required: "Title and content are required.",
      titlePlaceholder: "Story title",
      tools: ["Headline", "Bold", "Italic", "Quote", "List"],
      livePreview: "Live preview",
      startWriting: "Start writing to see the preview.",
      wechatPanelTitle: "WeChat publish",
      wechatPanelHint:
        "Provide the WeChat thumb_media_id to create a draft and publish it.",
      wechatThumbLabel: "WeChat thumb_media_id",
      wechatThumbPlaceholder: "Paste the WeChat media id",
      wechatPublish: "Publish to WeChat",
      wechatPublishing: "Publishing...",
      wechatPublishRequired: "Save the draft and provide a thumb_media_id first.",
      wechatPublishSuccess: "WeChat publish submitted.",
      wechatPublishError: "Unable to publish to WeChat."
    },
    login: {
      title: "Team login",
      subtitle: "Connect with Supabase Auth to protect the editorial workflow.",
      note: "Enable email/password signups in Supabase Auth settings if you want self-serve accounts."
    },
    auth: {
      email: "Email",
      password: "Password",
      working: "Working...",
      signIn: "Sign in",
      createAccount: "Create account",
      continueGoogle: "Continue with Google",
      continueGithub: "Continue with GitHub",
      orDivider: "Or use email",
      newHere: "New here?",
      haveAccount: "Already have an account?",
      signInInstead: "Sign in instead",
      loginRequired: "Please sign in to access this page.",
      loginCTA: "Go to login",
      missingConfig:
        "Missing Supabase client config. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      required: "Email and password are required.",
      accountCreated: "Account created. Check your email to confirm before signing in.",
      oauthError: "Unable to complete OAuth sign-in. Please try again."
    },
    status: {
      draft: "Draft",
      review: "In review",
      scheduled: "Scheduled",
      published: "Published",
      archived: "Archived"
    },
    wechatStatus: {
      draft: "Draft",
      queued: "Queued",
      sent: "Sent",
      failed: "Failed"
    }
  },
  zh: {
    brand: {
      name: "微信CMS"
    },
    nav: {
      dashboard: "内容看板",
      editor: "编辑器",
      login: "登录",
      signOut: "退出登录",
      checking: "正在检查登录状态..."
    },
    footer: {
      product: "微信CMS启动模板",
      poweredBy: "基于 Next.js、Supabase 与 Vercel 构建"
    },
    common: {
      loading: "加载中...",
      retry: "重试"
    },
    home: {
      title: "公众号内容运营中台",
      subtitle: "在一个平台内完成选题、协作编辑与发布，支持实时草稿与清晰流程。",
      kicker: "公众号内容控制台",
      heroTitle: "让下一篇爆款在这里沉淀。",
      heroBody:
        "整合选题、素材与审稿流程，不必离开编辑器。为每周稳定输出的团队打造。",
      ctaDashboard: "进入看板",
      ctaEditor: "开始写稿",
      queue: {
        today: "今天",
        queueCount: "排期 03",
        items: ["新品发布故事 - 待审核", "创始人访谈 - 等待素材", "每周总结 - 已排期 10:00"],
        notice: "距下一次推送窗口还有 3 小时。"
      },
      highlights: [
        {
          title: "有节奏地规划",
          body: "把主题、审批阶段与发布节奏统一管理。"
        },
        {
          title: "实时协作编辑",
          body: "结构化内容、素材管理与实时预览同步推进。"
        },
        {
          title: "发布更从容",
          body: "集中排期推送，版本与审核记录一目了然。"
        }
      ]
    },
    dashboard: {
      title: "内容看板",
      subtitle: "跟踪发布进度、审稿状态与待发内容。",
      stats: [
        { label: "草稿", value: "14", trend: "本周 +4", accent: "jade" },
        { label: "审核中", value: "6", trend: "2 篇待处理", accent: "amber" },
        { label: "已发布", value: "28", trend: "无延迟", accent: "jade" }
      ],
      recentActivity: "最新动态",
      updatedToday: "今日更新",
      emptyState: "暂无动态，先创建一篇草稿吧。",
      loadError: "文章加载失败。",
      wechatTitle: "微信消息记录",
      wechatEmpty: "暂无微信消息。",
      wechatLoadError: "微信消息加载失败。"
    },
    editor: {
      title: "稿件编辑",
      subtitle: "记录想法、组织结构，并为公众号推送做准备。",
      summary: "摘要",
      summaryPlaceholder: "填写用于CMS与微信预览的摘要。",
      checklistTitle: "发布检查清单",
      checklistItems: ["已选封面", "已上传素材", "已发起审核", "已设定排期"],
      toolbarTitle: "稿件编辑",
      preview: "预览",
      saveDraft: "保存草稿",
      savingDraft: "保存中...",
      saved: "草稿已保存。",
      saveError: "保存失败，请稍后再试。",
      required: "请填写标题和正文。",
      titlePlaceholder: "文章标题",
      tools: ["标题", "加粗", "斜体", "引用", "列表"],
      livePreview: "实时预览",
      startWriting: "开始写作即可预览。",
      wechatPanelTitle: "微信发布",
      wechatPanelHint: "填写微信图文 thumb_media_id 后即可创建草稿并发布。",
      wechatThumbLabel: "微信 thumb_media_id",
      wechatThumbPlaceholder: "粘贴微信素材 ID",
      wechatPublish: "发布到微信",
      wechatPublishing: "发布中...",
      wechatPublishRequired: "请先保存草稿，并填写 thumb_media_id。",
      wechatPublishSuccess: "已提交微信发布。",
      wechatPublishError: "微信发布失败。"
    },
    login: {
      title: "团队登录",
      subtitle: "接入 Supabase Auth 保护内容协作流程。",
      note: "如需自助注册账号，请在 Supabase Auth 中启用邮箱密码登录。"
    },
    auth: {
      email: "邮箱",
      password: "密码",
      working: "处理中...",
      signIn: "登录",
      createAccount: "创建账号",
      continueGoogle: "使用 Google 登录",
      continueGithub: "使用 GitHub 登录",
      orDivider: "或使用邮箱",
      newHere: "第一次来？",
      haveAccount: "已有账号？",
      signInInstead: "改为登录",
      loginRequired: "请先登录后再访问该页面。",
      loginCTA: "前往登录",
      missingConfig:
        "未配置 Supabase 客户端。请检查 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。",
      required: "请填写邮箱和密码。",
      accountCreated: "账号已创建，请到邮箱确认后再登录。",
      oauthError: "OAuth 登录失败，请重试。"
    },
    status: {
      draft: "草稿",
      review: "审核中",
      scheduled: "已排期",
      published: "已发布",
      archived: "已归档"
    },
    wechatStatus: {
      draft: "草稿",
      queued: "队列中",
      sent: "已发送",
      failed: "失败"
    }
  }
} as const;

export type Messages = typeof messages.en;

export function getWordCountLabel(locale: Locale, count: number) {
  if (locale === "zh") {
    return `${count} 字`;
  }
  return count === 1 ? "1 word" : `${count} words`;
}
