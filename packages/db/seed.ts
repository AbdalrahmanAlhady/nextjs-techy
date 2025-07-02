// File: packages/db/seed.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { faker } from '@faker-js/faker';
import { users, categories, products, orders, orderItems, userRoleEnum, vendorStatusEnum, userStatusEnum, productStatusEnum, orderStatusEnum } from './schema';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs';


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log('🌱 Starting database seed...');

  // --- 1. Clear existing data ---
  console.log('🗑️  Clearing existing data...');
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);
  console.log('✅ Existing data cleared.');

  // --- 2. Create Users ---
    console.log('👤 Creating users...');

  // Hash the password once for all users
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Create an Admin user
  await db.insert(users).values({
    id: createId(),
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'ADMIN',
    status: 'ACTIVE',
  });

  // Create 3 vendors
  //pending means he is still buyer
  const vendorPending = await db.insert(users).values({
    id: createId(),
    email: faker.internet.email(),
    password: hashedPassword,
    name: faker.company.name(),
    role: 'BUYER',
    vendorStatus: 'PENDING',
  }).returning();

  const vendorApproved = await db.insert(users).values({
    id: createId(),
    email: faker.internet.email(),
    password: hashedPassword,
    name: faker.company.name(),
    role: 'VENDOR',
    vendorStatus: 'APPROVED',
  }).returning();
//rejected means he is still buyer
  const vendorRejected = await db.insert(users).values({
    id: createId(),
    email: faker.internet.email(),
    password: hashedPassword,
    name: faker.company.name(),
    role: 'BUYER',
    vendorStatus: 'REJECTED',
  }).returning();

  // Create 2 buyers
  const buyerActive = await db.insert(users).values({
    id: createId(),
    email: faker.internet.email(),
    password: hashedPassword,
    name: faker.person.fullName(),
    role: 'BUYER',
    status: 'ACTIVE',
  }).returning();

  const buyerSuspended = await db.insert(users).values({
    id: createId(),
    email: faker.internet.email(),
    password: hashedPassword,
    name: faker.person.fullName(),
    role: 'BUYER',
    status: 'SUSPENDED',
  }).returning();

  console.log('✅ Users created.');

  // --- 3. Create Categories ---
  console.log('📚 Creating categories...');
  const category1 = await db.insert(categories).values({
    name: 'Phones',
    slug: 'phones',
    description: faker.lorem.sentence(),
  }).returning();

  const category2 = await db.insert(categories).values({
    name: 'Laptops',
    slug: 'laptops',
    description: faker.lorem.sentence(),
  }).returning();

  const category3 = await db.insert(categories).values({
    name: 'Keyboards',
    slug: 'keyboards',
    description: faker.lorem.sentence(),
  }).returning();

  console.log('✅ Categories created.');

  // --- 4. Create Products ---
  console.log('📦 Creating products...');
  const approvedVendorId = vendorApproved[0].id;

  const createProduct = (categoryId: string, imageKeyword: string) => {
    let productName = '';
    switch (imageKeyword) {
      case 'phone':
        productName = `${faker.helpers.arrayElement(['iPhone', 'Samsung Galaxy', 'Google Pixel', 'OnePlus'])} ${faker.number.int({ min: 14, max: 16 })}`;
        break;
      case 'laptop':
        productName = `${faker.helpers.arrayElement(['MacBook Pro', 'Dell XPS', 'HP Spectre', 'Lenovo ThinkPad'])} ${faker.number.int({ min: 13, max: 16 })}`;
        break;
      case 'keyboard':
        productName = `${faker.helpers.arrayElement(['Logitech MX Keys', 'Razer Huntsman', 'Corsair K95', 'Keychron K2'])}`;
        break;
      default:
        productName = faker.commerce.productName();
    }

    return {
        name: productName,
        description: faker.lorem.paragraph(),
        price: parseInt(faker.commerce.price({ min: 500, max: 10000, dec: 0 })), // price in cents
        stock: faker.number.int({ min: 0, max: 100 }),
        vendorId: approvedVendorId,
        categoryId: categoryId,
        image: ``,
        status: 'ACTIVE' as const,
    };
  };

  // 2 products for category 1
  const productsDataCat1 = [createProduct(category1[0].id, 'phone'), createProduct(category1[0].id, 'phone')];
  const productsCat1 = await db.insert(products).values(productsDataCat1).returning();

  // 2 products for category 2
  const productsDataCat2 = [createProduct(category2[0].id, 'laptop'), createProduct(category2[0].id, 'laptop')];
  const productsCat2 = await db.insert(products).values(productsDataCat2).returning();

  // 2 products for category 3
  const productsDataCat3 = [createProduct(category3[0].id, 'keyboard'), createProduct(category3[0].id, 'keyboard')];
  const productsCat3 = await db.insert(products).values(productsDataCat3).returning();

  const allProducts = [...productsCat1, ...productsCat2, ...productsCat3];
  console.log('✅ Products created.');

  // --- 5. Create Orders ---
  console.log('🛒 Creating orders...');
  const activeBuyerId = buyerActive[0].id;

  // Select 1-3 random products for the order
  const selectedProducts = faker.helpers.arrayElements(allProducts, { min: 1, max: 3 });

  const orderItemsData = selectedProducts.map((product) => {
    const quantity = faker.number.int({ min: 1, max: 3 });
    return {
      productId: product.id,
      quantity,
      price: product.price,
    };
  });

  const orderTotal = orderItemsData.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const newOrder = await db.insert(orders).values({
    userId: activeBuyerId,
    status: 'PENDING',
    total: orderTotal,
    shippingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country: faker.location.country(),
    },
  }).returning();

  await db.insert(orderItems).values(
    orderItemsData.map((item) => ({
      orderId: newOrder[0].id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  console.log('✅ Orders created.');

  console.log('🎉 Database seed complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
