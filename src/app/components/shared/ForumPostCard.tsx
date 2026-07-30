import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Tag } from "lucide-react";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { generateTags, FORUM_CATEGORIES } from "@/app/data/content";
import type { Lang, ForumPost } from "@/app/types";
import { T } from "@/app/data/content";
import { buildApiUrl, fetchWithRetry } from "@/app/lib/api";

export function ForumPostCard({ lang }: { lang: Lang }) {
  const t = T[lang].software;
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchWithRetry(
        buildApiUrl("/api/v1/posts/random", "VITE_FORUM_BACKEND_BASE_URL"),
        { method: "GET" },
        { retries: 2, initialDelayMs: 500, backoffFactor: 1.8 },
      );
      if (!res.ok) throw new Error("Failed");
      const payload = await res.json();
      const data = payload?.data ?? payload;
      const normalizedPost: ForumPost = {
        title: data?.title ?? "Untitled post",
        body: data?.contentPreview ?? data?.body ?? "",
        category: data?.category ?? "",
        tags: Array.isArray(data?.tags) ? data.tags : [],
        contentPreview: data?.contentPreview ?? data?.body ?? "",
        link: data?.link ?? "",
      };
      setPost(normalizedPost);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const category = post?.category || (post?.userId ? FORUM_CATEGORIES[(post.userId - 1) % FORUM_CATEGORIES.length] : "");
  const tags = post?.tags?.length ? post.tags : (post ? generateTags(post.title) : []);
  const previewText = post?.contentPreview ?? post?.body ?? "";

  return (
    <GlassCard className="p-6 flex flex-col h-full min-h-0">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <p className="font-medium text-foreground/90 text-sm">{t.forumTitle}</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{t.forumSub}</p>
        </div>
        <button
          onClick={fetchPost}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border hover:border-primary/30 px-3 py-1.5 rounded-lg"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          {t.forumRefresh}
        </button>
      </div>

      <div className="flex-1">
        {loading && (
          <div className="space-y-3 pt-2">
            {[80, 65, 90, 55].map((w, i) => (
              <div
                key={i}
                className="h-3 bg-white/[0.06] rounded-full animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-red-400/70">{t.forumError}</p>
        )}
        {post && !loading && (
          <div>
            <h4 className="font-medium text-foreground text-sm leading-snug mb-3 capitalize">{post.title}</h4>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                {t.forumCategoryLabel}:
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                {category}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Tag size={10} className="text-muted-foreground" />
              {tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-foreground/55 leading-relaxed line-clamp-3">{previewText}</p>
          </div>
        )}
      </div>

      {post && !loading && post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-xs text-primary hover:underline text-left transition-all"
        >
          {t.forumReadMore}
        </a>
      )}
    </GlassCard>
  );
}
