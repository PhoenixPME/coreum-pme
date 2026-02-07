import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with exact schema match...');
  
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
  
  // Create auction with EXACT field names from schema
  try {
    const auction = await prisma.auction.create({
      data: {
        title: 'Gold Bar 1oz',
        description: '999.9 pure gold bar, mint condition',
        startingPrice: 1900.00,
        currentPrice: 1950.00,
        status: 'active',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Changed from endsAt to endTime
        sellerId: admin.id,
        metalType: 'gold',
        weight: 31.1035,
        purity: 999.9,
      }
    });
    
    console.log(`✅ Created auction: ${auction.title} (ID: ${auction.id})`);
    console.log(`   Price: $${auction.currentPrice}`);
    console.log(`   Ends: ${auction.endTime}`);
    
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
      console.log('Note: Could not create bid. Error:', bidError.message);
    }
    
  } catch (auctionError) {
    console.log('❌ Failed to create auction:', auctionError.message);
  }
  
  // Create a second auction
  try {
    const auction2 = await prisma.auction.create({
      data: {
        title: 'Silver Coin 10oz',
        description: 'American Silver Eagle, 2023',
        startingPrice: 250.00,
        currentPrice: 280.00,
        status: 'active',
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        sellerId: user.id,
        metalType: 'silver',
        weight: 311.035,
        purity: 999.0,
      }
    });
    
    console.log(`✅ Created auction: ${auction2.title} (ID: ${auction2.id})`);
    console.log(`   Price: $${auction2.currentPrice}`);
    console.log(`   Ends: ${auction2.endTime}`);
    
  } catch (error) {
    console.log('Note: Could not create second auction:', error.message);
  }
  
  // Final counts
  const userCount = await prisma.user.count();
  const auctionCount = await prisma.auction.count();
  
  console.log('\n📊 Database Summary:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Auctions: ${auctionCount}`);
  console.log('\n✅ Seeding completed successfully!');
  
  // Show sample query
  console.log('\n📋 Sample data query:');
  console.log('To view your data, run: npx prisma studio');
  console.log('Or query directly:');
  console.log('  SELECT * FROM "User";');
  console.log('  SELECT * FROM "Auction";');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
