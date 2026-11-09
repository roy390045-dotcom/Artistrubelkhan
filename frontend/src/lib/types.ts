/**
 * Frontend view of the revised schema (docs/ERD-REVIEW.md). These are the shapes the
 * FastAPI backend will return; until it exists, src/data/* serves them from typed mocks
 * through src/lib/api.ts, the single swap point.
 *
 * Money is always an integer in minor units (poisha for BDT, cents for USD) plus a
 * currency code, matching the BIGINT columns in PostgreSQL. Never floats.
 */

export type Currency = "BDT" | "USD";

export interface Money {
  amount: number; // minor units
  currency: Currency;
}

export type ProductStatus = "available" | "sold" | "not_for_sale" | "reserved";
export type EditionType = "original" | "limited_print" | "open_print" | "digital";
export type ProductType = "physical" | "digital";
export type DimensionUnit = "in" | "cm";

/** A pre-built image: variants live at /art/<id>-<width>.<avif|webp>. */
export interface ImageAsset {
  id: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
  blur: string;
  color: string;
}

export interface Seo {
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  parentId: number | null;
  description: string;
  seo?: Seo;
}

export interface Collection {
  id: number;
  slug: string;
  name: string;
  description: string;
  seo?: Seo;
}

export interface Artwork {
  id: number;
  slug: string;
  sku: string;
  title: string;
  description: string;
  productType: ProductType;
  editionType: EditionType;
  editionSize: number | null;
  status: ProductStatus;
  stockQty: number;
  price: Money;
  compareAtPrice: Money | null;
  medium: string;
  width: number;
  height: number;
  depth: number | null;
  dimensionUnit: DimensionUnit;
  year: number;
  isFramed: boolean;
  categoryId: number;
  collectionIds: number[];
  images: ImageAsset[];
  isNewArrival: boolean;
  createdAt: string;
  seo?: Seo;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  title: string;
  year: number;
  description: string;
  images: ImageAsset[];
  isPublished: boolean;
  sortOrder: number;
}

export interface Exhibition {
  id: number;
  slug: string;
  title: string;
  venue: string;
  city: string;
  startsAt: string;
  endsAt: string;
  description: string;
  image: ImageAsset;
}

export interface CartLine {
  artworkId: number;
  quantity: number;
}

export type ShippingZoneId = "inside_dhaka" | "outside_dhaka" | "international";

export interface ShippingZone {
  id: ShippingZoneId;
  name: string;
  rate: Money;
  eta: string;
}

export type PaymentProvider = "sslcommerz" | "stripe";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
export type FulfillmentStatus = "unfulfilled" | "packed" | "shipped" | "delivered" | "cancelled";

export interface OrderSummary {
  publicId: string; // UUIDv7, used in URLs instead of the sequential id
  orderNumber: string;
  createdAt: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  total: Money;
  itemCount: number;
}

export interface ShopFilters {
  category?: string;
  collection?: string;
  medium?: string;
  availability?: "available" | "all";
  minPrice?: number; // major units, from the URL
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}
