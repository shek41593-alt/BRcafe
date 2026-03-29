const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoriesData = [
  "Juice", "Fruit Milk Shake", "Kulukki Juice", "Mojito", "Soda", "Milk Shake",
  "Special Ice Cream", "BR Special", "Ice Creams", "Dosa Items", "Hot Beverages",
  "Pizza", "Chinese Items", "Soup", "Chat Items", "Sandwiches"
];

const ITEM_TYPES = {
  "Juice": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop",
  "Fruit Milk Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop",
  "Kulukki Juice": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop",
  "Mojito": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop",
  "Soda": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop",
  "Milk Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop",
  "Special Ice Cream": "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600&auto=format&fit=crop",
  "BR Special": "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600&auto=format&fit=crop",
  "Ice Creams": "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600&auto=format&fit=crop",
  "Dosa Items": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop",
  "Hot Beverages": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop",
  "Pizza": "https://images.unsplash.com/photo-1513104890d38-7c7f89b91e77?w=600&auto=format&fit=crop",
  "Chinese Items": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop",
  "Soup": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop",
  "Chat Items": "https://images.unsplash.com/photo-1601050690597-df0568a70928?w=600&auto=format&fit=crop",
  "Sandwiches": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop"
};

const rawItems = [
  // Juice
  { name: "LIME JUICE", price: "30.00", category: "Juice" },
  { name: "ORANGE", price: "70.00", category: "Juice" },
  { name: "MUSK MELON", price: "70.00", category: "Juice" },
  { name: "PINEAPPLE", price: "70.00", category: "Juice" },
  { name: "PAPAYA", price: "70.00", category: "Juice" },
  { name: "WATERMELON", price: "70.00", category: "Juice" },
  { name: "GRAPE", price: "70.00", category: "Juice" },
  { name: "POMEGRANATE", price: "80.00", category: "Juice" },
  { name: "MUSAMBI", price: "70.00", category: "Juice" },
  { name: "MANGO (SEASONAL)", price: "80.00", category: "Juice" },
  { name: "MIX FRUIT", price: "80.00", category: "Juice" },
  { name: "GRAPE & PINEAPPLE", price: "90.00", category: "Juice" },

  // Fruit Milk Shake
  { name: "CHIKKU SHAKE", price: "80 / 110", category: "Fruit Milk Shake" },
  { name: "APPLE SHAKE", price: "80 / 110", category: "Fruit Milk Shake" },
  { name: "MUSK MELON SHAKE", price: "80 / 110", category: "Fruit Milk Shake" },
  { name: "BANANA SHAKE", price: "80 / 110", category: "Fruit Milk Shake" },
  { name: "PAPAYA SHAKE", price: "80 / 110", category: "Fruit Milk Shake" },
  { name: "POMEGRANATE SHAKE", price: "90 / 110", category: "Fruit Milk Shake" },
  { name: "APPLE & CHIKKU SHAKE", price: "100 / 130", category: "Fruit Milk Shake" },
  { name: "MANGO SHAKE (SEASONAL)", price: "90 / 120", category: "Fruit Milk Shake" },
  { name: "BANANA & CHIKKU SHAKE", price: "90 / 120", category: "Fruit Milk Shake" },
  { name: "BUTTER FRUIT SHAKE (SEASONAL)", price: "120 / 150", category: "Fruit Milk Shake" },

  // Kulukki Juice
  { name: "ORANGE", price: "60.00", category: "Kulukki Juice" },
  { name: "PINEAPPLE", price: "60.00", category: "Kulukki Juice" },
  { name: "PASSION FRUIT", price: "70.00", category: "Kulukki Juice" },

  // Mojito
  { name: "MINT MOJITO", price: "70.00", category: "Mojito", popular: true },
  { name: "PINEAPPLE", price: "70.00", category: "Mojito" },
  { name: "PASSION FRUIT", price: "90.00", category: "Mojito" },
  { name: "BLUEBERRY", price: "100.00", category: "Mojito" },
  { name: "STRAWBERRY", price: "70.00", category: "Mojito" },

  // Soda
  { name: "JALJEERA SODA", price: "30.00", category: "Soda" },
  { name: "LIME SODA", price: "30.00", category: "Soda" },
  { name: "KOKUM SODA", price: "40.00", category: "Soda" },
  { name: "BLUE MINT", price: "50.00", category: "Soda" },
  { name: "GINGER MINT", price: "50.00", category: "Soda" },

  // Milk Shake
  { name: "COLD COFFEE", price: "60 / 90.00", category: "Milk Shake", popular: true },
  { name: "VANILLA", price: "75 / 100.00", category: "Milk Shake" },
  { name: "STRAWBERRY", price: "75 / 100.00", category: "Milk Shake" },
  { name: "BADAM", price: "75 / 100.00", category: "Milk Shake" },
  { name: "PISTA", price: "75 / 100.00", category: "Milk Shake" },
  { name: "CHOCOLATE", price: "75 / 100.00", category: "Milk Shake" },
  { name: "BUTTERSCOTCH", price: "75 / 100.00", category: "Milk Shake" },
  { name: "HORLICKS", price: "75 / 100.00", category: "Milk Shake" },
  { name: "OREO", price: "100 / 120.00", category: "Milk Shake", popular: true },
  { name: "TENDER COCONUT", price: "100 / 130.00", category: "Milk Shake" },
  { name: "DATES", price: "100 / 130.00", category: "Milk Shake" },
  { name: "KITKAT", price: "100 / 130.00", category: "Milk Shake" },
  { name: "SHARJAH", price: "110 / 140.00", category: "Milk Shake" },
  { name: "CASHEW", price: "110 / 140.00", category: "Milk Shake" },
  { name: "DATES TENDER COCONUT", price: "120 / 150.00", category: "Milk Shake" },
  { name: "CASHEW DATES", price: "120 / 150.00", category: "Milk Shake" },
  { name: "DRY FRUITS", price: "120 / 150.00", category: "Milk Shake" },

  // Special Ice Cream
  { name: "FRUIT SALAD WITH VANILLA ICE CREAM", price: "100.00", category: "Special Ice Cream" },
  { name: "SPECIAL FRUIT SALAD", price: "170.00", category: "Special Ice Cream" },
  { name: "KESAR FALOODA", price: "100.00", category: "Special Ice Cream" },
  { name: "ROYAL FALOODA", price: "100.00", category: "Special Ice Cream" },
  { name: "BROWNIE WITH VANILLA ICE CREAM", price: "110.00", category: "Special Ice Cream" },
  { name: "SANDY NUTS", price: "120.00", category: "Special Ice Cream" },
  { name: "CHIKKU ALMOND", price: "120.00", category: "Special Ice Cream" },
  { name: "AMERICAN CHOCONUT", price: "120.00", category: "Special Ice Cream" },
  { name: "DUET", price: "120.00", category: "Special Ice Cream" },
  { name: "ICE CAKE SANDWICH", price: "120.00", category: "Special Ice Cream" },
  { name: "HOT CARROT HALWA WITH VANILLA ICE CREAM", price: "130.00", category: "Special Ice Cream" },
  { name: "CHOCOLATE CHOCONUT", price: "130.00", category: "Special Ice Cream" },
  { name: "GADBAD", price: "150.00", category: "Special Ice Cream", popular: true },
  { name: "SPECIAL GADBAD", price: "220.00", category: "Special Ice Cream" },
  { name: "DRY FRUIT GADBAD", price: "240.00", category: "Special Ice Cream" },
  { name: "KIT KAT GADBAD", price: "240.00", category: "Special Ice Cream" },
  { name: "DILKUSH", price: "160.00", category: "Special Ice Cream" },
  { name: "CHOCOLATE DAD", price: "160.00", category: "Special Ice Cream" },
  { name: "VANILLA DAD", price: "150.00", category: "Special Ice Cream" },
  { name: "TROPICAL DHAMAKA", price: "160.00", category: "Special Ice Cream" },
  { name: "TIRAMISU", price: "170.00", category: "Special Ice Cream" },
  { name: "PARFAIT", price: "170.00", category: "Special Ice Cream" },
  { name: "BEE HIVE", price: "160.00", category: "Special Ice Cream" },
  { name: "DRY FRUIT COCKTAIL", price: "170.00", category: "Special Ice Cream" },
  { name: "CHOCOLATE FANTASY", price: "170.00", category: "Special Ice Cream" },

  // BR Special
  { name: "COUPLE SPECIAL", price: "220.00", category: "BR Special" },
  { name: "BR SPECIAL", price: "270.00", category: "BR Special" },
  { name: "FAMILY SPECIAL", price: "300.00", category: "BR Special" },

  // Ice Creams
  { name: "VANILLA", price: "50.00 / 60.00", category: "Ice Creams" },
  { name: "STRAWBERRY", price: "50.00 / 60.00", category: "Ice Creams" },
  { name: "KESAR", price: "65.00 / 80.00", category: "Ice Creams" },
  { name: "TWO IN ONE", price: "70.00", category: "Ice Creams" },
  { name: "CHOCOLATE", price: "70.00 / 75.00", category: "Ice Creams" },
  { name: "CHIKKU", price: "70.00 / 75.00", category: "Ice Creams" },
  { name: "BUTTERSCOTCH", price: "70.00 / 75.00", category: "Ice Creams" },
  { name: "PISTA", price: "70.00", category: "Ice Creams" },
  { name: "MANGO", price: "70.00", category: "Ice Creams" },
  { name: "ARGENTINIAN DULCE DE LECHE", price: "75.00", category: "Ice Creams" },
  { name: "BELGIAN CHOCOLATE", price: "75.00", category: "Ice Creams" },
  { name: "IDEAL FRUITY", price: "75.00", category: "Ice Creams" },
  { name: "BLACK CURRANT", price: "75.00", category: "Ice Creams" },
  { name: "SHAHI NUTS", price: "75.00", category: "Ice Creams" },
  { name: "ARABIAN DELIGHT", price: "75.00", category: "Ice Creams" },
  { name: "CHOCO CHIP", price: "90.00", category: "Ice Creams" },

  // Dosa Items
  { name: "SADA DOSA", price: "40.00", category: "Dosa Items" },
  { name: "SET DOSA", price: "60.00", category: "Dosa Items", popular: true },
  { name: "PLAIN ROAST", price: "60.00", category: "Dosa Items" },
  { name: "BENNE DOSA", price: "70.00", category: "Dosa Items" },
  { name: "THUPPA DOSA", price: "70.00", category: "Dosa Items" },
  { name: "ONION DOSA", price: "70.00", category: "Dosa Items" },
  { name: "RAVA DOSA", price: "70.00", category: "Dosa Items" },
  { name: "GHEE ROAST", price: "70.00", category: "Dosa Items" },
  { name: "BENNE ROAST", price: "70.00", category: "Dosa Items" },
  { name: "MASALA DOSA", price: "70.00", category: "Dosa Items", popular: true },
  { name: "BENNE MASALA DOSA", price: "80.00", category: "Dosa Items" },
  { name: "GHEE MASALA DOSA", price: "80.00", category: "Dosa Items" },
  { name: "PALAK MASALA DOSA", price: "80.00", category: "Dosa Items" },
  { name: "MYSORE MASALA DOSA", price: "90.00", category: "Dosa Items" },
  { name: "PANEER MASALA DOSA", price: "110.00", category: "Dosa Items" },
  { name: "MASHROOM MASALA DOSA", price: "100.00", category: "Dosa Items" },
  { name: "RAVA MASALA DOSA", price: "100.00", category: "Dosa Items" },

  // Hot Beverages
  { name: "BLACK TEA", price: "20.00", category: "Hot Beverages" },
  { name: "TEA", price: "25.00", category: "Hot Beverages" },
  { name: "SPECIAL TEA", price: "30.00", category: "Hot Beverages" },
  { name: "LEMON TEA", price: "20.00", category: "Hot Beverages" },
  { name: "MASALA TEA", price: "30.00", category: "Hot Beverages" },
  { name: "BLACK COFFEE", price: "20.00", category: "Hot Beverages" },
  { name: "COFFEE", price: "30.00", category: "Hot Beverages", popular: true },
  { name: "HOT MILK", price: "25.00", category: "Hot Beverages" },
  { name: "HOT BADAM", price: "30.00", category: "Hot Beverages" },
  { name: "HOT BOOST", price: "30.00", category: "Hot Beverages" },
  { name: "HOT HORLICKS", price: "30.00", category: "Hot Beverages" },

  // Pizza
  { name: "VEG PIZZA (MINI)", price: "80.00", category: "Pizza" },
  { name: "VEG PIZZA (LARGE)", price: "180.00", category: "Pizza" },
  { name: "PANEER PIZZA (MINI)", price: "100.00", category: "Pizza" },
  { name: "PANEER PIZZA (LARGE)", price: "200.00", category: "Pizza" },
  { name: "MASHROOM PIZZA (MINI)", price: "100.00", category: "Pizza" },

  // Chinese Items
  { name: "CHINESE COMBO", price: "200.00", category: "Chinese Items" },
  { name: "VEG FRIED RICE", price: "80.00", category: "Chinese Items" },
  { name: "SCHEZWAN FRIED RICE", price: "90.00", category: "Chinese Items", popular: true },
  { name: "PANEER FRIED RICE", price: "120.00", category: "Chinese Items" },
  { name: "MASHROOM FRIED RICE", price: "110.00", category: "Chinese Items" },
  { name: "VEG NOODLES", price: "90.00", category: "Chinese Items" },
  { name: "SCHEZWAN NOODLES", price: "100.00", category: "Chinese Items" },
  { name: "GOBI MANCHURIAN", price: "90.00", category: "Chinese Items" },
  { name: "GOBI CHILLI", price: "100.00", category: "Chinese Items" },
  { name: "GOBI PEPPER", price: "100.00", category: "Chinese Items" },
  { name: "BABY CORN CHILLI", price: "120.00", category: "Chinese Items" },
  { name: "BABY CORN MANCHURIAN", price: "110.00", category: "Chinese Items" },
  { name: "BABY CORN PEPPER", price: "120.00", category: "Chinese Items" },
  { name: "MASHROOM CHILLI", price: "160.00", category: "Chinese Items" },
  { name: "MASHROOM MANCHURIAN", price: "150.00", category: "Chinese Items" },
  { name: "MASHROOM PEPPER", price: "160.00", category: "Chinese Items" },
  { name: "MASHROOM GHEE ROAST", price: "180.00", category: "Chinese Items" },
  { name: "PANEER KABAB", price: "180.00", category: "Chinese Items" },
  { name: "PANEER TIKKA FRY", price: "200.00", category: "Chinese Items" },
  { name: "PANEER 65", price: "200.00", category: "Chinese Items" },
  { name: "LEMON PANEER", price: "210.00", category: "Chinese Items" },
  { name: "PANEER CHILLI", price: "190.00", category: "Chinese Items" },
  { name: "PANEER MANCHURIAN", price: "180.00", category: "Chinese Items" },
  { name: "PANEER PEPPER", price: "190.00", category: "Chinese Items" },
  { name: "PANEER GHEE ROAST", price: "220.00", category: "Chinese Items" },

  // Soup
  { name: "MANCHAWO SOUP", price: "60.00", category: "Soup" },
  { name: "LEMON CORIENDER SOUP", price: "60.00", category: "Soup" },
  { name: "CREAM OF MASHROOM SOUP", price: "70.00", category: "Soup" },

  // Chat Items
  { name: "PANI PURI", price: "50.00", category: "Chat Items" },
  { name: "MASALA PURI", price: "60.00", category: "Chat Items" },
  { name: "SEV PURI", price: "60.00", category: "Chat Items" },
  { name: "DAHI PURI", price: "60.00", category: "Chat Items" },
  { name: "BHEL PURI", price: "60.00", category: "Chat Items" },
  { name: "PAPADI SEV", price: "70.00", category: "Chat Items" },
  { name: "PAV BHAJI", price: "70.00", category: "Chat Items" },
  { name: "CHAT COMBO", price: "200.00", category: "Chat Items" },

  // Sandwiches
  { name: "BREAD BUTTER JAM", price: "50.00", category: "Sandwiches" },
  { name: "CHEESE SANDWICH", price: "80.00", category: "Sandwiches" },
  { name: "CHUTNEY SANDWICH", price: "50.00", category: "Sandwiches" },
  { name: "CHUTNEY CHEESE SANDWICH", price: "90.00", category: "Sandwiches" },
  { name: "VEG SANDWICH", price: "60.00", category: "Sandwiches" },
  { name: "VEG CHEESE SANDWICH", price: "90.00", category: "Sandwiches" },
  { name: "PANEER SANDWICH", price: "100.00", category: "Sandwiches" },
  { name: "PANEER CHEESE SANDWICH", price: "120.00", category: "Sandwiches" },
  { name: "FRENCH FRIES", price: "70.00", category: "Sandwiches" },
  { name: "VEG BURGER WITH FRENCH FRIES", price: "100.00", category: "Sandwiches" }
];

async function main() {
  console.log('Starting menu update...');

  // 1. Ensure all categories exist
  console.log('Updating categories...');
  for (const catName of categoriesData) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName,
        imageUrl: ITEM_TYPES[catName] || null
      }
    });
  }

  // 2. Fetch created categories map
  const categoriesMap = await prisma.category.findMany();
  const catNameToId = Object.fromEntries(categoriesMap.map(c => [c.name, c.id]));

  // 3. Update or Create Menu Items
  console.log(`Processing ${rawItems.length} menu items...`);
  let addedCount = 0;
  let updatedCount = 0;

  for (const item of rawItems) {
    const existingItem = await prisma.menuItem.findFirst({
      where: {
        name: item.name,
        categoryId: catNameToId[item.category]
      }
    });

    if (existingItem) {
      // Update existing item
      await prisma.menuItem.update({
        where: { id: existingItem.id },
        data: {
          price: item.price,
          popular: item.popular || existingItem.popular,
          imageUrl: ITEM_TYPES[item.category] || existingItem.imageUrl
        }
      });
      updatedCount++;
    } else {
      // Create new item
      await prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          popular: item.popular || false,
          categoryId: catNameToId[item.category],
          imageUrl: ITEM_TYPES[item.category] || null,
          description: ""
        }
      });
      addedCount++;
    }
  }

  console.log(`Update complete! Added: ${addedCount}, Updated: ${updatedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
