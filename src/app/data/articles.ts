import type { ArticleItem, Lang } from "@/app/types";

export const ARTICLE_EMPTY_CATEGORY_TEXT: Record<Lang, string> = {
  en: "No articles",
  vi: "Không có bài viết",
};

export function getArticleCategory(category: string | undefined, lang: Lang = "en") {
  if (!category || !category.trim() || category === "NULL") {
    return ARTICLE_EMPTY_CATEGORY_TEXT[lang];
  }
  return category;
}

export const ARTICLES: ArticleItem[] = [
  /*
  {
    title: "NULL",
    // category: "NULL",
    date: "NULL",
    excerpt: "How replacing a Python prototype with Go cut latency from 340ms to 18ms — and what goroutine-safe audio buffers taught me.",
    readTime: 8,
    imgId: "photo-1733412505442-36cfa59a4240",
  }, */

];
