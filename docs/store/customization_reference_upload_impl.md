# Customization Optional Reference Upload and Notes

## Overview
Implemented optional reference context fields for customer customization orders in the Paksarzameen Store frontend.

## What Was Added
- Optional reference image upload input.
- Optional description/notes textarea.
- Added to both flows:
  - Product-level customization add-to-cart flow.
  - Category-level custom order flow.

## Implementation Details
- Product flow file: `store/src/app/products/[slug]/AddToCartButton.tsx`
- Category flow file: `store/src/components/storefront/CategoryCustomizationPanel.tsx`
- Uploads reuse existing endpoint: `POST /api/upload`
- Payload persistence:
  - `__optional_reference_image` entry with URL in `value` and filename in `valueLabel`
  - `__optional_notes` entry with note text in `value` and `valueLabel`
- Both entries use `priceAdjustment: 0` so totals stay unchanged.

## Behavior Notes
- Feature is optional and does not block checkout.
- Existing required customization validation remains unchanged.
- Cart item uniqueness key already includes customization values, so different notes/images remain distinct entries.

## Validation
- Store production build completed successfully after changes.
