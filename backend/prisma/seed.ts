import { PrismaClient } from '@prisma/client';

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'erimuventures@gmail.com').toLowerCase();
const adminPassword = process.env.SEED_ADMIN_PASSWORD || '@Erimu2030';
const adminFullName = process.env.SEED_ADMIN_FULL_NAME || 'ERIMU Admin';

async function main() {
  const company = await prisma.company.upsert({
    where: { slug: 'erimu-ventures' },
    update: {
      address: 'Kagio, Kirinyaga, Kenya',
      phones: ['+254798426326'],
      emails: ['erimuventures@gmail.com'],
      phone: '+254798426326',
      email: 'erimuventures@gmail.com',
      mission: 'To simplify property discovery and ownership with trusted digital tools.',
      vision: 'To be East Africa\'s most trusted property platform.',
      about: 'ERIMU Company helps people buy, sell, and manage property with confidence.',
      description: 'ERIMU Company helps people buy, sell, and manage property with confidence.',
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/erimuventures' },
        { platform: 'Instagram', url: 'https://instagram.com/erimuventures' },
      ],
      website: 'https://erimuventures.com',
      googleMapsUrl: 'https://maps.google.com/?q=Kagio+Kirinyaga+Kenya',
    },
    create: {
      name: 'ERIMU Ventures Ltd.',
      slug: 'erimu-ventures',
      description: 'ERIMU Ventures Ltd. is a modern property platform in East Africa',
      email: 'erimuventures@gmail.com',
      emails: ['erimuventures@gmail.com'],
      phones: ['+254798426326'],
      phone: '+254798426326',
      address: 'Kagio, Kirinyaga, Kenya',
      mission: 'To simplify property discovery and ownership with trusted digital tools.',
      vision: 'To be East Africa\'s most trusted property platform.',
      about: 'ERIMU Ventures Ltd. helps people buy, sell, and manage property with confidence.',
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/erimuventures' },
        { platform: 'Instagram', url: 'https://instagram.com/erimuventures' },
      ],
      website: 'https://erimuventures.com',
      googleMapsUrl: 'https://maps.google.com/?q=Kagio+Kirinyaga+Kenya',
    },
  });

  await prisma.settings.createMany({
    data: [
      { companyId: company.id, key: 'siteName', value: 'ERIMU Ventures Ltd.' },
      { companyId: company.id, key: 'siteDescription', value: 'Modern property platform' },
    ],
    skipDuplicates: true,
  });

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      fullName: adminFullName,
      role: 'SUPER_ADMIN',
      companyId: company.id,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      fullName: adminFullName,
      role: 'SUPER_ADMIN',
      companyId: company.id,
    },
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
