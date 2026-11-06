// FROSTLINE catalog — the single source of truth for every product on the site
// (shop grid, featured carousel and product modal all read from here).

export interface ColorVariation {
  heroImg: string
  modelPhotos: string[]
}

// -------------------------------------------------------------
// FROSTLINE PRODUCT CATALOG (all items)
// Images live in /public/images/products/ (optimized .webp). Paths are case-sensitive.
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
    price: 350,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-singlet-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Singlet-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-singlet-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Singlet-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Singlet-crimson_Three-Quarter-Angle_2.webp',
          '/images/products/FROSTLINE_Singlet-crimson_Close-Up-Chest_3.webp',
          '/images/products/FROSTLINE_Singlet-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-singlet-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Singlet-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Singlet-teal_Three-Quarter-Angle_2.webp',
          '/images/products/FROSTLINE_Singlet-teal_Close-Up-Chest_3.webp',
          '/images/products/FROSTLINE_Singlet-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Tshirt',
    id: 'FRL-CL-TEE',
    sku: 'FRL-CL-TEE',
    price: 399,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-tshirt-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Tshirt-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-tshirt-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Tshirt-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Tshirt-crimson_Three-quarter-back_2.webp',
          '/images/products/FROSTLINE_Tshirt-crimson_Three-quarter-front_3.webp',
          '/images/products/FROSTLINE_Tshirt-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-tshirt-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Tshirt-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Tshirt-teal_Three-quarter-back_2.webp',
          '/images/products/FROSTLINE_Tshirt-teal_Three-quarter-front_3.webp',
          '/images/products/FROSTLINE_Tshirt-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Cycling Short',
    id: 'FRL-CL-CYC',
    sku: 'FRL-CL-CYC',
    price: 350,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-cyclings-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Cyclings-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-cyclings-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Cyclings-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Cyclings-crimson_Quad-stretch_2.webp',
          '/images/products/FROSTLINE_Cyclings-crimson_Knee-sprint_3.webp',
          '/images/products/FROSTLINE_Cyclings-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-cyclings-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Cyclings-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Cyclings-teal_Quad-stretch_2.webp',
          '/images/products/FROSTLINE_Cyclings-teal_Knee-sprint_3.webp',
          '/images/products/FROSTLINE_Cyclings-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Midriff',
    id: 'FRL-CL-MDF',
    sku: 'FRL-CL-MDF',
    price: 399,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-midriff-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Midriff-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-midriff-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Midriff-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Midriff-crimson_Back-Muscle_2.webp',
          '/images/products/FROSTLINE_Midriff-crimson_Close-Up-Chest_3.webp',
          '/images/products/FROSTLINE_Midriff-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-midriff-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Midriff-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Midriff-teal_Back-Muscle_2.webp',
          '/images/products/FROSTLINE_Midriff-teal_Close-Up-Chest_3.webp',
          '/images/products/FROSTLINE_Midriff-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Warmer',
    id: 'FRL-CL-WRM',
    sku: 'FRL-CL-WRM',
    price: 550,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-warmer-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Warmer-crimson_Pulling_Hood_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-warmer-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Warmer-crimson_Pulling_Hood_1.webp',
          '/images/products/FROSTLINE_Warmer-crimson_Squat_2.webp',
          '/images/products/FROSTLINE_Warmer-crimson_Three-Quarter-Angle_3.webp',
          '/images/products/FROSTLINE_Warmer-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-warmer-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Warmer-teal_Pulling_Hood_1.webp',
          '/images/products/FROSTLINE_Warmer-teal_Squat_2.webp',
          '/images/products/FROSTLINE_Warmer-teal_Three-Quarter-Angle_3.webp',
          '/images/products/FROSTLINE_Warmer-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Cropped Singlet',
    id: 'FRL-CL-CRP',
    sku: 'FRL-CL-CRP',
    price: 350,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-cropped-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Cropped-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-cropped-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Cropped-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Cropped-crimson_Hand-Raise_2.webp',
          '/images/products/FROSTLINE_Cropped-crimson_Close-Up-Chest_3.webp',
          '/images/products/FROSTLINE_Cropped-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-cropped-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Cropped-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Cropped-teal_Hand-Raise_2.webp',
          '/images/products/FROSTLINE_Cropped-teal_Close-Up-Chest_3.webp',
          '/images/products/FROSTLINE_Cropped-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Long Sleeve',
    id: 'FRL-CL-LSV',
    sku: 'FRL-CL-LSV',
    price: 499,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-longsleeves-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Longsleeves-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-longsleeves-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Longsleeves-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Longsleeves-crimson_Three-Quarter-Angle_2.webp',
          '/images/products/FROSTLINE_Longsleeves-crimson_Run-Pose_3.webp',
          '/images/products/FROSTLINE_Longsleeves-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-longsleeves-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Longsleeves-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Longsleeves-teal_Three-Quarter-Angle_2.webp',
          '/images/products/FROSTLINE_Longsleeves-teal_Run-pose_3.webp',
          '/images/products/FROSTLINE_Longsleeves-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Chino-Collared Polo Shirt',
    id: 'FRL-CL-CHN',
    sku: 'FRL-CL-CHN',
    price: 450,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-chino-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Chino-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-chino-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Chino-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Chino-crimson_Three-Quarter-Angle_2.webp',
          '/images/products/FROSTLINE_Chino-crimson_Hand-on-hips_3.webp',
          '/images/products/FROSTLINE_Chino-crimson_Swing-Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-chino-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Chino-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Chino-teal_Three-Quarter-Angle_2.webp',
          '/images/products/FROSTLINE_Chino-teal_Hand-on-hips_3.webp',
          '/images/products/FROSTLINE_Chino-teal_Swing-Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Polo Shirt',
    id: 'FRL-CL-PLO',
    sku: 'FRL-CL-PLO',
    price: 450,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-poloshirt-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Polo-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-poloshirt-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Polo-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Polo-crimson_Three-Quarter-Back_2.webp',
          '/images/products/FROSTLINE_Polo-crimson_Three-Quarter-Angle_3.webp',
          '/images/products/FROSTLINE_Polo-crimson_Back-View_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-poloshirt-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Polo-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Polo-teal_Three-Quarter-Back_2.webp',
          '/images/products/FROSTLINE_Polo-teal_Three-Quarter-Angle_3.webp',
          '/images/products/FROSTLINE_Polo-teal_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'FROSTLINE Speedsuit',
    id: 'FRL-CL-SPD',
    sku: 'FRL-CL-SPD',
    price: 999,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/FL_red-speedsuit-THI.webp',
    lifestyleImg: '/images/products/FROSTLINE_Speedsuit-crimson_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Red: {
        heroImg: '/images/products/FL_red-speedsuit-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Speedsuit-crimson_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Speedsuit-crimson_Back-View_2.webp',
          '/images/products/FROSTLINE_Speedsuit-crimson_Logo-detail_3.webp',
          '/images/products/FROSTLINE_Speedsuit-crimson_Three-Quarter-Angle_4.webp',
        ],
      },
      Teal: {
        heroImg: '/images/products/FL_teal-speedsuit-THI.webp',
        modelPhotos: [
          '/images/products/FROSTLINE_Speedsuit-teal_Front-Hero_1.webp',
          '/images/products/FROSTLINE_Speedsuit-teal_Back-View_2.webp',
          '/images/products/FROSTLINE_Speedsuit-teal_Logo-detail_3.webp',
          '/images/products/FROSTLINE_Speedsuit-teal_Three-Quarter-Angle_4.webp',
        ],
      },
    },
  },
  // ===== PR PROJECT =====
  {
    name: 'PR PROJECT Singlet',
    id: 'FRL-PJ-SGL',
    sku: 'FRL-PJ-SGL',
    price: 450,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/PR_black-singlet-THI.webp',
    lifestyleImg: '/images/products/PRPROJECT_Singlet-black_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/products/PR_black-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Singlet-black_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Singlet-black_sprint_2.webp',
          '/images/products/PRPROJECT_Singlet-black_hem-shot_3.webp',
          '/images/products/PRPROJECT_Singlet-black_Back-View_4.webp',
        ],
      },
      White: {
        heroImg: '/images/products/PR_white-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Singlet-white_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Singlet-white_sprint_2.webp',
          '/images/products/PRPROJECT_Singlet-white_hem-shot_3.webp',
          '/images/products/PRPROJECT_Singlet-white_Back-View_4.webp',
        ],
      },
      Red: {
        heroImg: '/images/products/PR_red-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Singlet-red_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Singlet-red_sprint_2.webp',
          '/images/products/PRPROJECT_Singlet-red_hem-shot_3.webp',
          '/images/products/PRPROJECT_Singlet-red_Back-View_4.webp',
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
    flatImg: '/images/products/PR_black-tshirt-THI.webp',
    lifestyleImg: '/images/products/PRPROJECT_Tshirt-black_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/products/PR_black-tshirt-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Tshirt-black_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Tshirt-black_Hem-Text-shot_2.webp',
          '/images/products/PRPROJECT_Tshirt-black_Pull-Up_3.webp',
          '/images/products/PRPROJECT_Tshirt-black_Back-View_4.webp',
        ],
      },
      White: {
        heroImg: '/images/products/PR_white-tshirt-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Tshirt-white_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Tshirt-white_Hem-Text-shot_2.webp',
          '/images/products/PRPROJECT_Tshirt-white_Pull-Up_3.webp',
          '/images/products/PRPROJECT_Tshirt-white_Back-View_4.webp',
        ],
      },
      Red: {
        heroImg: '/images/products/PR_red-tshirt-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Tshirt-red_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Tshirt-red_Hem-Text-shot_2.webp',
          '/images/products/PRPROJECT_Tshirt-red_Pull-Up_3.webp',
          '/images/products/PRPROJECT_Tshirt-red_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Cycling Short',
    id: 'FRL-PJ-CYC',
    sku: 'FRL-PJ-CYC',
    price: 350,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/PR_black-cyclings-THI.webp',
    lifestyleImg: '/images/products/PRPROJECT_Cyclings-black_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/products/PR_black-cyclings-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Cyclings-black_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Cyclings-black_Side-step_2.webp',
          '/images/products/PRPROJECT_Cyclings-black_Squat-pose_3.webp',
          '/images/products/PRPROJECT_Cyclings-black_Back-View_4.webp',
        ],
      },
      White: {
        heroImg: '/images/products/PR_white-cyclings-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Cyclings-white_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Cyclings-white_Side-step_2.webp',
          '/images/products/PRPROJECT_Cyclings-white_Squat-pose_3.webp',
          '/images/products/PRPROJECT_Cyclings-white_Back-View_4.webp',
        ],
      },
      Red: {
        heroImg: '/images/products/PR_red-cyclings-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Cyclings-red_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Cyclings-red_Side-step_2.webp',
          '/images/products/PRPROJECT_Cyclings-red_Squat-pose_3.webp',
          '/images/products/PRPROJECT_Cyclings-red_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Midriff',
    id: 'FRL-PJ-MDF',
    sku: 'FRL-PJ-MDF',
    price: 399,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/PR_black-Midriff-THI.webp',
    lifestyleImg: '/images/products/PRPROJECT_Midriff-black_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/products/PR_black-Midriff-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Midriff-black_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Midriff-black_Side-Stretch_2.webp',
          '/images/products/PRPROJECT_Midriff-black_Close-Up-Chest_3.webp',
          '/images/products/PRPROJECT_Midriff-black_Back-View_4.webp',
        ],
      },
      White: {
        heroImg: '/images/products/PR_white-Midriff-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Midriff-white_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Midriff-white_Side-Stretch_2.webp',
          '/images/products/PRPROJECT_Midriff-white_Close-Up-Chest_3.webp',
          '/images/products/PRPROJECT_Midriff-white_Back-View_4.webp',
        ],
      },
      Red: {
        heroImg: '/images/products/PR_red-Midriff-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Midriff-red_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Midriff-red_Side-Stretch_2.webp',
          '/images/products/PRPROJECT_Midriff-red_Close-Up-Chest_3.webp',
          '/images/products/PRPROJECT_Midriff-red_Back-View_4.webp',
        ],
      },
    },
  },
  {
    name: 'PR PROJECT Speedsuit',
    id: 'FRL-PJ-SPD',
    sku: 'FRL-PJ-SPD',
    price: 999,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/PR_black-speedsuit-THI.webp',
    lifestyleImg: '/images/products/PRPROJECT_Speedsuit-black_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/products/PR_black-speedsuit-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Speedsuit-black_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Speedsuit-black_Three-Quarter-Angle_2.webp',
          '/images/products/PRPROJECT_Speedsuit-black_Close-Up-Chest_3.webp',
          '/images/products/PRPROJECT_Speedsuit-black_Back-View_4.webp',
        ],
      },
      White: {
        heroImg: '/images/products/PR_white-speedsuit-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Speedsuit-white_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Speedsuit-white_Three-Quarter-Angle_2.webp',
          '/images/products/PRPROJECT_Speedsuit-white_Close-Up-Chest_3.webp',
          '/images/products/PRPROJECT_Speedsuit-white_Back-View_4.webp',
        ],
      },
      Red: {
        heroImg: '/images/products/PR_red-speedsuit-THI.webp',
        modelPhotos: [
          '/images/products/PRPROJECT_Speedsuit-red_Front-Hero_1.webp',
          '/images/products/PRPROJECT_Speedsuit-red_Three-Quarter-Angle_2.webp',
          '/images/products/PRPROJECT_Speedsuit-red_Close-Up-Chest_3.webp',
          '/images/products/PRPROJECT_Speedsuit-red_Back-View_4.webp',
        ],
      },
    },
  },
  // ===== PILIPINAS =====
  {
    name: 'PILIPINAS Singlet',
    id: 'FRL-PH-TNK',
    sku: 'FRL-PH-TNK',
    price: 450,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    // 1. SHOPLIST CARD THUMBNAIL (Shown on Shop Grid & Featured Carousel)
    flatImg: '/images/products/PH_black-singlet-THI.webp',
    lifestyleImg: '/images/products/PILIPINAS_Singlet-black_Front-Hero_1.webp',
    // 2. COLOR VARIATIONS (Clicking a color switches Top Hero Illustration + all 4 Model Photos below it)
    colorVariations: {
      Black: {
        heroImg: '/images/products/PH_black-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PILIPINAS_Singlet-black_Front-Hero_1.webp',
          '/images/products/PILIPINAS_Singlet-black_Three-Quarter-Angle_2.webp',
          '/images/products/PILIPINAS_Singlet-black_Close-Up-Chest_3.webp',
          '/images/products/PILIPINAS_Singlet-black_Back-View_4.webp',
        ],
      },
      Blue: {
        heroImg: '/images/products/PH_blue-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PILIPINAS_Singlet-blue_Front-Hero_1.webp',
          '/images/products/PILIPINAS_Singlet-blue_Three-Quarter-Angle_2.webp',
          '/images/products/PILIPINAS_Singlet-blue_Close-Up-Chest_3.webp',
          '/images/products/PILIPINAS_Singlet-blue_Back-View_4.webp',
        ],
      },
      Red: {
        heroImg: '/images/products/PH_red-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PILIPINAS_Singlet-red_Front-Hero_1.webp',
          '/images/products/PILIPINAS_Singlet-red_Three-Quarter-Angle_2.webp',
          '/images/products/PILIPINAS_Singlet-red_Close-Up-Chest_3.webp',
          '/images/products/PILIPINAS_Singlet-red_Back-View_4.webp',
        ],
      },
      White: {
        heroImg: '/images/products/PH_white-singlet-THI.webp',
        modelPhotos: [
          '/images/products/PILIPINAS_Singlet-white_Front-Hero_1.webp',
          '/images/products/PILIPINAS_Singlet-white_Three-Quarter-Angle_2.webp',
          '/images/products/PILIPINAS_Singlet-white_Close-Up-Chest_3.webp',
          '/images/products/PILIPINAS_Singlet-white_Back-View_4.webp',
        ],
      },
    },
  },
]

// Find the catalog entry for a product (by sku or exact name)
export function findCatalogProduct(p: { sku?: string; name?: string } | null): CatalogProduct | undefined {
  if (!p) return undefined
  return FROSTLINE_PRODUCTS.find(
    (c) =>
      (p.sku && c.sku === p.sku) ||
      (p.name && c.name.toLowerCase() === p.name.toLowerCase())
  )
}
