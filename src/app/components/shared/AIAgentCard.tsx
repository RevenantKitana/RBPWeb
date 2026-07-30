import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Bot, CheckCircle, ExternalLink, Loader2, Zap } from "lucide-react";
import { GlassCard } from "@/app/components/shared/GlassCard";
import { T, AI_TITLES } from "@/app/data/content";
import type { AIStage, AIStepKey, Lang } from "@/app/types";
import { buildApiUrl, fetchWithRetry } from "@/app/lib/api";

interface GeneratedResult {
  title: string;
  category: string;
  tags: string[];
  contentPreview: string;
  link: string;
  provider: string;
  latencyMs: number | null;
  postId: number | null;
}

interface TriggerStepSnapshot {
  key: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed";
}

interface TriggerJobSnapshot {
  jobId: string;
  actionType: string;
  status: "queued" | "running" | "completed" | "failed";
  currentStep: string;
  steps: TriggerStepSnapshot[];
  aiStepDescs: Record<string, string>;
  startedAt: string;
  updatedAt: string;
  error?: string;
  result?: {
    success: boolean;
    postId?: number;
    provider?: string;
    latencyMs?: number;
    preview?: {
      title?: string;
      category?: string;
      tags?: string[];
      contentPreview?: string;
      link?: string;
    };
  };
}

export function AIAgentCard({ lang }: { lang: Lang }) {
  const t = T[lang].software;
  const [stage, setStage] = useState<AIStage>("idle");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState(false);
  const [jobSnapshot, setJobSnapshot] = useState<TriggerJobSnapshot | null>(null);

  const stageOrder: AIStepKey[] = [
    "selecting",
    "gathering",
    "generating",
    "publishing",
    "completed",
  ];

  const createFailedSnapshot = (message: string): TriggerJobSnapshot => ({
    jobId: `local-failed-${Date.now()}`,
    actionType: "post",
    status: "failed",
    currentStep: "selecting",
    steps: stageOrder.map((key, index) => ({
      key,
      label: t.aiStepLabels[key as AIStepKey] || key,
      status: index === 0 ? "failed" : "pending",
    })),
    aiStepDescs: stageOrder.reduce<Record<string, string>>((acc, key) => {
      acc[key] = t.aiStepDescs[key as AIStepKey] || "";
      return acc;
    }, {}),
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    error: message,
  });

  useEffect(() => {
    if (!jobSnapshot?.jobId || jobSnapshot.status === "completed" || jobSnapshot.status === "failed") {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const statusRes = await fetchWithRetry(
          buildApiUrl(`/trigger/status/${jobSnapshot.jobId}`, "VITE_AI_BACKEND_BASE_URL"),
          { method: "GET" },
          { retries: 2, initialDelayMs: 400, backoffFactor: 1.8 },
        );
        if (!statusRes.ok) return;
        const nextSnapshot = await statusRes.json();
        setJobSnapshot(nextSnapshot);

        if (nextSnapshot.currentStep) {
          setStage(nextSnapshot.currentStep as AIStage);
        }

        if (nextSnapshot.status === "completed" && nextSnapshot.result?.preview) {
          const preview = nextSnapshot.result.preview;
          const normalized: GeneratedResult = {
            title: preview?.title ?? AI_TITLES[Math.floor(Math.random() * AI_TITLES.length)],
            category: preview?.category ?? "",
            tags: Array.isArray(preview?.tags) ? preview.tags : [],
            contentPreview: preview?.contentPreview ?? "",
            link: preview?.link ?? "",
            provider: nextSnapshot.result.provider ?? "",
            latencyMs: nextSnapshot.result.latencyMs ?? null,
            postId: nextSnapshot.result.postId ?? null,
          };
          setGeneratedTitle(normalized.title);
          setGeneratedResult(normalized);
          setStage("completed");
        }

        if (nextSnapshot.status === "failed") {
          setError(true);
          setStage("completed");
        }
      } catch {
        // ignore transient polling errors
      }
    }, 1200);

    return () => window.clearInterval(timer);
  }, [jobSnapshot?.jobId, jobSnapshot?.status]);

  const trigger = async () => {
    console.info("[AI trigger] button clicked");
    setError(false);
    setGeneratedTitle("");
    setGeneratedResult(null);
    setStage("selecting");

    try {
      const url = buildApiUrl("/trigger/post", "VITE_AI_BACKEND_BASE_URL");
      console.info("[AI trigger] sending request", { url, stage });
      const res = await fetchWithRetry(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          mode: "cors",
        },
        { retries: 2, initialDelayMs: 600, backoffFactor: 1.8 },
      );

      if (!res.ok) {
        console.error("[AI trigger] non-ok response", { status: res.status, url });
        const failedSnapshot = createFailedSnapshot(`Unable to start AI workflow (${res.status})`);
        setJobSnapshot(failedSnapshot);
        setError(true);
        setStage("completed");
        return;
      }

      console.info("[AI trigger] response status", { status: res.status, url });
      const payload = await res.json();
      console.info("[AI trigger] response payload", payload);
      const jobId = payload?.jobId;

      if (!jobId) {
        throw new Error("Missing jobId from trigger response");
      }

      setJobSnapshot(payload);
      setStage((payload.currentStep as AIStage) ?? "selecting");
      setGeneratedTitle("");
      setGeneratedResult(null);
    } catch {
      const failedSnapshot = createFailedSnapshot("Unable to reach the AI backend. Please check the backend URL.");
      setJobSnapshot(failedSnapshot);
      setError(true);
      setStage("completed");
    }
  };

  const currentIdx = stageOrder.indexOf(stage as AIStepKey);

  return (
    <div id="ai-trigger-demo" className="scroll-mt-24">
      <GlassCard className="p-6 flex flex-col h-full min-h-0">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={15} className="text-primary" />
          <p className="font-medium text-foreground/90 text-sm">{t.aiTitle}</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{t.aiSub}</p>
      </div>

      {stage !== "idle" && (
        <div className="mb-4">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {t.aiProgressLabel}
              </p>
              <span className={`text-[10px] ${jobSnapshot?.status === "failed" ? "text-red-400" : "text-primary"}`}>
                {jobSnapshot?.status === "failed" ? "Failed" : stage === "completed" ? t.aiProgressDone : t.aiProgressRunning}
              </span>
            </div>
            <div className="max-h-44 overflow-y-auto pr-1 space-y-2">
              {(jobSnapshot?.steps ?? stageOrder.map((s) => ({ key: s, label: t.aiStepLabels[s], status: "pending" }))).map((s, i) => {
                const isFailed = jobSnapshot?.status === "failed" && s.status === "failed";
                const isActive = !isFailed && (stage === s.key || (jobSnapshot?.status === "running" && s.status === "running"));
                const isDone = s.status === "completed" || (!isFailed && currentIdx > i && s.status !== "pending");
                const label = s.label || t.aiStepLabels[s.key as AIStepKey] || s.key;
                const desc = jobSnapshot?.aiStepDescs?.[s.key] || t.aiStepDescs[s.key as AIStepKey];
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/[0.08] border border-primary/20"
                        : isDone
                        ? "opacity-45"
                        : "opacity-25"
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {isFailed ? (
                        <div className="w-3.5 h-3.5 rounded-full border border-red-400/60 bg-red-500/10" />
                      ) : isDone ? (
                        <CheckCircle size={13} className="text-primary" />
                      ) : isActive ? (
                        <Loader2 size={13} className="text-primary animate-spin" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-border" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${isActive ? "text-primary" : "text-foreground/70"}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                  </motion.div>
                );
              })}
              {jobSnapshot?.status === "failed" && jobSnapshot.error ? (
                <p className="text-[11px] text-red-400 pt-1">{jobSnapshot.error}</p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {stage === "completed" && generatedTitle && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-primary/[0.07] border border-primary/20 space-y-2"
          >
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground uppercase">
              <span>{t.aiResultBotLabel}: {generatedResult?.provider || "ContentBot-7"}</span>
              <span className="text-primary">{t.aiResultActionLabel} ✓</span>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">{t.aiResultTitleLabel}</p>
              <p className="text-sm text-foreground/90 font-medium leading-snug">{generatedTitle}</p>
            </div>
            {generatedResult?.category ? (
              <div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">{t.aiResultCategoryLabel}</p>
                <p className="text-xs text-foreground/70">{generatedResult.category}</p>
              </div>
            ) : null}
            {generatedResult?.tags?.length ? (
              <div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">{t.aiResultTagsLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {generatedResult.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {generatedResult?.contentPreview ? (
              <div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase mb-1">{t.aiResultPreviewLabel}</p>
                <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">{generatedResult.contentPreview}</p>
              </div>
            ) : null}
            {generatedResult?.link ? (
              <a href={generatedResult.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                <ExternalLink size={10} />
                {t.aiResultLinkLabel}
              </a>
            ) : null}
            {error ? <p className="text-[11px] text-red-400">{t.forumError}</p> : null}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={trigger}
        disabled={stage !== "idle" && stage !== "completed"}
        className="mt-auto w-full py-2.5 bg-primary/10 border border-primary/25 text-primary text-sm font-medium rounded-xl hover:bg-primary/[0.18] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {stage !== "idle" && stage !== "completed" ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Running…
          </>
        ) : (
          <>
            <Zap size={13} />
            {t.aiTrigger}
          </>
        )}
      </button>
      </GlassCard>
    </div>
  );
}
