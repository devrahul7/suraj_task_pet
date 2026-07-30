import 'dotenv/config';
import mongoose from 'mongoose';
import { HashUtil } from '../utils/hash';
import User from '../models/user.model';
import { UserRole } from '../types/user.type';

async function seedAdmin(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/adoption';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@petey.com';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const adminName = process.env.ADMIN_NAME || 'PetEy Admin';

  await mongoose.connect(mongoUri);

  const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existingAdmin) {
    if (existingAdmin.role !== UserRole.ADMIN) {
      existingAdmin.role = UserRole.ADMIN;
      await existingAdmin.save();
      console.log(`Updated existing user "${adminEmail}" to ADMIN role.`);
    } else {
      console.log(`Admin user "${adminEmail}" already exists.`);
    }
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await HashUtil.hash(adminPassword);
  await User.create({
    fullName: adminName,
    username: adminUsername,
    email: adminEmail.toLowerCase(),
    password: hashedPassword,
    role: UserRole.ADMIN,
    emailVerified: true,
  });

  console.log(`Admin user created: ${adminEmail}`);
  console.log(`Default password: ${adminPassword}`);
  await mongoose.disconnect();
}

seedAdmin().catch((error: Error) => {
  console.error('Failed to seed admin user:', error.message);
  process.exit(1);
});