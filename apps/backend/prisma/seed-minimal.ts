import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with minimal required fields...');
  
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
  
  // Create auction with ONLY fields shown in error message
  try {
    const auction = await prisma.auction.create({
      data: {
        title: 'Gold Bar 1oz',
        description: '999.9 pure gold bar, mint condition',
        startingPrice: 1900.00,
        currentPrice: 1950.00,
        status: 'active',
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sellerId: admin.id,
        // Only include: title, description, startingPrice, currentPrice, status, endTime, sellerId
        // Omit: metalType, weight, purity (they don't exist in schema)
      }
    });
    
    console.log(`✅ Created auction: ${auction.title} (ID: ${auction.id})`);
    console.log(`   Price: $${auction.currentPrice}`);
    console.log(`   Ends: ${auction.endTime}`);
    console.log(`   Seller: ${admin.name}`);
    
  } catch (auctionError) {
    console.log('❌ Failed to create auction:', auctionError.message);
    console.log('Available fields according to error: title, description, startingPrice, currentPrice, status, endTime, sellerId');
  }
  
  // Final counts
  const userCount = await prisma.user.count();
  const auctionCount = await prisma.auction.count();
  
  console.log('\n📊 Database Summary:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Auctions: ${auctionCount}`);
  
  if (auctionCount > 0) {
    console.log('\n✅ SUCCESS: Database is seeded with real data!');
    console.log('\nYou now have:');
    console.log('   - 2 users (admin@phoenixpme.com / admin123)');
    console.log('   - 1 auction (Gold Bar 1oz)');
    console.log('   - Password: password123 for both users');
  } else {
    console.log('\n⚠️  Only users were created. Auctions may need schema update.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
