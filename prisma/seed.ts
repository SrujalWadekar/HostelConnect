// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Paste the fake JSON array I gave you earlier here:
const dummyHostels = [
  {
    name: "Zenith Boys Hostel",
    address: "Lane 4, Viman Nagar, Pune",
    price: 8500,
    imageUrl: "https://...",
    // ... add the rest of the fields
  },
  // ... other hostels
]

async function main() {
  for (const hostel of dummyHostels) {
    await prisma.hostel.create({ // NOTE: 'hostel' must match the model name in schema.prisma
      data: hostel
    })
  }
  console.log("Fake data inserted!")
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())