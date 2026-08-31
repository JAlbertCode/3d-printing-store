#!/usr/bin/env bash
# Creates the Capsule Slab payment link.
# Colors are chosen on the site, not at checkout, so this link collects only
# payment and a shipping address.
#
#   cp .env.example .env    # then fill it in
#   bash scripts/create-payment-link.sh
#
# Run it again if the price, shipping, or redirect changes. Stripe can't edit a
# link's configuration after creation, so each run mints a NEW link: update
# buyUrl in src/lib/products.ts and deactivate the old one in the dashboard.

set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] || { echo "no .env found. copy .env.example to .env first."; exit 1; }
set -a; source .env; set +a

: "${STRIPE_SECRET_KEY:?missing in .env}"
: "${STRIPE_PRICE_ID:?missing in .env}"
: "${THANK_YOU_URL:?missing in .env}"

case "$STRIPE_SECRET_KEY" in
  sk_live_*) echo "mode: LIVE (real money)" ;;
  sk_test_*) echo "mode: test" ;;
  *) echo "STRIPE_SECRET_KEY doesn't look like a Stripe secret key."; exit 1 ;;
esac

# --- free shipping rate, US -------------------------------------------------
SHIP=$(curl -s https://api.stripe.com/v1/shipping_rates \
  -u "$STRIPE_SECRET_KEY:" \
  -d "display_name=Free shipping" \
  -d "type=fixed_amount" \
  -d "fixed_amount[amount]=0" \
  -d "fixed_amount[currency]=usd" \
  -d "delivery_estimate[minimum][unit]=business_day" \
  -d "delivery_estimate[minimum][value]=5" \
  -d "delivery_estimate[maximum][unit]=business_day" \
  -d "delivery_estimate[maximum][value]=7" \
  | sed -n 's/.*"id": *"\(shr_[^"]*\)".*/\1/p' | head -1)

[ -n "$SHIP" ] || { echo "failed to create shipping rate. check the key."; exit 1; }
echo "shipping rate: $SHIP"

# Colors are NOT collected here. They're chosen on the site, which requires a
# pick before the buy button activates, and ride along as client_reference_id
# on the order. Adding dropdowns back would ask the buyer the same question
# twice and let the two answers disagree.

# --- create the link --------------------------------------------------------
# Stripe Tax needs an origin address set in the dashboard before it can be
# enabled here. Set AUTOMATIC_TAX=false in .env to create the link without it
# and switch tax on later from the dashboard.
TAX="${AUTOMATIC_TAX:-true}"

RESP=$(curl -s https://api.stripe.com/v1/payment_links \
  -u "$STRIPE_SECRET_KEY:" \
  -d "line_items[0][price]=$STRIPE_PRICE_ID" \
  -d "line_items[0][quantity]=1" \
  -d "line_items[0][adjustable_quantity][enabled]=true" \
  -d "line_items[0][adjustable_quantity][minimum]=1" \
  -d "line_items[0][adjustable_quantity][maximum]=10" \
  -d "shipping_address_collection[allowed_countries][0]=US" \
  -d "shipping_options[0][shipping_rate]=$SHIP" \
  -d "automatic_tax[enabled]=$TAX" \
  -d "after_completion[type]=redirect" \
  --data-urlencode "after_completion[redirect][url]=$THANK_YOU_URL")

if printf '%s' "$RESP" | grep -q '"error"'; then
  echo
  echo "Stripe rejected the request:"
  printf '%s' "$RESP" | tr ',' '\n' | grep -E '"(message|param|code)"' | sed 's/^ */  /'
  echo
  echo "If it mentions tax or an origin address, add AUTOMATIC_TAX=false to .env and rerun."
  exit 1
fi

printf '%s' "$RESP" | tr ',' '\n' | grep -E '"(id|url)"'
