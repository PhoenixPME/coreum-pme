import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@phoenixpme.com' },
    update: {},
    create: {
      email: 'admin@phoenixpme.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'active',
    },
  });
  
  // Create test user
  const userPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@phoenixpme.com' },
    update: {},
    create: {
      email: 'user@phoenixpme.com',
      passwordHash: userPassword,
      name: 'Test User',
      role: 'user',
      status: 'active',
    },
  });
  
  console.log('✅ Users created successfully!');
  
  // Try to create auctions if the model exists
  try {
    // Check if Auction model exists by trying to count
    const auctionCount = await prisma.auction.count();
    console.log(`Existing auctions: ${auctionCount}`);
    
    // Create sample auctions
    const auctionData = [
      {
        title: 'Gold Bar 1oz',
        description: '999.9 pure gold bar, mint condition',
        startingPrice: 1900.00,
        currentPrice: 1950.00, // Changed from currentBid to currentPrice
        reservePrice: 1850.00,
        status: 'active',
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sellerId: admin.id,
        metalType: 'gold',
        weight: 31.1035,
        purity: 999.9,
      },
      {
        title: 'Silver Coin 10oz',
        description: 'American Silver Eagle, 2023',
        startingPrice: 250.00,
        currentPrice: 280.00, // Changed from currentBid to currentPrice
        reservePrice: 220.00,
        status: 'active',
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        sellerId: user.id,
        metalType: 'silver',
        weight: 311.035,
        purity: 999.0,
      },
    ];
    
    // Try to create auctions
    for (const data of auctionData) {
      try {
        await prisma.auction.create({
          data
        });
        console.log(`Created auction: ${data.title}`);
      } catch (auctionError) {
        console.log(`Skipping auction creation: ${auctionError.message}`);
      }
    }
    
  } catch (modelError) {
    console.log('Note: Auction model may not exist or has different fields');
    console.log('You may need to update your Prisma schema first');
  }
  
  console.log('✅ Database seeding completed!');
  console.log(`   Created ${await prisma.user.count()} users`);
  console.log(`   Created ${await prisma.auction.count()} auctions`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
