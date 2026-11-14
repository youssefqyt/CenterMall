const seedData = {
  mall: {
    name: "Center MALL",
    tagline: "Your Premier Shopping, Dining & Entertainment Destination",
    address: "100 Avenue Habib Bourguiba, Downtown",
    phone: "+216 71 800 900",
    email: "info@centermall.com",
    openingHours: {
      weekdays: "09:00 - 22:00",
      weekends: "09:00 - 23:30"
    },
    floors: [
      { id: "P2", level: -2, name: "Basement Parking P2", description: "Long-term parking, EV charging zone B" },
      { id: "P1", level: -1, name: "Basement Parking P1", description: "Express parking, Car wash & Valet pick-up" },
      { id: "G", level: 0, name: "Ground Floor", description: "Grand Atrium, Luxury Boutiques, Information Desk, Main Entrance" },
      { id: "F1", level: 1, name: "Floor 1 - Fashion & Beauty", description: "International Fashion Brands, Perfumery, Cosmetics, Jewelry" },
      { id: "F2", level: 2, name: "Floor 2 - Tech, Kids & Lifestyle", description: "Electronics, Apple, Gaming, Toys, Home Decor, Sports" },
      { id: "F3", level: 3, name: "Floor 3 - Entertainment & Dining", description: "Gourmet Food Court, Cinema City IMAX, Virtual Reality Zone" }
    ],
    amenities: [
      { id: "am-1", name: "High-Speed Wi-Fi", icon: "wifi", floor: "All Floors", description: "Free unlimited 5G Wi-Fi across the mall" },
      { id: "am-2", name: "ATM & Currency Exchange", icon: "cash", floor: "Ground Floor & Floor 2", description: "Multi-bank ATMs and global currency desk" },
      { id: "am-3", name: "EV Charging Stations", icon: "car-electric", floor: "Basement P1 & P2", description: "16 fast-charging points for electric vehicles" },
      { id: "am-4", name: "VIP Valet Parking", icon: "car", floor: "Ground Floor Main Gate", description: "Leave your vehicle with our certified staff" },
      { id: "am-5", name: "Wheelchair Accessibility", icon: "wheelchair", floor: "All Floors", description: "Free wheelchairs available at Info Desk" },
      { id: "am-6", name: "Baby Care & Nursing", icon: "baby", floor: "Floor 1 & Floor 3", description: "Private family rooms and diaper changing stations" },
      { id: "am-7", name: "Prayer Rooms", icon: "mosque", floor: "Floor 2 West Wing", description: "Dedicated peaceful prayer areas for men and women" },
      { id: "am-8", name: "Customer Service & Lost / Found", icon: "information", floor: "Ground Floor Atrium", description: "Assistance, mall guides, lost items claim" }
    ]
  },
  categories: [
    { id: "fashion", name: "Fashion & Apparel", icon: "shirt", count: 4 },
    { id: "electronics", name: "Electronics & Tech", icon: "laptop", count: 2 },
    { id: "food", name: "Dining & Cafes", icon: "food", count: 3 },
    { id: "beauty", name: "Beauty & Cosmetics", icon: "spray", count: 1 },
    { id: "entertainment", name: "Cinema & Leisure", icon: "movie", count: 1 },
    { id: "sports", name: "Sports & Fitness", icon: "basketball", count: 1 }
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
      description: "Contemporary fashion, women's, men's and kids' latest collections updated weekly.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80",
      tags: ["Trendy", "Clothing", "Accessories", "New Season"]
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
      description: "Official Apple store with Genius Bar, workshops, iPhone, MacBook, iPad and trade-in services.",
      image: "https://images.unsplash.com/photo-1568292342316-60aa3d36f4b3?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&auto=format&fit=crop&q=80",
      tags: ["Apple", "iPhone", "MacBook", "Tech Support"]
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
      description: "Premium athletic footwear, activewear, training gear and custom sneaker customization station.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&auto=format&fit=crop&q=80",
      tags: ["Sneakers", "Running", "Gym", "Nike"]
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
      description: "World of beauty: luxury fragrances, skincare consultations, makeup artists and beauty bar.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&auto=format&fit=crop&q=80",
      tags: ["Perfume", "Skincare", "Cosmetics", "Luxury"]
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
      description: "10-screen multiplex featuring Laser IMAX, motion seats 4DX, VIP lounge and gourmet cinema snacks.",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&auto=format&fit=crop&q=80",
      tags: ["IMAX", "Movies", "VIP Lounge", "Blockbusters"]
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
      description: "Artisanal coffee, handcrafted espresso beverages, pastries, sandwiches and outdoor patio seating.",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80",
      tags: ["Coffee", "Breakfast", "Pastries", "Wi-Fi"]
    },
    {
      id: "store-7",
      name: "Burger Craft & Shake",
      category: "food",
      floor: "F3",
      unit: "Food Court FC-05",
      phone: "+216 71 800 305",
      hours: "11:30 - 23:00",
      rating: 4.7,
      reviewsCount: 389,
      isFeatured: false,
      description: "Smash burgers, brioche buns, loaded truffle fries, artisanal thick milkshakes and vegan options.",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&auto=format&fit=crop&q=80",
      tags: ["Burgers", "Fast Casual", "Fries", "Shakes"]
    },
    {
      id: "store-8",
      name: "H&M Home & Fashion",
      category: "fashion",
      floor: "F1",
      unit: "Unit 120",
      phone: "+216 71 800 120",
      hours: "09:30 - 22:00",
      rating: 4.5,
      reviewsCount: 290,
      isFeatured: false,
      description: "Affordable trend fashion, sustainable cotton essentials, modern homeware and kids styles.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80",
      tags: ["Apparel", "Home Decor", "Budget Friendly", "Kids"]
    },
    {
      id: "store-9",
      name: "Sony Center & PlayStation Zone",
      category: "electronics",
      floor: "F2",
      unit: "Unit 212",
      phone: "+216 71 800 212",
      hours: "10:00 - 22:00",
      rating: 4.8,
      reviewsCount: 310,
      isFeatured: false,
      description: "PlayStation 5 test stations, Bravia XR OLED TVs, noise-canceling headphones and cameras.",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80",
      tags: ["Gaming", "PlayStation", "Audio", "Cameras"]
    },
    {
      id: "store-10",
      name: "Wok & Noodles Asian Kitchen",
      category: "food",
      floor: "F3",
      unit: "Food Court FC-02",
      phone: "+216 71 800 302",
      hours: "11:30 - 23:00",
      rating: 4.6,
      reviewsCount: 230,
      isFeatured: false,
      description: "Fresh wok-tossed ramen, pad thai, dim sum baskets, crispy duck and bubble teas.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=200&auto=format&fit=crop&q=80",
      tags: ["Asian", "Noodles", "Dim Sum", "Boba"]
    }
  ],
  products: [
    {
      id: "prod-1",
      storeId: "store-2",
      storeName: "Apple Store Center Mall",
      name: "iPhone 16 Pro Max 256GB",
      price: 1399,
      originalPrice: 1499,
      category: "electronics",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
      description: "Grade 5 Titanium design, A18 Pro chip, 48MP Fusion camera system with 5x Telephoto, 4K 120 fps Dolby Vision.",
      inStock: true,
      dealTag: "SAVE $100"
    },
    {
      id: "prod-2",
      storeId: "store-2",
      storeName: "Apple Store Center Mall",
      name: "AirPods Pro (2nd Gen) USB-C",
      price: 219,
      originalPrice: 249,
      category: "electronics",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      description: "Up to 2x more active noise cancellation, adaptive audio, personalized spatial audio with dynamic head tracking.",
      inStock: true,
      dealTag: "POPULAR"
    },
    {
      id: "prod-3",
      storeId: "store-1",
      storeName: "Zara Flagship",
      name: "Oversized Wool Blend Trench Coat",
      price: 149,
      originalPrice: 199,
      category: "fashion",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      description: "Classic double-breasted trench in premium wool blend with lapel collar and adjustable buckled belt.",
      inStock: true,
      dealTag: "25% OFF"
    },
    {
      id: "prod-4",
      storeId: "store-1",
      storeName: "Zara Flagship",
      name: "Leather Minimalist Crossbody Bag",
      price: 79,
      originalPrice: 99,
      category: "fashion",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
      description: "100% genuine Italian tanned leather with magnetic flap closure and gold-toned metal hardware.",
      inStock: true,
      dealTag: "NEW"
    },
    {
      id: "prod-5",
      storeId: "store-3",
      storeName: "Nike Pro Experience",
      name: "Nike Air Zoom Pegasus 41",
      price: 130,
      originalPrice: 160,
      category: "sports",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      description: "Responsive ReactX foam midsole, dual Air Zoom units, lightweight engineered mesh upper for elite comfort.",
      inStock: true,
      dealTag: "BESTSELLER"
    },
    {
      id: "prod-6",
      storeId: "store-4",
      storeName: "Sephora Prestige",
      name: "Chanel Coco Mademoiselle EDP 100ml",
      price: 165,
      originalPrice: 185,
      category: "beauty",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80",
      description: "An oriental fragrance with strong personality, yet surprisingly fresh. Vibrant notes of orange, jasmine and rose.",
      inStock: true,
      dealTag: "EXCLUSIVE"
    },
    {
      id: "prod-7",
      storeId: "store-7",
      storeName: "Burger Craft & Shake",
      name: "Truffle & Bacon Double Smash Burger",
      price: 16.5,
      originalPrice: 20,
      category: "food",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      description: "Two 100% Angus smash patties, black truffle mayo, smoked gouda, crispy bacon on toasted brioche.",
      inStock: true,
      dealTag: "CHEF CHOICE"
    },
    {
      id: "prod-8",
      storeId: "store-6",
      storeName: "Starbucks Reserve Atrium",
      name: "Iced Caramel Macchiato Venti",
      price: 6.5,
      originalPrice: 7.5,
      category: "food",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
      description: "Freshly brewed espresso poured over vanilla-flavored milk and ice, finished with signature caramel drizzle.",
      inStock: true,
      dealTag: "HOT"
    },
    {
      id: "prod-9",
      storeId: "store-9",
      storeName: "Sony Center & PlayStation Zone",
      name: "PlayStation 5 Slim Digital Console",
      price: 449,
      originalPrice: 499,
      category: "electronics",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
      description: "Ultra-high speed 1TB SSD, haptic feedback, 4K HDR gaming at up to 120fps with ray tracing support.",
      inStock: true,
      dealTag: "LIMITED STOCK"
    }
  ],
  deals: [
    {
      id: "deal-1",
      title: "Summer Mega Mall Sale",
      store: "Center Mall All Participating Stores",
      discount: "Up to 50% OFF",
      code: "SUMMER50",
      validUntil: "2026-12-31",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80",
      category: "Mall Wide",
      description: "Massive savings on fashion, electronics, cosmetics and home lifestyle throughout the mall."
    },
    {
      id: "deal-2",
      title: "Apple Back-to-School Tech Bundle",
      store: "Apple Store",
      discount: "Save $150 + Free AirPods",
      code: "STUDENTVIP",
      validUntil: "2026-11-30",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
      category: "Electronics",
      description: "Get student pricing on MacBooks and iPads plus free accessories with student verification."
    },
    {
      id: "deal-3",
      title: "Cinema City 2-for-1 Tuesdays",
      store: "Cinema City IMAX",
      discount: "Buy 1 Ticket, Get 1 Free",
      code: "CINEMA241",
      validUntil: "2026-12-31",
      image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&auto=format&fit=crop&q=80",
      category: "Entertainment",
      description: "Double the fun every Tuesday across all 2D, 3D, and standard screenings."
    },
    {
      id: "deal-4",
      title: "Food Court Lunch Express Combos",
      store: "Center Food Court (Floor 3)",
      discount: "Meal + Drink for $9.99",
      code: "LUNCHNOW",
      validUntil: "2026-12-15",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      category: "Dining",
      description: "Valid Monday to Friday from 12:00 to 15:00 at all participating food court restaurants."
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
      attendees: 1420,
      description: "Live musical performances, celebrity DJ sets, acrobatic light shows, free cotton candy and gift raffles!"
    },
    {
      id: "event-2",
      title: "Kids LEGO City Championship",
      date: "Every Saturday & Sunday",
      time: "14:00 - 18:00",
      location: "Kids Zone (Floor 2)",
      image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&auto=format&fit=crop&q=80",
      attendees: 380,
      description: "Creative building challenges for kids aged 5-14 with official LEGO trophies and prizes."
    },
    {
      id: "event-3",
      title: "Runway Fashion Show: Winter Trends",
      date: "Dec 05, 2026",
      time: "19:00 - 21:30",
      location: "Central Sky Walkway (Floor 1)",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      attendees: 850,
      description: "Exclusive fashion preview showcasing top international designers and new collection arrivals."
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
      price: 14.50,
      description: "An epic interstellar journey exploring the origin of cosmic power across the desert sands."
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
      price: 16.00,
      description: "Experience high-octane flying car chases and sensory rain effects in full 4DX immersion."
    },
    {
      id: "mov-3",
      title: "Kingdom of Wonders",
      genre: "Animation / Family",
      duration: "105 min",
      rating: "G",
      hall: "VIP Family Screen 2",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      showtimes: ["11:30", "14:15", "16:45"],
      price: 11.00,
      description: "A magical tale for all ages with breathtaking visuals, lovable characters and humor."
    }
  ],
  parking: {
    totalSpaces: 650,
    occupiedSpaces: 412,
    availableSpaces: 238,
    ratePerHour: "$2.00",
    levels: [
      {
        id: "P1",
        name: "Level P1 (Express & Valet)",
        capacity: 300,
        available: 95,
        zones: [
          { name: "Zone A (Near Main Atrium Lift)", available: 22, total: 60 },
          { name: "Zone B (Food Court Lift)", available: 31, total: 80 },
          { name: "Zone C (EV Fast Charging)", available: 8, total: 16 }
        ]
      },
      {
        id: "P2",
        name: "Level P2 (Long-Stay)",
        capacity: 350,
        available: 143,
        zones: [
          { name: "Zone D (Cinema Lift Access)", available: 45, total: 100 },
          { name: "Zone E (Supermarket / North Gate)", available: 62, total: 120 },
          { name: "Zone F (Standard Bays)", available: 36, total: 130 }
        ]
      }
    ]
  }
};

module.exports = seedData;

