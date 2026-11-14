export const fallbackData = {
  mall: {
    name: "Center MALL",
    tagline: "Your Premier Shopping, Dining & Entertainment Destination",
    address: "100 Avenue Habib Bourguiba, Downtown",
    phone: "+216 71 800 900",
    openingHours: {
      weekdays: "09:00 - 22:00",
      weekends: "09:00 - 23:30"
    },
    floors: [
      { id: "P2", level: -2, name: "Basement Parking P2", description: "Long-term parking, EV charging" },
      { id: "P1", level: -1, name: "Basement Parking P1", description: "Express parking & Valet pick-up" },
      { id: "G", level: 0, name: "Ground Floor", description: "Grand Atrium, Boutiques & Info Desk" },
      { id: "F1", level: 1, name: "Floor 1 - Fashion & Beauty", description: "Apparel, Perfumery, Jewelry" },
      { id: "F2", level: 2, name: "Floor 2 - Tech, Kids & Lifestyle", description: "Electronics, Apple, Gaming" },
      { id: "F3", level: 3, name: "Floor 3 - Food & IMAX", description: "Gourmet Food Court, Cinema City IMAX" }
    ],
    amenities: [
      { id: "am-1", name: "High-Speed Wi-Fi", icon: "wifi", floor: "All Floors", description: "Free 5G Wi-Fi" },
      { id: "am-2", name: "ATM & Currency Exchange", icon: "cash-outline", floor: "Ground Floor & F2", description: "Multi-bank ATMs" },
      { id: "am-3", name: "EV Charging Stations", icon: "flash-outline", floor: "Basement P1 & P2", description: "16 fast chargers" },
      { id: "am-4", name: "VIP Valet Parking", icon: "car-outline", floor: "Main Gate", description: "Valet car drop-off" },
      { id: "am-5", name: "Wheelchair Service", icon: "accessibility-outline", floor: "All Floors", description: "Free at Info Desk" }
    ]
  },
  categories: [
    { id: "all", name: "All", icon: "grid-outline" },
    { id: "fashion", name: "Fashion", icon: "shirt-outline" },
    { id: "electronics", name: "Tech", icon: "laptop-outline" },
    { id: "food", name: "Dining", icon: "restaurant-outline" },
    { id: "beauty", name: "Beauty", icon: "sparkles-outline" },
    { id: "entertainment", name: "Cinema", icon: "film-outline" },
    { id: "sports", name: "Sports", icon: "fitness-outline" }
  ],
  stores: [
    {
      id: "store-1",
      name: "Zara Flagship",
      category: "fashion",
      floor: "F1",
      unit: "Unit 104",
      phone: "+216 71 800 104",
      hours: "09:30 - 22:00",
      rating: 4.8,
      reviewsCount: 342,
      isFeatured: true,
      description: "Contemporary fashion, women's, men's and kids' latest collections.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
      tags: ["Trendy", "Clothing", "New Season"]
    },
    {
      id: "store-2",
      name: "Apple Store Center Mall",
      category: "electronics",
      floor: "F2",
      unit: "Unit 201",
      phone: "+216 71 800 201",
      hours: "10:00 - 22:00",
      rating: 4.9,
      reviewsCount: 890,
      isFeatured: true,
      description: "Official Apple store with Genius Bar, iPhone, MacBook, and repair services.",
      image: "https://images.unsplash.com/photo-1568292342316-60aa3d36f4b3?w=800&auto=format&fit=crop&q=80",
      tags: ["Apple", "iPhone", "MacBook"]
    },
    {
      id: "store-3",
      name: "Nike Pro Experience",
      category: "sports",
      floor: "F1",
      unit: "Unit 115",
      phone: "+216 71 800 115",
      hours: "09:30 - 22:00",
      rating: 4.7,
      reviewsCount: 512,
      isFeatured: true,
      description: "Athletic footwear, activewear, training gear and custom sneaker bar.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      tags: ["Sneakers", "Running", "Nike"]
    },
    {
      id: "store-4",
      name: "Sephora Prestige",
      category: "beauty",
      floor: "F1",
      unit: "Unit 110",
      phone: "+216 71 800 110",
      hours: "09:30 - 22:00",
      rating: 4.8,
      reviewsCount: 420,
      isFeatured: true,
      description: "Luxury fragrances, skincare consultations and cosmetics.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      tags: ["Perfume", "Skincare", "Cosmetics"]
    },
    {
      id: "store-5",
      name: "Cinema City IMAX 4DX",
      category: "entertainment",
      floor: "F3",
      unit: "Unit 301",
      phone: "+216 71 800 301",
      hours: "11:00 - 01:00",
      rating: 4.9,
      reviewsCount: 1240,
      isFeatured: true,
      description: "10-screen multiplex featuring Laser IMAX, motion seats 4DX, VIP lounge.",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
      tags: ["IMAX", "Movies", "VIP"]
    },
    {
      id: "store-6",
      name: "Starbucks Reserve Atrium",
      category: "food",
      floor: "G",
      unit: "Unit G02",
      phone: "+216 71 800 002",
      hours: "08:30 - 23:00",
      rating: 4.6,
      reviewsCount: 678,
      isFeatured: false,
      description: "Artisanal coffee, handcrafted espresso beverages and fresh pastries.",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
      tags: ["Coffee", "Pastries"]
    },
    {
      id: "store-7",
      name: "Burger Craft & Shake",
      category: "food",
      floor: "F3",
      unit: "FC-05",
      phone: "+216 71 800 305",
      hours: "11:30 - 23:00",
      rating: 4.7,
      reviewsCount: 389,
      isFeatured: false,
      description: "Smash burgers, brioche buns, truffle fries, thick milkshakes.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
      tags: ["Burgers", "Food Court"]
    }
  ],
  products: [
    {
      id: "prod-1",
      storeId: "store-2",
      storeName: "Apple Store",
      name: "iPhone 16 Pro Max 256GB",
      price: 1399,
      originalPrice: 1499,
      category: "electronics",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      description: "Grade 5 Titanium design, A18 Pro chip, 48MP Fusion camera system with 5x Telephoto.",
      dealTag: "SAVE $100"
    },
    {
      id: "prod-2",
      storeId: "store-2",
      storeName: "Apple Store",
      name: "AirPods Pro (2nd Gen)",
      price: 219,
      originalPrice: 249,
      category: "electronics",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      description: "Active noise cancellation, personalized spatial audio with dynamic head tracking.",
      dealTag: "POPULAR"
    },
    {
      id: "prod-3",
      storeId: "store-1",
      storeName: "Zara Flagship",
      name: "Oversized Trench Coat",
      price: 149,
      originalPrice: 199,
      category: "fashion",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      description: "Classic double-breasted trench in premium wool blend with lapel collar.",
      dealTag: "25% OFF"
    },
    {
      id: "prod-5",
      storeId: "store-3",
      storeName: "Nike Pro",
      name: "Nike Air Zoom Pegasus 41",
      price: 130,
      originalPrice: 160,
      category: "sports",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      description: "Responsive ReactX foam midsole, dual Air Zoom units.",
      dealTag: "BESTSELLER"
    },
    {
      id: "prod-7",
      storeId: "store-7",
      storeName: "Burger Craft",
      name: "Truffle Double Smash Burger",
      price: 16.5,
      originalPrice: 20,
      category: "food",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      description: "Angus smash patties, truffle mayo, smoked gouda, crispy bacon on brioche.",
      dealTag: "CHEF CHOICE"
    }
  ],
  deals: [
    {
      id: "deal-1",
      title: "Summer Mega Mall Sale",
      store: "All Participating Stores",
      discount: "Up to 50% OFF",
      code: "SUMMER50",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "deal-2",
      title: "Apple Student Tech Bundle",
      store: "Apple Store",
      discount: "Save $150 + Free AirPods",
      code: "STUDENTVIP",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "deal-3",
      title: "Cinema 2-for-1 Tuesdays",
      store: "Cinema City IMAX",
      discount: "Buy 1 Get 1 Free",
      code: "CINEMA241",
      image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80"
    }
  ],
  events: [
    {
      id: "event-1",
      title: "Center Mall Summer Grand Festival",
      date: "Nov 20 - Nov 25, 2026",
      time: "17:00 - 22:30",
      location: "Main Atrium (Ground Floor)",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      attendees: 1420
    },
    {
      id: "event-2",
      title: "Kids LEGO City Championship",
      date: "Every Weekend",
      time: "14:00 - 18:00",
      location: "Kids Zone (Floor 2)",
      image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&auto=format&fit=crop&q=80",
      attendees: 380
    }
  ],
  movies: [
    {
      id: "mov-1",
      title: "Dune: Prophecy & Beyond",
      genre: "Sci-Fi / Adventure",
      duration: "165 min",
      rating: "PG-13",
      hall: "Laser IMAX Hall 1",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      showtimes: ["14:00", "17:30", "21:00"],
      price: 14.50
    },
    {
      id: "mov-2",
      title: "Cyber City 2099",
      genre: "Action / Cyberpunk",
      duration: "135 min",
      rating: "R",
      hall: "4DX Motion Hall 3",
      poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
      showtimes: ["15:15", "18:45", "22:15"],
      price: 16.00
    }
  ],
  parking: {
    totalSpaces: 650,
    occupiedSpaces: 412,
    availableSpaces: 238,
    ratePerHour: "$2.00",
    levels: [
      { id: "P1", name: "Level P1 (Express & Valet)", capacity: 300, available: 95 },
      { id: "P2", name: "Level P2 (Long-Stay)", capacity: 350, available: 143 }
    ]
  }
};

