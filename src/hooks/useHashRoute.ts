import { useEffect, useState } from "react";

/**
 * "#/p/capsule-slab" -> { page: "product", slug: "capsule-slab" }
 * "#/thank-you"      -> { page: "thank-you" }
 * "#/policies"       -> { page: "policies" }
 *
 * Stripe appends its own query string to the return URL, so a real redirect
 * lands as "#/thank-you?session_id=cs_live_...". Strip it before matching.
 */
export type Route =
  | { page: "home"; slug: "" }
  | { page: "product"; slug: string }
  | { page: "thank-you"; slug: "" }
  | { page: "policies"; slug: "" };

export function useHashRoute(): Route {
  const parse = (): Route => {
    const h = window.location.hash.replace(/^#\/?/, "").split("?")[0];
    const [a, b] = h.split("/");
    if (a === "p" && b) return { page: "product", slug: b };
    if (a === "thank-you") return { page: "thank-you", slug: "" };
    if (a === "policies") return { page: "policies", slug: "" };
    return { page: "home", slug: "" };
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
