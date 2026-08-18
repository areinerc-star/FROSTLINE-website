export interface Product {
  id: number
  name: string
  sku: string
  price: number
  img: string
}

export const PRODUCTS: Product[] = [
  { name: "The Caddie Jacket [Navy]", sku: "OR_CAD_N", price: 3200, img: "/images/product-jacket.png" },
  { name: "ORGC Traditions Crewneck [Burgundy]", sku: "OR_CRW_B", price: 2100, img: "/images/product-crewneck.png" },
  { name: "1990s Heritage Polo", sku: "OR-HGP_B", price: 1850, img: "/images/product-polo.png" },
  { name: "Pleated Daily Trouser [Khaki]", sku: "OR_TRO_K", price: 1800, img: "/images/product-trouser.png" },
  { name: "Reflections T-Shirt [Black]", sku: "OR_RFL_B", price: 1000, img: "/images/product-tee.png" },
  { name: "Heritage Rope Cap [Olive]", sku: "OR-SC_OG", price: 750, img: "/images/product-cap.png" },
  { name: "OR Monogram T-Shirt [Black]", sku: "OR_ORMT_B", price: 1000, img: "/images/product-monogram-tee.png" },
  { name: "Odd Ritual Classic Polo [Cream]", sku: "OR-CGP_B", price: 850, img: "/images/product-classic-polo.png" },
].map((p, id) => ({ ...p, id }))

export const formatPrice = (n: number) =>
  "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 2 })
