import { useEffect } from "react";

export default function ExternalLinksEffect() {
  useEffect(() => {
    const setExternalAttrs = (anchor: HTMLAnchorElement) => {
      try {
        const url = new URL(anchor.href);
        if (url.origin !== window.location.origin) {
          anchor.setAttribute("target", "_blank");
          anchor.setAttribute("rel", "noopener noreferrer");
        }
      } catch (e) {
        // ignore invalid URLs (mailto:, javascript:, etc.)
      }
    };

    const runPass = () => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]") || []);
      anchors.forEach((a) => {
        if (a.href && /^https?:\/\//i.test(a.href)) setExternalAttrs(a);
      });
    };

    runPass();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") runPass();
        if (m.type === "attributes" && m.target instanceof HTMLAnchorElement) runPass();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });

    return () => observer.disconnect();
  }, []);

  return null;
}
