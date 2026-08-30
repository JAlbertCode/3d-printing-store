// ---- store config ----------------------------------------------------------
// Brand name, split for the two-tone logo. Rename the shop here.
export const BRAND_A = "LAYER";
export const BRAND_B = "WORKS";
export const BRAND_FULL = "LAYERWORKS PRINT CO.";

// Contact. Used in the footer, the policies page, and Stripe receipts.
export const CONTACT_EMAIL = "hello@layerworks.co"; // TODO: point at the real inbox

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

// ---- fulfillment promises --------------------------------------------------
// One source of truth: the buy card, the FAQ, and the policies page all read
// these. Deliberately conservative. Tighten only once real print and pack
// times are measured, never the other way around.
export const LEAD_TIME = "5 to 7 business days";
export const SHIP_NOTE = `Made to order · ships in ${LEAD_TIME}`;
export const SHIP_CARRIER = "USPS Ground Advantage";
export const SHIP_REGION = "United States";
export const RETURN_WINDOW = "30 days";
// ----------------------------------------------------------------------------
