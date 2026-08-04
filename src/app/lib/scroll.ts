export function scrollToCentered(target: string | HTMLElement | null) {
  if (typeof window === "undefined") return;

  const element = typeof target === "string" ? document.getElementById(target) : target;
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const top = window.scrollY + rect.top - viewportHeight / 2 + rect.height / 2;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function attachHashAnchorScroll() {
  const centeredIds = new Set(["ai-trigger-demo", "emotion-demo"]);

  const handleClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!target) return;

    const href = target.getAttribute("href");
    if (!href || !href.startsWith("#") || href === "#") return;

    const id = href.slice(1);
    if (!id) return;

    event.preventDefault();

    if (centeredIds.has(id)) {
      scrollToCentered(id);
      return;
    }

    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}
