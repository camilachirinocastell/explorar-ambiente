// backend/src/scripts/create-admin.ts
// One-off command that creates the first admin user. The data comes from the
// ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD environment variables, so the password
// is never typed as a command argument or saved in the shell history.

import { z } from 'zod';
import { connectDatabase, disconnectDatabase } from '../config/db.config';
import { User } from '../models/user.model';
import { createUser } from '../services/auth.service';

const adminInputSchema = z.object({
  ADMIN_NAME: z.string().trim().min(2),
  ADMIN_EMAIL: z.string().trim().toLowerCase().pipe(z.email()),
  ADMIN_PASSWORD: z.string().min(12).max(128),
});

// MongoDB error code for a violated unique index (an existing email)
function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 11000
  );
}

async function main(): Promise<void> {
  const parsed = adminInputSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid admin data:');
    for (const issue of parsed.error.issues) {
      console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  try {
    // Make sure the unique email index exists before the first insert
    await User.init();

    const user = await createUser({
      fullName: parsed.data.ADMIN_NAME,
      email: parsed.data.ADMIN_EMAIL,
      password: parsed.data.ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Admin user created: ${user.email}`);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      console.error('A user with that email already exists');
      process.exitCode = 1;
    } else {
      throw error;
    }
  } finally {
    await disconnectDatabase();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to create the admin user:', error);
  process.exit(1);
});
