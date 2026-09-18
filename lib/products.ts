export interface Product {
  id: number
  name: string
  sku: string
  price: number
  img: string
}

export const PRODUCTS: Product[] = [
  { name: "FROSTLINE PILIPINAS singlet", sku: "FRL-PH-TNK", price: 450, img: "/images/PILIPINAS blue.png" },
  { name: "PR PROJECT Racerback Singlet", sku: "FRL-PJ-SGL", price: 450, img: "/images/PR PROJECT black  singlet (front).png" },
  { name: "PR PROJECT Speed Suit", sku: "FRL-PJ-SPD", price: 999, img: "/images/PR PROJECT red speed suit (front)).png" },
  { name: "PR PROJECT Midriff Crop Top", sku: "FRL-PJ-MDF", price: 399, img: "/images/PR PROJECT white midriff (front).png" },
  { name: "PR PROJECT Crew T-Shirt", sku: "FRL-PJ-TEE", price: 550, img: "/images/PR PROJECT white tshirt (front).png" },
].map((p, id) => ({ ...p, id }))

export const formatPrice = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 })
