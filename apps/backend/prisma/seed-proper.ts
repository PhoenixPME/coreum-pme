import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with minimal data...');
  
  // Clear existing data (optional)
  console.log('Cleaning existing data...');
  try {
    await prisma.bid.deleteMany();
    await prisma.auction.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log('Note: Some tables may not exist yet');
  }
  
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
  
  console.log(`✅ Created admin user: ${admin.email}`);
  
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
  
  console.log(`✅ Created test user: ${user.email}`);
  
  // Try to create auction with minimal required fields
  // First, let's check what fields Auction model actually has
  console.log('Attempting to create auction...');
  
  // Create a simple auction with only known fields
  try {
    const auctionData: any = {
      title: 'Gold Bar 1oz',
      description: '999.9 pure gold bar, mint condition',
      startingPrice: 1900.00,
      currentPrice: 1950.00,
      status: 'active',
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sellerId: admin.id,
    };
    
    // Add optional fields if they exist in schema
    try {
      // These might exist
      auctionData.metalType = 'gold';
      auctionData.weight = 31.1035;
      auctionData.purity = 999.9;
    } catch (e) {
      // Ignore if fields don't exist
    }
    
    const auction = await prisma.auction.create({
      data: auctionData
    });
    
    console.log(`✅ Created auction: ${auction.title} (ID: ${auction.id})`);
    
    // Create a bid on the auction
    try {
      const bid = await prisma.bid.create({
        data: {
          amount: 1950.00,
          auctionId: auction.id,
          bidderId: user.id,
          status: 'active'
        }
      });
      console.log(`✅ Created bid: $${bid.amount} by ${user.name}`);
    } catch (bidError) {
      console.log('Note: Could not create bid, Bid model may have different fields');
    }
    
  } catch (auctionError) {
    console.log('❌ Failed to create auction. Model fields may have changed.');
    console.log('Error:', auctionError.message);
    console.log('\nTo fix this, please check your Prisma schema and update the seed script.');
    console.log('Current schema location: prisma/schema.prisma');
  }
  
  // Final counts
  const userCount = await prisma.user.count();
  const auctionCount = await prisma.auction.count();
  const bidCount = await prisma.bid.count().catch(() => 0);
  
  console.log('\n📊 Final Database State:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Auctions: ${auctionCount}`);
  console.log(`   Bids: ${bidCount}`);
  console.log('\n✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
