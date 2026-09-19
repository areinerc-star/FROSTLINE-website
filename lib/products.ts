export interface Product {
  id: number
  name: string
  sku: string
  price: number
  img: string
}

export const PRODUCTS: Product[] = [
  { name: "FROSTLINE PILIPINAS singlet", sku: "FRL-PH-TNK", price: 450, img: "/images/pilipinas-flat.png" },
  { name: "PR PROJECT Racerback Singlet", sku: "FRL-PJ-SGL", price: 450, img: "/images/singlet-flat.png" },
  { name: "PR PROJECT Speed Suit", sku: "FRL-PJ-SPD", price: 999, img: "/images/speedsuit-flat.png" },
  { name: "PR PROJECT Midriff Crop Top", sku: "FRL-PJ-MDF", price: 399, img: "/images/midriff-flat.png" },
  { name: "PR PROJECT Crew T-Shirt", sku: "FRL-PJ-TEE", price: 550, img: "/images/tshirt-flat.png" },
].map((p, id) => ({ ...p, id }))

export const formatPrice = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 })
