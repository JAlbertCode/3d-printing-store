// ---- store config ----------------------------------------------------------
// Brand name, split for the two-tone logo. Rename the shop here.
export const BRAND_A = "LAYER";
export const BRAND_B = "WORKS";
export const BRAND_FULL = "LAYERWORKS PRINT CO.";
// Per-product checkout links live in products.ts (buyUrl).
// Custom requests go through the Google Form; responses land in the
// "Layerworks custom requests" sheet on the store Google account.
export const REQUEST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf_j9FLxkSbfxweIE5t4lK90yUMenBg9lVT4cBZsRiBpVGUJg/viewform";
export const REQUEST_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSf_j9FLxkSbfxweIE5t4lK90yUMenBg9lVT4cBZsRiBpVGUJg/formResponse";
// Google Form field ids; the site's native form posts these names directly
export const ENTRY = {
  name: "1263507356",
  description: "650572175",
  size: "1246863425",
  where: "949809865",
  colors: "1531119295",
  quantity: "1570986074",
  deadline: "225070924",
  budget: "1773754287",
  links: "1735693988",
} as const;
export const SHIP_NOTE = "Made to order · ships in 3 to 5 business days";
// ----------------------------------------------------------------------------
