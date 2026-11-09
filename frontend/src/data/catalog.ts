/**
 * MOCK CATALOGUE for the UI phase.
 *
 * Every artwork image here is a licensed STAND-IN (public-domain 19th-century prints and
 * watercolours of Bengal from Wikimedia Commons, credited on /credits) until Rubel Khan's
 * own photographs arrive. Titles describe the stand-in's subject; prices, sizes, years,
 * exhibitions and statuses are placeholders to exercise every UI state (available, sold,
 * sale price, limited print, not for sale). Replace the whole file with API data in Phase 2.
 */
import type { Artwork, Category, Collection, Exhibition, PortfolioProject } from "@/lib/types";
import { img } from "./images";

const bdt = (taka: number) => ({ amount: taka * 100, currency: "BDT" as const });

export const categories: Category[] = [
  { id: 1, slug: "watercolour", name: "Watercolour", parentId: null, description: "Watercolour on paper: rivers, streets and light." },
  { id: 2, slug: "acrylic", name: "Acrylic", parentId: null, description: "Acrylic on canvas and paper." },
  { id: 3, slug: "oil", name: "Oil", parentId: null, description: "Oil on canvas." },
  { id: 4, slug: "printmaking", name: "Printmaking", parentId: null, description: "Etching, aquatint and lithograph, in numbered editions." },
  { id: 5, slug: "sketches", name: "Sketches", parentId: null, description: "Pen, ink and wash drawings made on the spot." },
  { id: 6, slug: "miniature", name: "Miniature", parentId: null, description: "Small works, 12 inches or under." },
];

export const collections: Collection[] = [
  { id: 1, slug: "old-dhaka", name: "Old Dhaka", description: "Lanes, mosques and markets of the old city." },
  { id: 2, slug: "rivers", name: "Rivers and ghats", description: "Boats, banks and water across Bengal." },
  { id: 3, slug: "travels", name: "Travel paintings", description: "Places painted outside Bangladesh." },
];

let nextId = 1;
function artwork(a: Omit<Artwork, "id" | "sku" | "createdAt" | "productType" | "dimensionUnit" | "depth"> & { createdAt?: string }): Artwork {
  const id = nextId++;
  return {
    id,
    sku: `RK-${String(id).padStart(4, "0")}`,
    productType: "physical",
    dimensionUnit: "in",
    depth: null,
    createdAt: a.createdAt ?? `2025-${String(12 - (id % 11)).padStart(2, "0")}-01T00:00:00Z`,
    ...a,
  };
}

export const artworks: Artwork[] = [
  artwork({
    slug: "ghats-at-benares",
    title: "Ghats at Benares",
    description: "Morning on the stepped ghats, the river still and the buildings stacked to the waterline.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(45000), compareAtPrice: null,
    medium: "Watercolour on paper", width: 30, height: 22, year: 2025, isFramed: true,
    categoryId: 1, collectionIds: [2, 3], isNewArrival: true,
    images: [img("f36673693", "Watercolour of stepped ghats and tall riverside buildings at Benares, a boat on still water")],
  }),
  artwork({
    slug: "ruins-at-gour",
    title: "Ruins at Gour",
    description: "A gateway of the old city half taken back by trees, on the bank of the Ganges.",
    editionType: "original", editionSize: null, status: "sold", stockQty: 0,
    price: bdt(40000), compareAtPrice: null,
    medium: "Watercolour on paper", width: 30, height: 22, year: 2024, isFramed: true,
    categoryId: 1, collectionIds: [2], isNewArrival: false,
    images: [img("f36673634", "Watercolour of a ruined brick gateway overgrown with trees beside a river")],
  }),
  artwork({
    slug: "road-to-rohtas",
    title: "Road to Rohtas",
    description: "The climb to the hill fort, a tomb on the ridge and a waterfall falling behind it.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(35000), compareAtPrice: null,
    medium: "Acrylic on paper", width: 24, height: 18, year: 2025, isFramed: false,
    categoryId: 2, collectionIds: [3], isNewArrival: true,
    images: [img("f59549712", "Painting of a hill road leading to a domed tomb under trees, a waterfall in the distance")],
  }),
  artwork({
    slug: "rock-in-the-ganges",
    title: "Rock in the Ganges",
    description: "A temple built into a rock island, its reflection broken by a passing boat.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(60000), compareAtPrice: null,
    medium: "Oil on canvas", width: 36, height: 24, year: 2023, isFramed: true,
    categoryId: 3, collectionIds: [2], isNewArrival: false,
    images: [img("f59746493", "Painting of a rocky island with a temple on top, rising from a calm river at dusk")],
  }),
  artwork({
    slug: "river-morning-near-kara",
    title: "River morning near Kara",
    description: "A small shrine on a grassy bluff above the water, one sail coming downstream.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(12000), compareAtPrice: null,
    medium: "Watercolour on paper", width: 15, height: 11, year: 2025, isFramed: false,
    categoryId: 1, collectionIds: [2], isNewArrival: true,
    images: [img("f133439513", "Watercolour of a white shrine on a green bluff above a river, a sailing boat below")],
  }),
  artwork({
    slug: "waterfall-at-dhuah-kund",
    title: "Waterfall at Dhuah Kund",
    description: "Water dropping through a sandstone gorge, painted in warm earth tones.",
    editionType: "original", editionSize: null, status: "sold", stockQty: 0,
    price: bdt(12000), compareAtPrice: null,
    medium: "Watercolour on paper", width: 15, height: 11, year: 2024, isFramed: false,
    categoryId: 1, collectionIds: [3], isNewArrival: false,
    images: [img("f133438244", "Watercolour of a waterfall pouring through a sandstone gorge")],
  }),
  artwork({
    slug: "boats-on-the-river",
    title: "Boats on the river",
    description: "Cargo boats under full sail, the far bank a pale line of temples.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(10000), compareAtPrice: bdt(12000),
    medium: "Watercolour on paper", width: 13, height: 10, year: 2025, isFramed: false,
    categoryId: 1, collectionIds: [2], isNewArrival: true,
    images: [img("f106065294", "Pale watercolour of cargo boats with large square sails on a wide river")],
  }),
  artwork({
    slug: "temples-by-the-jamuna",
    title: "Temples by the Jamuna",
    description: "Two curved temple towers against a moving sky, small enough for a desk or shelf.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(8000), compareAtPrice: null,
    medium: "Acrylic on paper", width: 10.5, height: 10.5, year: 2025, isFramed: false,
    categoryId: 6, collectionIds: [3], isNewArrival: true,
    images: [img("f1460269", "Small painting of two tall curved temple towers among trees under a cloudy sky")],
  }),
  artwork({
    slug: "ships-at-anchor",
    title: "Ships at anchor, evening",
    description: "Ink and wash study of masts in the dusk, drawn on the spot from the shore.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(6000), compareAtPrice: null,
    medium: "Ink and wash on paper", width: 8, height: 11, year: 2024, isFramed: false,
    categoryId: 5, collectionIds: [2], isNewArrival: false,
    images: [img("f152290133", "Grey ink wash drawing of tall ships anchored by a pavilion at dusk")],
  }),
  artwork({
    slug: "the-chowk-old-dhaka",
    title: "The Chowk, Old Dhaka",
    description: "Market day in front of the mosque: traders, elephants and awnings across the square.",
    editionType: "limited_print", editionSize: 20, status: "available", stockQty: 14,
    price: bdt(9000), compareAtPrice: null,
    medium: "Etching on paper", width: 18, height: 12, year: 2024, isFramed: false,
    categoryId: 4, collectionIds: [1], isNewArrival: false,
    images: [img("f31432766", "Etching of a crowded market square in front of a domed mosque, with an elephant and traders")],
  }),
  artwork({
    slug: "small-katra-old-dhaka",
    title: "Small Katra, Old Dhaka",
    description: "The caravanserai gate and its mosque, worked in etching and aquatint.",
    editionType: "limited_print", editionSize: 15, status: "sold", stockQty: 0,
    price: bdt(9000), compareAtPrice: null,
    medium: "Etching and aquatint", width: 18, height: 15, year: 2023, isFramed: false,
    categoryId: 4, collectionIds: [1], isNewArrival: false,
    images: [img("f34837370", "Monochrome print of a ruined Mughal gateway and mosque with figures in front")],
  }),
  artwork({
    slug: "lalbagh-bastion",
    title: "Lalbagh bastion",
    description: "The fort wall at Lalbagh, overgrown and reflected in the moat.",
    editionType: "original", editionSize: null, status: "not_for_sale", stockQty: 0,
    price: bdt(0), compareAtPrice: null,
    medium: "Lithograph on paper", width: 18, height: 12, year: 2024, isFramed: true,
    categoryId: 4, collectionIds: [1], isNewArrival: false,
    images: [img("f12795749", "Monochrome lithograph of an overgrown fort bastion reflected in still water")],
  }),
  artwork({
    slug: "mosque-old-dhaka",
    title: "Mosque, Old Dhaka",
    description: "A small study of a mosque front under heavy trees, pen and ink.",
    editionType: "original", editionSize: null, status: "available", stockQty: 1,
    price: bdt(5000), compareAtPrice: null,
    medium: "Pen and ink on paper", width: 8, height: 6, year: 2025, isFramed: false,
    categoryId: 6, collectionIds: [1], isNewArrival: true,
    images: [img("f12795727", "Pen and ink drawing of a small mosque under large trees")],
  }),
];

/** Context photographs (not for sale): the places the paintings come from. */
export const placePhotos = {
  buriganga: img("f39160489", "Wooden boats crossing the Buriganga river in front of moored ferries"),
  boatDetail: img("f64554146", "A small wooden boat tied by a chain to the hull of a river ferry"),
  oldDhakaStreet: img("f64675696", "A narrow, busy street in Old Dhaka with shop signs and porters"),
};

export const portfolio: PortfolioProject[] = [
  {
    id: 1, slug: "old-dhaka-series", title: "Old Dhaka series", year: 2024, isPublished: true, sortOrder: 1,
    description: "Prints and drawings of the old city's gates, mosques and markets, worked from sketches made on site.",
    images: [
      img("f31432766", "Etching of a crowded market square in front of a domed mosque"),
      img("f34837370", "Monochrome print of a ruined Mughal gateway and mosque"),
      img("f12795749", "Lithograph of an overgrown fort bastion reflected in water"),
      img("f12795727", "Pen and ink drawing of a small mosque under large trees"),
    ],
  },
  {
    id: 2, slug: "rivers-of-bengal", title: "Rivers of Bengal", year: 2025, isPublished: true, sortOrder: 2,
    description: "Boats, ghats and banks painted along the rivers, most of them in watercolour.",
    images: [
      img("f36673693", "Watercolour of stepped ghats at Benares"),
      img("f106065294", "Watercolour of cargo boats under sail"),
      img("f59746493", "Painting of a temple on a rock island in a river"),
      img("f133439513", "Watercolour of a shrine on a bluff above a river"),
    ],
  },
];

export const exhibitions: Exhibition[] = [
  {
    id: 1, slug: "rivers-and-ghats-2025", title: "Rivers and ghats",
    venue: "Gallery to be confirmed", city: "Dhaka",
    startsAt: "2025-03-07", endsAt: "2025-03-21",
    description: "Twenty-four watercolours and oils from the river series.",
    image: img("f59746493", "Painting of a temple on a rock island in a river at dusk"),
  },
  {
    id: 2, slug: "old-dhaka-prints-2024", title: "Old Dhaka in print",
    venue: "Gallery to be confirmed", city: "Dhaka",
    startsAt: "2024-11-02", endsAt: "2024-11-16",
    description: "Etchings and lithographs of the old city, shown with the sketches they started from.",
    image: img("f31432766", "Etching of a market square in front of a mosque"),
  },
];
