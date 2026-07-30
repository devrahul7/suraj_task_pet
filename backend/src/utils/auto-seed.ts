import User from '../models/user.model';
import { UserRole } from '../types/user.type';
import { HashUtil } from './hash';

export async function autoSeedAdmin(): Promise<void> {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@petey.com').toLowerCase();
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'PetEy Admin';

    const hashedPassword = await HashUtil.hash(adminPassword);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.role = UserRole.ADMIN;
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`[AutoSeed] Updated existing admin "${adminEmail}" password to "${adminPassword}".`);
      return;
    }

    await User.create({
      fullName: adminName,
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
    });

    console.log(`[AutoSeed] Created Admin user: ${adminEmail}`);
  } catch (error: any) {
    console.error(`[AutoSeed] Failed to seed admin user: ${error.message}`);
  }
}
