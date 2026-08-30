import { useEffect, useState } from "react";

/** "#/p/capsule-slab" -> { page: "product", slug: "capsule-slab" } */
export function useHashRoute() {
  const parse = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    const [a, b] = h.split("/");
    if (a === "p" && b) return { page: "product" as const, slug: b };
    return { page: "home" as const, slug: "" };
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onHash = () => {
      const next = parse();
      setRoute((prev) => {
        if (prev.page !== next.page || prev.slug !== next.slug) window.scrollTo({ top: 0 });
        return next;
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}
