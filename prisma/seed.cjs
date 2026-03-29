const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (use with caution in production)
  await prisma.holidayHours.deleteMany();
  await prisma.openingHours.deleteMany();
  await prisma.storeLocation.deleteMany();

  const store = await prisma.storeLocation.create({
    data: {
      name: "B.R Bakery, Ice Cream Parlour & Cafe",
      street: "Kotekar, Beeri",
      city: "Ullal",
      state: "Karnataka",
      zipCode: "575022",
      latitude: 12.7966,
      longitude: 74.8873,
      regularHours: {
        create: [
          { dayOfWeek: 0, openTime: "11:00", closeTime: "23:00", isClosed: false }, // Sunday
          { dayOfWeek: 1, openTime: "10:00", closeTime: "22:30", isClosed: false },
          { dayOfWeek: 2, openTime: "10:00", closeTime: "22:30", isClosed: false },
          { dayOfWeek: 3, openTime: "10:00", closeTime: "22:30", isClosed: false },
          { dayOfWeek: 4, openTime: "10:00", closeTime: "22:30", isClosed: false },
          { dayOfWeek: 5, openTime: "10:00", closeTime: "22:30", isClosed: false },
          { dayOfWeek: 6, openTime: "10:00", closeTime: "22:30", isClosed: false },
        ]
      },
      holidayHours: {
        create: [
          { date: new Date("2026-12-25"), isClosed: true, reason: "Christmas" },
          { date: new Date("2026-01-01"), openTime: "12:00", closeTime: "20:00", isClosed: false, reason: "New Year's Day" }
        ]
      }
    }
  });

  console.log('Database seeded successfully!', store);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
