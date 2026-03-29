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
  {name: "LIME JUICE", price: "30.00", category: "Juice"},
  {name: "ORANGE", price: "70.00", category: "Juice"},
  {name: "MUSK MELON", price: "70.00", category: "Juice"},
  {name: "PINEAPPLE", price: "70.00", category: "Juice"},
  {name: "PAPAYA", price: "70.00", category: "Juice"},
  {name: "WATERMELON", price: "70.00", category: "Juice"},
  {name: "GRAPE", price: "70.00", category: "Juice"},
  {name: "POMEGRANATE", price: "80.00", category: "Juice"},
  {name: "MUSAMBI", price: "70.00", category: "Juice"},
  {name: "MANGO (SEASONAL)", price: "80.00", category: "Juice"},
  {name: "MIX FRUIT", price: "80.00", category: "Juice"},
  {name: "GRAPE & PINEAPPLE", price: "90.00", category: "Juice"},
  {name: "MINT MOJITO", price: "70.00", category: "Mojito", popular: true},
  {name: "OREO", price: "100 / 120.00", category: "Milk Shake", popular: true},
  {name: "MASALA DOSA", price: "70.00", category: "Dosa Items", popular: true},
  {name: "COLD COFFEE", price: "60 / 90.00", category: "Milk Shake", popular: true},
  {name: "SCHEZWAN FRIED RICE", price: "90.00", category: "Chinese Items", popular: true},
  {name: "GADBAD", price: "150.00", category: "Special Ice Cream"},
  {name: "SET DOSA", price: "60.00", category: "Dosa Items"},
  {name: "COFFEE", price: "30.00", category: "Hot Beverages"}
];

async function main() {
  console.log('Seeding menu data...');
  
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

  const categories = await prisma.category.findMany();
  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

  for (const item of rawItems) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        price: item.price,
        popular: item.popular || false,
        categoryId: catMap[item.category],
        imageUrl: ITEM_TYPES[item.category] || null,
        description: "" 
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seed finished.');
  });
