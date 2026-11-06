'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { GridProduct, GRID_PRODUCTS } from './shop-grid'
import { Product, formatPrice } from '@/lib/products'

// -------------------------------------------------------------
// NEW PRODUCT DATA FORMAT
// Each product can define colorVariations. Clicking a color swaps
// the Top Hero image + all 4 Model Photos below it.
//
// {
//   name, sku, price,
//   sizes: ['S','M','L','XL','XXL'],
//   flatImg: '/images/x.png',          // shop grid card
//   lifestyleImg: '/images/x-hover.png', // shop grid hover
//   colorVariations: {
//     Black: { heroImg: '/images/black-front.png', modelPhotos: [4 paths] },
//     White: { ... },
//     Red:   { ... },
//   },
// }
// -------------------------------------------------------------
export interface ColorVariation {
  heroImg: string
  modelPhotos: string[]
}

export type ProductWithVariations = GridProduct & {
  sizes?: string[]
  colorVariations?: Record<string, ColorVariation>
}

// -------------------------------------------------------------
// FROSTLINE PRODUCT CATALOG (all items)
// Images live in /public/images/ (flat). Paths are case-sensitive.
// price: 0 = TODO — set real prices.
// -------------------------------------------------------------
export interface CatalogProduct {
  id: string
  name: string
  sku: string
  price: number
  sizes: string[]
  flatImg: string
  lifestyleImg: string
  colorVariations: Record<string, ColorVariation>
}

export const FROSTLINE_PRODUCTS: CatalogProduct[] = [
  // ===== FROSTLINE =====
  {
    name: 'FROSTLINE Singlet',
    id: 'FRL-CL-SGL',
    sku: 'FRL-CL-SGL',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-singlet-THI.png',
    lifestyleImg: '/images/FROSTLINE_Singlet-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-singlet-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Singlet-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Singlet-crimson_Three-Quarter Angle_2.png',
          '/images/FROSTLINE_Singlet-crimson_Close-Up-Chest_3.png',
          '/images/FROSTLINE_Singlet-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-singlet-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Singlet-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Singlet-teal_Three-Quarter Angle_2.png',
          '/images/FROSTLINE_Singlet-teal_Close-Up-Chest_3.png',
          '/images/FROSTLINE_Singlet-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Tshirt',
    id: 'FRL-CL-TEE',
    sku: 'FRL-CL-TEE',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-tshirt-THI.png',
    lifestyleImg: '/images/FROSTLINE_Tshirt-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-tshirt-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Tshirt-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Tshirt-crimson_Three-quarter back_2.png',
          '/images/FROSTLINE_Tshirt-crimson_Three-quarter front_3.png',
          '/images/FROSTLINE_Tshirt-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-tshirt-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Tshirt-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Tshirt-teal_Three-quarter back_2.png',
          '/images/FROSTLINE_Tshirt-teal_Three-quarter front_3.png',
          '/images/FROSTLINE_Tshirt-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Cycling Short',
    id: 'FRL-CL-CYC',
    sku: 'FRL-CL-CYC',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-cyclings-THI.png',
    lifestyleImg: '/images/FROSTLINE_Cyclings-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-cyclings-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Cyclings-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Cyclings-crimson_Quad-stretch_2.png',
          '/images/FROSTLINE_Cyclings-crimson_Knee-sprint_3.png',
          '/images/FROSTLINE_Cyclings-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-cyclings-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Cyclings-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Cyclings-teal_Quad-stretch_2.png',
          '/images/FROSTLINE_Cyclings-teal_Knee-sprint_3.png',
          '/images/FROSTLINE_Cyclings-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Midriff',
    id: 'FRL-CL-MDF',
    sku: 'FRL-CL-MDF',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-midriff-THI.png',
    lifestyleImg: '/images/FROSTLINE_Midriff-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-midriff-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Midriff-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Midriff-crimson_Back-Muscle_2.png',
          '/images/FROSTLINE_Midriff-crimson_Close-Up-Chest_3.png',
          '/images/FROSTLINE_Midriff-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-midriff-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Midriff-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Midriff-teal_Back-Muscle_2.png',
          '/images/FROSTLINE_Midriff-teal_Close-Up-Chest_3.png',
          '/images/FROSTLINE_Midriff-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Warmer',
    id: 'FRL-CL-WRM',
    sku: 'FRL-CL-WRM',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-warmer-THI.png',
    lifestyleImg: '/images/FROSTLINE_Warmer-crimson_Pulling_Hood_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-warmer-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Warmer-crimson_Pulling_Hood_1.png',
          '/images/FROSTLINE_Warmer-crimson_Squat_2.png',
          '/images/FROSTLINE_Warmer-crimson_Three-Quarter Angle_3.png',
          '/images/FROSTLINE_Warmer-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-warmer-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Warmer-teal_Pulling_Hood_1.png',
          '/images/FROSTLINE_Warmer-teal_Squat_2.png',
          '/images/FROSTLINE_Warmer-teal_Three-Quarter Angle_3.png',
          '/images/FROSTLINE_Warmer-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Cropped Singlet',
    id: 'FRL-CL-CRP',
    sku: 'FRL-CL-CRP',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-cropped-THI.png',
    lifestyleImg: '/images/FROSTLINE_Cropped-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-cropped-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Cropped-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Cropped-crimson_Hand-Raise_2.png',
          '/images/FROSTLINE_Cropped-crimson_Close-Up-Chest_3.png',
          '/images/FROSTLINE_Cropped-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-cropped-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Cropped-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Cropped-teal_Hand-Raise_2.png',
          '/images/FROSTLINE_Cropped-teal_Close-Up-Chest_3.png',
          '/images/FROSTLINE_Cropped-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Long Sleeve',
    id: 'FRL-CL-LSV',
    sku: 'FRL-CL-LSV',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-longsleeves-THI.png',
    lifestyleImg: '/images/FROSTLINE_Longsleeves-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-longsleeves-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Longsleeves-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Longsleeves-crimson_Three-Quarter Angle_2.png',
          '/images/FROSTLINE_Longsleeves-crimson_Run-Pose_3.png',
          '/images/FROSTLINE_Longsleeves-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-longsleeves-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Longsleeves-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Longsleeves-teal_Three-Quarter Angle_2.png',
          '/images/FROSTLINE_Longsleeves-teal_Run-pose_3.png',
          '/images/FROSTLINE_Longsleeves-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Chino-Collared Polo Shirt',
    id: 'FRL-CL-CHN',
    sku: 'FRL-CL-CHN',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-chino-THI.png',
    lifestyleImg: '/images/FROSTLINE_Chino-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-chino-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Chino-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Chino-crimson_Three-Quarter Angle_2.png',
          '/images/FROSTLINE_Chino-crimson_Hand-on-hips_3.png',
          '/images/FROSTLINE_Chino-crimson_Swing-Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-chino-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Chino-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Chino-teal_Three-Quarter Angle_2.png',
          '/images/FROSTLINE_Chino-teal_Hand-on-hips_3.png',
          '/images/FROSTLINE_Chino-teal_Swing-Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Polo Shirt',
    id: 'FRL-CL-PLO',
    sku: 'FRL-CL-PLO',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-poloshirt-THI.png',
    lifestyleImg: '/images/FROSTLINE_Polo-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-poloshirt-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Polo-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Polo-crimson_Three-Quarter Back_2.png',
          '/images/FROSTLINE_Polo-crimson_Three-Quarter Angle_3.png',
          '/images/FROSTLINE_Polo-crimson_Back-View_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-poloshirt-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Polo-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Polo-teal_Three-Quarter Back_2.png',
          '/images/FROSTLINE_Polo-teal_Three-Quarter Angle_3.png',
          '/images/FROSTLINE_Polo-teal_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Speedsuit',
    id: 'FRL-CL-SPD',
    sku: 'FRL-CL-SPD',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/FL_red-speedsuit-THI.png',
    lifestyleImg: '/images/FROSTLINE_Speedsuit-crimson_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/FL_red-speedsuit-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Speedsuit-crimson_Front-Hero_1.png',
          '/images/FROSTLINE_Speedsuit-crimson_Back-View_2.png',
          '/images/FROSTLINE_Speedsuit-crimson_Logo-detail_3.png',
          '/images/FROSTLINE_Speedsuit-crimson_Three-Quarter Angle_4.png',
        ],
      },
      Teal: {
        heroImg: '/images/FL_teal-speedsuit-THI.png',
        modelPhotos: [
          '/images/FROSTLINE_Speedsuit-teal_Front-Hero_1.png',
          '/images/FROSTLINE_Speedsuit-teal_Back-View_2.png',
          '/images/FROSTLINE_Speedsuit-teal_Logo-detail_3.png',
          '/images/FROSTLINE_Speedsuit-teal_Three-Quarter Angle_4.png',
        ],
      },
    },
  },
  // ===== PR PROJECT =====
  {
    name: 'PR PROJECT Singlet',
    id: 'FRL-PJ-SGL',
    sku: 'FRL-PJ-SGL',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/PR_black-singlet-THI.png',
    lifestyleImg: '/images/PRPROJECT_Singlet-black_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/PR_black-singlet-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Singlet-black_Front-Hero_1.png',
          '/images/PRPROJECT_Singlet-black_sprint_2.png',
          '/images/PRPROJECT_Singlet-black_hem-shot_3.png',
          '/images/PRPROJECT_Singlet-black_Back-View_4.png',
        ],
      },
      White: {
        heroImg: '/images/PR_white-singlet-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Singlet-white_Front-Hero_1.png',
          '/images/PRPROJECT_Singlet-white_sprint_2.png',
          '/images/PRPROJECT_Singlet-white_hem-shot_3.png',
          '/images/PRPROJECT_Singlet-white_Back-View_4.png',
        ],
      },
      Red: {
        heroImg: '/images/PR_red-singlet-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Singlet-red_Front-Hero_1.png',
          '/images/PRPROJECT_Singlet-red_sprint_2.png',
          '/images/PRPROJECT_Singlet-red_hem-shot_3.png',
          '/images/PRPROJECT_Singlet-red_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Tshirt',
    id: 'FRL-PJ-TEE',
    sku: 'FRL-PJ-TEE',
    price: 550,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/PR_black-tshirt-THI.png',
    lifestyleImg: '/images/PRPROJECT_Tshirt-black_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/PR_black-tshirt-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Tshirt-black_Front-Hero_1.png',
          '/images/PRPROJECT_Tshirt-black_Hem-Text-shot_2.png',
          '/images/PRPROJECT_Tshirt-black_Pull-Up_3.png',
          '/images/PRPROJECT_Tshirt-black_Back-View_4.png',
        ],
      },
      White: {
        heroImg: '/images/PR_white-tshirt-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Tshirt-white_Front-Hero_1.png',
          '/images/PRPROJECT_Tshirt-white_Hem-Text-shot_2.png',
          '/images/PRPROJECT_Tshirt-white_Pull-Up_3.png',
          '/images/PRPROJECT_Tshirt-white_Back-View_4.png',
        ],
      },
      Red: {
        heroImg: '/images/PR_red-tshirt-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Tshirt-red_Front-Hero_1.png',
          '/images/PRPROJECT_Tshirt-red_Hem-Text-shot_2.png',
          '/images/PRPROJECT_Tshirt-red_Pull-Up_3.png',
          '/images/PRPROJECT_Tshirt-red_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Cycling Short',
    id: 'FRL-PJ-CYC',
    sku: 'FRL-PJ-CYC',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/PR_black-cyclings-THI.png',
    lifestyleImg: '/images/PRPROJECT_Cyclings-black_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/PR_black-cyclings-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Cyclings-black_Front-Hero_1.png',
          '/images/PRPROJECT_Cyclings-black_Side-step_2.png',
          '/images/PRPROJECT_Cyclings-black_Squat-pose_3.png',
          '/images/PRPROJECT_Cyclings-black_Back-View_4.png',
        ],
      },
      White: {
        heroImg: '/images/PR_white-cyclings-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Cyclings-white_Front-Hero_1.png',
          '/images/PRPROJECT_Cyclings-white_Side-step_2.png',
          '/images/PRPROJECT_Cyclings-white_Squat-pose_3.png',
          '/images/PRPROJECT_Cyclings-white_Back-View_4.png',
        ],
      },
      Red: {
        heroImg: '/images/PR_red-cyclings-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Cyclings-red_Front-Hero_1.png',
          '/images/PRPROJECT_Cyclings-red_Side-step_2.png',
          '/images/PRPROJECT_Cyclings-red_Squat-pose_3.png',
          '/images/PRPROJECT_Cyclings-red_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Midriff',
    id: 'FRL-PJ-MDF',
    sku: 'FRL-PJ-MDF',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/PR_black-Midriff-THI.png',
    lifestyleImg: '/images/PRPROJECT_Midriff-black_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/PR_black-Midriff-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Midriff-black_Front-Hero_1.png',
          '/images/PRPROJECT_Midriff-black_Side-Stretch_2.png',
          '/images/PRPROJECT_Midriff-black_Close-Up-Chest_3.png',
          '/images/PRPROJECT_Midriff-black_Back-View_4.png',
        ],
      },
      White: {
        heroImg: '/images/PR_white-Midriff-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Midriff-white_Front-Hero_1.png',
          '/images/PRPROJECT_Midriff-white_Side-Stretch_2.png',
          '/images/PRPROJECT_Midriff-white_Close-Up-Chest_3.png',
          '/images/PRPROJECT_Midriff-white_Back-View_4.png',
        ],
      },
      Red: {
        heroImg: '/images/PR_red-Midriff-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Midriff-red_Front-Hero_1.png',
          '/images/PRPROJECT_Midriff-red_Side-Stretch_2.png',
          '/images/PRPROJECT_Midriff-red_Close-Up-Chest_3.png',
          '/images/PRPROJECT_Midriff-red_Back-View_4.png',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Speedsuit',
    id: 'FRL-PJ-SPD',
    sku: 'FRL-PJ-SPD',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/PR_black-speedsuit-THI.png',
    lifestyleImg: '/images/PRPROJECT_Speedsuit-black_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/PR_black-speedsuit-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Speedsuit-black_Front-Hero_1.png',
          '/images/PRPROJECT_Speedsuit-black_Three-Quarter Angle_2.png',
          '/images/PRPROJECT_Speedsuit-black_Close-Up-Chest_3.png.png',
          '/images/PRPROJECT_Speedsuit-black_Back-View_4.png',
        ],
      },
      White: {
        heroImg: '/images/PR_white-speedsuit-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Speedsuit-white_Front-Hero_1.png',
          '/images/PRPROJECT_Speedsuit-white_Three-Quarter Angle_2.png',
          '/images/PRPROJECT_Speedsuit-white_Close-Up-Chest_3.png.png',
          '/images/PRPROJECT_Speedsuit-white_Back-View_4.png',
        ],
      },
      Red: {
        heroImg: '/images/PR_red-speedsuit-THI.png',
        modelPhotos: [
          '/images/PRPROJECT_Speedsuit-red_Front-Hero_1.png',
          '/images/PRPROJECT_Speedsuit-red_Three-Quarter Angle_2.png',
          '/images/PRPROJECT_Speedsuit-red_Close-Up-Chest_3.png',
          '/images/PRPROJECT_Speedsuit-red_Back-View_4.png',
        ],
      },
    },
  },
  // ===== PILIPINAS =====
  {
    name: 'PILIPINAS Singlet',
    id: 'FRL-PH-TNK',
    sku: 'FRL-PH-TNK',
    price: 0, // TODO: set price
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/PH_black-singlet-THI.png',
    lifestyleImg: '/images/PILIPINAS_Singlet-black_Front-Hero_1.png',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/PH_black-singlet-THI.png',
        modelPhotos: [
          '/images/PILIPINAS_Singlet-black_Front-Hero_1.png',
          '/images/PILIPINAS_Singlet-black_Three-Quarter Angle_2.png',
          '/images/PILIPINAS_Singlet-black_Close-Up-Chest_3.png',
          '/images/PILIPINAS_Singlet-black_Back-View_4.png',
        ],
      },
      Blue: {
        heroImg: '/images/PH_blue-singlet-THI.png',
        modelPhotos: [
          '/images/PILIPINAS_Singlet-blue_Front-Hero_1.png',
          '/images/PILIPINAS_Singlet-blue_Three-Quarter Angle_2.png',
          '/images/PILIPINAS_Singlet-blue_Close-Up-Chest_3.png',
          '/images/PILIPINAS_Singlet-blue_Back-View_4.png',
        ],
      },
      Red: {
        heroImg: '/images/PH_red-singlet-THI.png',
        modelPhotos: [
          '/images/PILIPINAS_Singlet-red_Front-Hero_1.png',
          '/images/PILIPINAS_Singlet-red_Three-Quarter Angle_2.png',
          '/images/PILIPINAS_Singlet-red_Close-Up-Chest_3.png',
          '/images/PILIPINAS_Singlet-red_Back-View_4.png',
        ],
      },
      White: {
        heroImg: '/images/PH_white-singlet-THI.png',
        modelPhotos: [
          '/images/PILIPINAS_Singlet-white_Front-Hero_1.png',
          '/images/PILIPINAS_Singlet-white_Three-Quarter Angle_2.png',
          '/images/PILIPINAS_Singlet-white_Close-Up-Chest_3.png',
          '/images/PILIPINAS_Singlet-white_Back-View_4.png',
        ],
      },
    },
  },
]

// Find the catalog entry for a product (by sku, id, or exact name)
function findCatalogProduct(p: { sku?: string; id?: unknown; name?: string } | null): CatalogProduct | undefined {
  if (!p) return undefined
  return FROSTLINE_PRODUCTS.find(
    (c) =>
      (p.sku && c.sku === p.sku) ||
      (p.id !== undefined && String(p.id) === c.id) ||
      (p.name && c.name.toLowerCase() === p.name.toLowerCase())
  )
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const DEFAULT_COLORS = ['Black', 'White', 'Red']

// Colors come from colorVariations keys first (keeps their order), then legacy `colors`
function getColorList(p: ProductWithVariations | null): string[] {
  if (!p) return []
  if (p.colorVariations && Object.keys(p.colorVariations).length > 0) {
    return Object.keys(p.colorVariations)
  }
  if (p.colors && p.colors.length > 0) return p.colors
  return DEFAULT_COLORS
}

function getVariation(p: ProductWithVariations | null, color: string): ColorVariation | null {
  if (!p || !p.colorVariations || !color) return null
  if (p.colorVariations[color]) return p.colorVariations[color]
  // case-insensitive fallback
  const key = Object.keys(p.colorVariations).find((k) => k.toLowerCase() === color.toLowerCase())
  return key ? p.colorVariations[key] : null
}

interface ProductModalProps {
  product: GridProduct | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
  onSelectProduct?: (product: GridProduct) => void
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onSelectProduct,
}: ProductModalProps) {
  // -------------------------------------------------------------
  // ALL REACT HOOKS DECLARED UNCONDITIONALLY AT THE VERY TOP LEVEL
  // -------------------------------------------------------------

  // 1. State hooks
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeAccordion, setActiveAccordion] = useState<'details' | 'care' | null>('details')
  const [mounted, setMounted] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next')
  const [isSlideAnimating, setIsSlideAnimating] = useState(false)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [activeProduct, setActiveProduct] = useState<ProductWithVariations | null>(
    product as ProductWithVariations | null
  )

  // Color swatch hover states
  const [activePreviewColor, setActivePreviewColor] = useState<string | null>(null)
  const [tooltipLeft, setTooltipLeft] = useState<number>(80)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  // 2. Ref hooks
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const colorRowRef = useRef<HTMLDivElement>(null)

  // 3. Effect hooks

  // SSR safety mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset hover state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      setActivePreviewColor(null)
    }
  }, [isOpen])

  // Lock body scroll and reset modal container scrollTop on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
    } else {
      document.body.style.overflow = ''
      setLightboxIndex(null)
      setIsSlideAnimating(false)
      setOutgoingIndex(null)
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      setActivePreviewColor(null)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, product])

  // Sync active product when product prop updates
  useEffect(() => {
    if (product) {
      const incoming = product as ProductWithVariations
      const matched = GRID_PRODUCTS.find(
        (p) => p.id === product.id || p.sku === product.sku
      ) as ProductWithVariations | undefined

      const merged: ProductWithVariations = matched
        ? {
            ...matched,
            ...incoming,
            detailImages:
              incoming.detailImages && incoming.detailImages.length > 0
                ? incoming.detailImages
                : matched.detailImages,
            colors:
              incoming.colors && incoming.colors.length > 0
                ? incoming.colors
                : matched.colors,
            sizes:
              incoming.sizes && incoming.sizes.length > 0
                ? incoming.sizes
                : matched.sizes,
            colorVariations:
              incoming.colorVariations && Object.keys(incoming.colorVariations).length > 0
                ? incoming.colorVariations
                : matched.colorVariations,
          }
        : incoming

      // Catalog data (FROSTLINE_PRODUCTS) wins for name, price, sizes, images and colors
      const catalog = findCatalogProduct(merged)
      const fullProduct: ProductWithVariations = catalog
        ? ({
            ...merged,
            name: catalog.name,
            sku: catalog.sku,
            price: catalog.price,
            sizes: catalog.sizes,
            flatImg: catalog.flatImg,
            lifestyleImg: catalog.lifestyleImg,
            colorVariations: catalog.colorVariations,
          } as ProductWithVariations)
        : merged

      setActiveProduct(fullProduct)

      // Default to the first color in colorVariations (e.g. Black)
      const colors = getColorList(fullProduct)
      setSelectedColor(colors[0] || 'Black')

      // Default size: M if offered, else first available
      const sizes = fullProduct.sizes && fullProduct.sizes.length > 0 ? fullProduct.sizes : DEFAULT_SIZES
      setSelectedSize(sizes.includes('M') ? 'M' : sizes[0])

      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
    }
  }, [product])

  // -------------------------------------------------------------
  // LEGACY FALLBACK: only used when a product has NO colorVariations yet.
  // Safe to delete once every product uses the new format.
  // -------------------------------------------------------------
  const getSwatchCandidates = (product: ProductWithVariations | null, color: string): string[] => {
    if (!product) return []

    const colorKey = color.trim()
    const sku = product.sku || ''
    const name = product.name?.toLowerCase() || ''

    let mappedFiles: string[] = []

    if (sku === 'FRL-PH-TNK' || name.includes('pilipinas')) {
      if (colorKey === 'Blue') mappedFiles = ['PILIPINAS blue.png']
      else if (colorKey === 'Black') mappedFiles = ['PILIPINAS black.png']
      else if (colorKey === 'White') mappedFiles = ['PILIPINAS white.png']
      else if (colorKey === 'Red') mappedFiles = ['PILIPINAS red.png']
    } else if (sku === 'FRL-PJ-SGL' || name.includes('racerback') || name.includes('singlet')) {
      if (colorKey === 'Black') mappedFiles = ['PR PROJECT black  singlet (front).png', 'PR PROJECT black singlet (front).png']
      else if (colorKey === 'White') mappedFiles = ['PR PROJECT white singlet (front).png']
      else if (colorKey === 'Red') mappedFiles = ['PR PROJECT red singlet (front).png']
    } else if (sku === 'FRL-PJ-SPD' || name.includes('speed suit')) {
      if (colorKey === 'Black') mappedFiles = ['PR PROJECT black speed suit (front).png']
      else if (colorKey === 'White') mappedFiles = ['PR PROJECT white speed suit (front).png']
      else if (colorKey === 'Red') mappedFiles = ['PR PROJECT red speed suit (front).png']
    } else if (sku === 'FRL-PJ-TEE' || name.includes('t-shirt') || name.includes('crew')) {
      if (colorKey === 'Black') mappedFiles = ['PR PROJECT black tshirt (front).png']
      else if (colorKey === 'White') mappedFiles = ['PR PROJECT white tshirt (front).png']
      else if (colorKey === 'Red') mappedFiles = ['PR PROJECT red tshirt (front).png']
    } else if (sku === 'FRL-PJ-MDF' || name.includes('midriff') || name.includes('crop')) {
      if (colorKey === 'Black') mappedFiles = ['PR PROJECT black midriff (front).png']
      else if (colorKey === 'White') mappedFiles = ['PR PROJECT white midriff (front).png']
      else if (colorKey === 'Red') mappedFiles = ['PR PROJECT red midriff (front).png']
    }

    const slug = color.toLowerCase().replace(/\s+/g, '-')
    const genericFiles = [`${slug}.jpg`, `${slug}.png`]

    const allFilenames = [...mappedFiles, ...genericFiles]
    const paths: string[] = []

    for (const fn of allFilenames) {
      paths.push(`/images/${fn}`)
      if (fn.includes(' ')) {
        paths.push(`/images/${encodeURIComponent(fn)}`)
      }
      paths.push(`/${fn}`)
      if (fn.includes(' ')) {
        paths.push(`/${encodeURIComponent(fn)}`)
      }
    }

    // Determine fallback image from product details so preview is never empty
    const colorsList = getColorList(product)
    const colorIndex = colorsList.findIndex((c) => c.toLowerCase() === colorKey.toLowerCase())
    const detailImg =
      product.detailImages && colorIndex >= 0 && colorIndex < product.detailImages.length
        ? product.detailImages[colorIndex]
        : null

    const productFallbacks = [
      detailImg,
      product.flatImg,
      product.lifestyleImg,
      product.img,
    ].filter(Boolean) as string[]

    for (const fb of productFallbacks) {
      paths.push(fb)
    }

    return Array.from(new Set(paths))
  }

  const getLegacySwatchSrc = (color: string): string | null => {
    const candidates = getSwatchCandidates(activeProduct, color)
    for (const path of candidates) {
      if (!failedImages[path]) {
        return path
      }
    }
    return null
  }

  // Hero image for a color: colorVariations[color].heroImg first, legacy fallback otherwise
  const getHeroForColor = (color: string): string | null => {
    const variation = getVariation(activeProduct, color)
    if (variation?.heroImg && !failedImages[variation.heroImg]) return variation.heroImg
    return getLegacySwatchSrc(color)
  }

  // Derived values for image lists
  const currentProduct = activeProduct
  const currentVariation = getVariation(currentProduct, selectedColor)

  const heroImage =
    (selectedColor ? getHeroForColor(selectedColor) : null) ||
    (currentProduct ? currentProduct.flatImg || currentProduct.lifestyleImg : '') ||
    ''

  // 4 model photos for the selected color (new format), legacy fallback otherwise
  const detailGridImages: string[] = currentProduct
    ? currentVariation?.modelPhotos && currentVariation.modelPhotos.length > 0
      ? currentVariation.modelPhotos
      : currentProduct.detailImages && currentProduct.detailImages.length > 0
        ? currentProduct.detailImages
        : ([
            currentProduct.lifestyleImg,
            currentProduct.lifestyleImg,
            currentProduct.lifestyleImg,
            currentProduct.lifestyleImg,
          ].filter(Boolean) as string[])
    : []

  const breakoutImage = currentProduct?.breakoutImg || null
  const allImages = [
    heroImage,
    ...detailGridImages,
    ...(breakoutImage ? [breakoutImage] : []),
  ].filter(Boolean)

  const handleLightboxNext = () => {
    if (lightboxIndex === null || isSlideAnimating || allImages.length === 0) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const nextIdx = (lightboxIndex + 1) % allImages.length

    if (prefersReduced) {
      setLightboxIndex(nextIdx)
      return
    }

    setOutgoingIndex(lightboxIndex)
    setSlideDirection('next')
    setIsSlideAnimating(true)
    setLightboxIndex(nextIdx)

    setTimeout(() => {
      setOutgoingIndex(null)
      setIsSlideAnimating(false)
    }, 650)
  }

  const handleLightboxPrev = () => {
    if (lightboxIndex === null || isSlideAnimating || allImages.length === 0) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const prevIdx = (lightboxIndex - 1 + allImages.length) % allImages.length

    if (prefersReduced) {
      setLightboxIndex(prevIdx)
      return
    }

    setOutgoingIndex(lightboxIndex)
    setSlideDirection('prev')
    setIsSlideAnimating(true)
    setLightboxIndex(prevIdx)

    setTimeout(() => {
      setOutgoingIndex(null)
      setIsSlideAnimating(false)
    }, 650)
  }

  // Handle keyboard events (Escape to close, Arrow keys for vertical slide navigation)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleLightboxNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handleLightboxPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, isSlideAnimating, allImages.length])

  // -------------------------------------------------------------
  // ALL HOOKS ARE UNCONDITIONALLY EXECUTED BEFORE ANY RETURN!
  // -------------------------------------------------------------

  if (!mounted) return null
  if (!activeProduct) return null

  const SIZES = activeProduct.sizes && activeProduct.sizes.length > 0 ? activeProduct.sizes : DEFAULT_SIZES
  const COLORS = getColorList(activeProduct)
  // "Complete the look": 3 other catalog items from the same line first (FROSTLINE / PR PROJECT)
  const activeLine = activeProduct.name?.split(' ')[0] || ''
  const otherItems = FROSTLINE_PRODUCTS.filter((p) => p.sku !== activeProduct.sku)
  const recommendations = [
    ...otherItems.filter((p) => p.name.startsWith(activeLine)),
    ...otherItems.filter((p) => !p.name.startsWith(activeLine)),
  ].slice(0, 3) as unknown as GridProduct[]

  const handleAdd = () => {
    onAddToCart(activeProduct)
    onClose()
  }

  const handleSwatchMouseEnter = (col: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    if (colorRowRef.current) {
      const rowRect = colorRowRef.current.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      const center = btnRect.left + btnRect.width / 2 - rowRect.left
      const clampedCenter = Math.max(80, Math.min(rowRect.width - 80, center))
      setTooltipLeft(clampedCenter)
    }

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }

    setActivePreviewColor(col)
  }

  const handleSwatchMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setActivePreviewColor(null)
  }

  // Clicking a color swaps the hero + all 4 model photos, and closes the lightbox if open
  const handleColorSelect = (col: string) => {
    setSelectedColor(col)
    setActivePreviewColor(col)
    setLightboxIndex(null)
  }

  const markFailed = (src: string) => {
    if (!src) return
    console.warn(`Product image not found at: ${src}`)
    setFailedImages((prev) => (prev[src] ? prev : { ...prev, [src]: true }))
  }

  const isVisible = isOpen && product !== null

  const modalJSX = (
    <>
      {/* Dim backdrop overlay */}
      <div
        className="product-modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99990,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'opacity 650ms cubic-bezier(0.22, 1, 0.36, 1), visibility 650ms step-end',
        }}
      />

      {/* Slide-UP modal container portalled directly to document.body */}
      <div
        ref={containerRef}
        className="product-modal-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          backgroundColor: '#FFFFFF',
          color: '#111111',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          pointerEvents: isVisible ? 'auto' : 'none',
          visibility: isVisible ? 'visible' : 'hidden',
          transition: 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), visibility 650ms step-end',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top sticky header bar with FROSTLINE Logo */}
        <div className="product-modal-topbar">
          <a
            href="#top"
            className="nav__logo"
            aria-label="Frostline home"
            onClick={(e) => {
              e.preventDefault()
              onClose()
            }}
            style={{ display: 'flex', alignItems: 'center', height: '44px' }}
          >
            <img
              src="/FROSTLINE_Website_Logo_black.png"
              alt="FROSTLINE Logo"
              className="nav__logo-img"
              style={{
                height: '44px',
                maxHeight: '44px',
                minHeight: '44px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'none',
              }}
            />
          </a>
          <button
            onClick={onClose}
            className="product-modal-close-btn"
            aria-label="Close product details"
          >
            CLOSE ✕
          </button>
        </div>

        {/* Modal Main Scroll Viewport */}
        <div className="product-modal-body">
          {/* SECTION 1 & 2: 2-Column Split (Left: Hero Image + 2-Column Detail Grid, Right: Sticky Info Panel) */}
          <div className="product-modal-split">
            {/* Left Column: Hero Image + 2-Column Model Photo Grid */}
            <div className="product-modal-left-col">
              {/* Hero product image for the selected color (click opens lightbox index 0) */}
              <div
                className="product-modal-hero-wrap"
                onClick={() => setLightboxIndex(0)}
                style={{ cursor: 'pointer' }}
                title="Click to view full image lightbox"
              >
                <img
                  key={`hero-${selectedColor}-${heroImage}`}
                  src={heroImage}
                  alt={`${activeProduct.name} — ${selectedColor}`}
                  className="product-modal-hero-img"
                  onError={() => markFailed(heroImage)}
                />
              </div>

              {/* 4 model photos for the selected color (click opens lightbox) */}
              <div className="product-modal-detail-grid">
                {detailGridImages.map((src, idx) => (
                  <div
                    key={`${selectedColor}-${idx}-${src}`}
                    className="product-modal-grid-cell"
                    onClick={() => setLightboxIndex(idx + 1)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view full image lightbox"
                  >
                    <img
                      src={src}
                      alt={`${activeProduct.name} — ${selectedColor} model photo ${idx + 1}`}
                      onError={() => markFailed(src)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sticky Pinned Info Panel */}
            <div className="product-modal-right-col">
              <div className="product-modal-sticky-panel">
                <div className="product-modal-info-header">
                  <h1 className="product-modal-title">{activeProduct.name}</h1>
                  <span className="product-modal-price">{formatPrice(activeProduct.price)}</span>
                </div>
                <span className="product-modal-sku">({activeProduct.sku})</span>

                <p className="product-modal-desc">
                  Crafted from heavyweight organic cotton with a refined vintage silhouette. Designed with heritage craftsmanship and tailored for effortless style on and off the course.
                </p>

                <div className="product-modal-divider" />

                {/* Collapsed Accordions */}
                <div className="product-modal-accordions">
                  <div className="accordion-item">
                    <button
                      className="accordion-header"
                      onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                    >
                      <span>GARMENT DETAILS</span>
                      <span className="accordion-icon">{activeAccordion === 'details' ? '−' : '+'}</span>
                    </button>
                    {activeAccordion === 'details' && (
                      <div className="accordion-body">
                        <ul>
                          <li>100% Premium Heavyweight Organic Cotton (400gsm)</li>
                          <li>Custom tonal embroidery on left chest</li>
                          <li>Reinforced ribbed collar & cuffs for longevity</li>
                          <li>Designed & ethically produced in South Africa</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="accordion-item">
                    <button
                      className="accordion-header"
                      onClick={() => setActiveAccordion(activeAccordion === 'care' ? null : 'care')}
                    >
                      <span>WASH CARE</span>
                      <span className="accordion-icon">{activeAccordion === 'care' ? '−' : '+'}</span>
                    </button>
                    {activeAccordion === 'care' && (
                      <div className="accordion-body">
                        <ul>
                          <li>Machine wash cold inside out (30°C max)</li>
                          <li>Do not bleach or tumble dry</li>
                          <li>Cool iron on reverse side, avoiding embroidery</li>
                          <li>Hang dry in shade to preserve garment color</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="product-modal-spacer" />

                {/* Color Selector + Size Selector + Add to Cart */}
                <div className="product-modal-buy-section">
                  <div
                    ref={colorRowRef}
                    className="product-modal-size-row"
                    style={{ marginBottom: '1rem', position: 'relative', zIndex: 50 }}
                    onMouseLeave={handleSwatchMouseLeave}
                  >
                    {/* Floating Hover Swatch Preview Tooltip (shows that color's hero image) */}
                    {activePreviewColor && (() => {
                      const currentSrc = getHeroForColor(activePreviewColor)
                      if (!currentSrc) return null

                      return (
                        <div
                          className="color-swatch-tooltip"
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 10px)',
                            left: `${tooltipLeft}px`,
                            transform: 'translateX(-50%)',
                            width: '210px',
                            height: '210px',
                            aspectRatio: '1 / 1',
                            padding: '10px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid rgba(0, 0, 0, 0.14)',
                            borderRadius: '8px',
                            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
                            overflow: 'hidden',
                            pointerEvents: 'none',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <img
                            src={currentSrc}
                            alt={`${activePreviewColor} color preview`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                            onError={() => markFailed(currentSrc)}
                          />
                        </div>
                      )
                    })()}

                    <span className="product-modal-size-label">COLOR:</span>
                    <div className="product-modal-sizes" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                      {COLORS.map((col) => (
                        <button
                          key={col}
                          className={`size-btn ${selectedColor === col ? 'is-selected' : ''}`}
                          onClick={() => handleColorSelect(col)}
                          onMouseEnter={(e) => handleSwatchMouseEnter(col, e)}
                          aria-pressed={selectedColor === col}
                          style={{ minWidth: 'auto', width: 'auto', paddingInline: '0.75rem', fontSize: '0.75rem' }}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="product-modal-size-row">
                    <span className="product-modal-size-label">SIZE:</span>
                    <div className="product-modal-sizes" style={{ flexWrap: 'wrap' }}>
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? 'is-selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                          aria-pressed={selectedSize === size}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="product-modal-add-btn" onClick={handleAdd}>
                    ADD TO CART — {formatPrice(activeProduct.price)}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Full-Width Breakout Image (click opens lightbox) */}
          {breakoutImage && (
            <div
              className="product-modal-breakout-section"
              onClick={() => setLightboxIndex(allImages.length - 1)}
              style={{ cursor: 'pointer' }}
              title="Click to view full image lightbox"
            >
              <img src={breakoutImage} alt={`${activeProduct.name} lifestyle breakout`} className="product-modal-breakout-img" />
            </div>
          )}

          {/* SECTION 4: "COMPLETE THE LOOK" 3-Column Recommendations */}
          <div className="product-modal-complete-look">
            <div className="complete-look-header">
              <span className="u-eyebrow">( RECOMMENDATIONS )</span>
              <h3 className="complete-look-title">COMPLETE THE LOOK</h3>
            </div>

            <div className="complete-look-grid">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="complete-look-tile"
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(rec)
                  }}
                >
                  <div className="complete-look-img-wrap">
                    <img src={rec.flatImg} alt={rec.name} className="complete-look-flat-img" />
                    <img src={rec.lifestyleImg} alt={`${rec.name} lifestyle`} className="complete-look-lifestyle-img" />
                    <div className="complete-look-sku-overlay">
                      <span>({rec.sku})</span>
                    </div>
                    <div className="complete-look-view-tag">
                      ‹ VIEW PRODUCT ›
                    </div>
                  </div>
                  <div className="complete-look-info">
                    <span className="complete-look-name">{rec.name}</span>
                    <span className="complete-look-price">{formatPrice(rec.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Viewport Full-Bleed Lightbox Viewport matching IDEALREFERENCE.mp4 */}
      {lightboxIndex !== null && (
        <div
          className="modal-lightbox-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            overflow: 'hidden',
          }}
        >
          {/* Top sticky header bar visually overlapping the sliding image track */}
          <div
            className="product-modal-topbar"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderBottom: 'none',
              minHeight: '60px',
              padding: '1rem var(--gutter)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <a
              href="#top"
              className="nav__logo"
              aria-label="Frostline home"
              onClick={(e) => {
                e.preventDefault()
                setLightboxIndex(null)
                onClose()
              }}
              style={{ display: 'flex', alignItems: 'center', height: '44px' }}
            >
              <img
                src="/FROSTLINE_Website_Logo_black.png"
                alt="FROSTLINE Logo"
                className="nav__logo-img"
                style={{
                  height: '44px',
                  maxHeight: '44px',
                  minHeight: '44px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </a>
            <button
              onClick={() => setLightboxIndex(null)}
              className="product-modal-close-btn"
              aria-label="Close lightbox"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                background: 'rgba(0, 0, 0, 0.25)',
              }}
            >
              CLOSE ✕
            </button>
          </div>

          {/* Main Full-Bleed Image Viewport with Directional Vertical Slide Transition */}
          <div
            className="lightbox-main-viewport"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              backgroundColor: '#0a0a0a',
            }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Outgoing Image sliding out (UP on next, DOWN on prev) */}
            {isSlideAnimating && outgoingIndex !== null && (
              <img
                key={`outgoing-${outgoingIndex}`}
                src={allImages[outgoingIndex]}
                alt="Outgoing slide"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  zIndex: 1,
                  animation: `${slideDirection === 'next' ? 'lightboxSlideOutUp' : 'lightboxSlideOutDown'} 650ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                }}
              />
            )}

            {/* Incoming / Active Image sliding in (UP from bottom on next, DOWN from top on prev) */}
            <img
              key={`active-${lightboxIndex}`}
              src={allImages[lightboxIndex]}
              alt={`${activeProduct.name} lightbox view ${lightboxIndex + 1}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                zIndex: 2,
                animation: isSlideAnimating
                  ? `${slideDirection === 'next' ? 'lightboxSlideInUp' : 'lightboxSlideInDown'} 650ms cubic-bezier(0.22, 1, 0.36, 1) forwards`
                  : 'none',
              }}
            />

            {/* Center PREV / NEXT Nav Buttons */}
            <div
              className="lightbox-nav-controls"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                transform: 'translateY(-50%)',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 var(--gutter)',
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <button
                onClick={handleLightboxPrev}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#111111',
                  border: '1px solid var(--hairline)',
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}
              >
                ‹ PREV
              </button>
              <button
                onClick={handleLightboxNext}
                style={{
                  pointerEvents: 'auto',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#111111',
                  border: '1px solid var(--hairline)',
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                }}
              >
                NEXT ›
              </button>
            </div>

            {/* Bottom-Right Numbered Counter (e.g. 01 / 06) */}
            <div
              className="lightbox-counter"
              style={{
                position: 'absolute',
                bottom: '2rem',
                right: 'var(--gutter)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#111111',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                border: '1px solid var(--hairline)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                zIndex: 20,
              }}
            >
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes lightboxSlideOutUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }

        @keyframes lightboxSlideOutDown {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        @keyframes lightboxSlideInUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes lightboxSlideInDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .product-modal-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem var(--gutter);
          border-bottom: 1px solid var(--hairline);
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 30;
          min-height: 60px;
        }

        .product-modal-close-btn {
          background: none;
          border: 1px solid var(--hairline);
          padding: 0.45rem 1.1rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .product-modal-close-btn:hover {
          background: #111111;
          color: #ffffff;
        }

        .product-modal-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        /* SECTION 1 & 2: Split 2-Column Layout */
        .product-modal-split {
          display: grid;
          grid-template-columns: 60% 40%;
          align-items: start;
          width: 100%;
        }

        @media (max-width: 768px) {
          .product-modal-split {
            grid-template-columns: 1fr;
          }
        }

        /* Left Column: Hero Image + 2-Column Grid */
        .product-modal-left-col {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .product-modal-hero-wrap {
          width: 100%;
          min-height: clamp(500px, 80vh, 900px);
          background: #f7f8f9;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
        }

        .product-modal-hero-img {
          max-width: 100%;
          max-height: calc(100vh - 90px);
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          animation: productImgFadeIn 350ms ease;
        }

        .product-modal-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: var(--hairline);
        }

        @media (max-width: 550px) {
          .product-modal-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-modal-grid-cell {
          aspect-ratio: 3 / 4;
          background: #f4f4f4;
          overflow: hidden;
        }

        .product-modal-grid-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          animation: productImgFadeIn 350ms ease;
        }

        @keyframes productImgFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-modal-hero-img,
          .product-modal-grid-cell img {
            animation: none;
          }
        }

        /* Right Column: Sticky Pinned Info Panel */
        .product-modal-right-col {
          width: 100%;
          height: 100%;
        }

        .product-modal-sticky-panel {
          position: sticky;
          top: 60px;
          padding: clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 3vw, 3rem);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #ffffff;
        }

        @media (max-width: 768px) {
          .product-modal-sticky-panel {
            position: relative;
            top: 0;
            padding: 2.5rem var(--gutter);
          }
        }

        .product-modal-info-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
        }

        .product-modal-title {
          font-size: clamp(1.5rem, 2.2vw, 2.1rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.1;
          color: #111111;
        }

        .product-modal-price {
          font-size: 1.25rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: #111111;
          white-space: nowrap;
        }

        .product-modal-sku {
          font-size: 0.75rem;
          color: var(--muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .product-modal-desc {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--muted);
        }

        .product-modal-divider {
          height: 1px;
          background: var(--hairline);
          margin: 0.25rem 0;
        }

        .product-modal-accordions {
          display: flex;
          flex-direction: column;
        }

        .accordion-item {
          border-bottom: 1px solid var(--hairline);
        }

        .accordion-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.9rem 0;
          background: none;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          color: #111111;
        }

        .accordion-icon {
          font-size: 1.1rem;
          font-weight: 400;
        }

        .accordion-body {
          padding-bottom: 1.25rem;
          padding-left: 1rem;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--muted);
        }

        .accordion-body ul {
          margin: 0;
          padding-left: 1rem;
        }

        .accordion-body li {
          margin-bottom: 0.4rem;
        }

        .product-modal-spacer {
          flex: 1;
          min-height: 1rem;
        }

        .product-modal-buy-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--hairline);
        }

        .product-modal-size-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .product-modal-size-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #111111;
        }

        .product-modal-sizes {
          display: flex;
          gap: 0.5rem;
        }

        .size-btn {
          width: 44px;
          height: 44px;
          border: 1px solid var(--hairline);
          background: #ffffff;
          color: #111111;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .size-btn.is-selected,
        .size-btn:hover {
          background: #111111;
          color: #ffffff;
          border-color: #111111;
        }

        .product-modal-add-btn {
          width: 100%;
          padding: 1.1rem;
          background: #111111;
          color: #ffffff;
          border: none;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .product-modal-add-btn:hover {
          opacity: 0.88;
        }

        /* SECTION 3: Full-Width Breakout Image */
        .product-modal-breakout-section {
          width: 100%;
          min-height: 80vh;
          background: #f4f4f4;
          overflow: hidden;
        }

        .product-modal-breakout-img {
          width: 100%;
          height: 100%;
          min-height: 80vh;
          object-fit: cover;
          display: block;
        }

        /* SECTION 4: COMPLETE THE LOOK Recommendations */
        .product-modal-complete-look {
          border-top: 1px solid var(--hairline);
          padding: clamp(3.5rem, 6vw, 6rem) var(--gutter);
          background: #ffffff;
        }

        .complete-look-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .complete-look-title {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        .complete-look-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.25rem, 2.5vw, 2.25rem);
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 950px) {
          .complete-look-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .complete-look-grid {
            grid-template-columns: 1fr;
          }
        }

        .complete-look-tile {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .complete-look-img-wrap {
          position: relative;
          aspect-ratio: 3 / 4;
          background: #eaeaea;
          border: 1px solid var(--hairline);
          overflow: hidden;
        }

        .complete-look-flat-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 1;
          transform: scale(1);
          transition: opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        .complete-look-lifestyle-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transform: scale(1);
          transition: opacity 450ms cubic-bezier(0.4, 0, 0.2, 1), transform 450ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        .complete-look-tile:hover .complete-look-flat-img {
          opacity: 0;
        }

        .complete-look-tile:hover .complete-look-lifestyle-img {
          opacity: 1;
          transform: scale(1.02);
        }

        .complete-look-sku-overlay {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 350ms ease;
          z-index: 5;
        }

        .complete-look-tile:hover .complete-look-sku-overlay {
          opacity: 1;
        }

        .complete-look-view-tag {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 350ms ease;
          z-index: 5;
        }

        .complete-look-tile:hover .complete-look-view-tag {
          opacity: 1;
        }

        .complete-look-info {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-top: 0.75rem;
          font-size: 0.85rem;
        }

        .complete-look-name {
          font-weight: 700;
          text-transform: uppercase;
        }

        .complete-look-price {
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </>
  )

  return createPortal(modalJSX, document.body)
}
