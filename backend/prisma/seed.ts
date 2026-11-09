import { PrismaClient, RoleName } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RBAC Roles, Permissions, and Super Admin...');

  // 1. Create Core Permissions (Section 5.1 & FR-ADM-07)
  const permissionsData = [
    { name: 'applications:crud_own', description: 'Create, read, update, and delete own job applications' },
    { name: 'users:read', description: 'View user list and activity logs' },
    { name: 'users:suspend', description: 'Suspend and reactivate user accounts' },
    { name: 'logs:export', description: 'Export user activity and system audit logs' },
    { name: 'roles:manage', description: 'Assign and revoke user roles and manage system settings' },
  ];

  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // 2. Create Roles and link Permissions (FR-AUTH-06: User, Admin, Super Admin)
  await prisma.role.upsert({
    where: { name: RoleName.USER },
    update: {},
    create: {
      name: RoleName.USER,
      description: 'Registered job seeker managing own applications and dashboard',
      permissions: {
        connect: [{ name: 'applications:crud_own' }],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: {
      name: RoleName.ADMIN,
      description: 'Platform operator monitoring user activity and managing accounts',
      permissions: {
        connect: [
          { name: 'applications:crud_own' },
          { name: 'users:read' },
          { name: 'users:suspend' },
          { name: 'logs:export' },
        ],
      },
    },
  });

  await prisma.role.upsert({
    where: { name: RoleName.SUPER_ADMIN },
    update: {},
    create: {
      name: RoleName.SUPER_ADMIN,
      description: 'System administrator with full admin rights plus role assignment',
      permissions: {
        connect: permissionsData.map((p) => ({ name: p.name })),
      },
    },
  });

  // 3. Seed Initial Super Admin Account (NFR-03: bcrypt password hashing)
  const superAdminEmail = 'admin@jobtracker.com';
  const passwordHash = await bcrypt.hash('SuperAdmin@2026', 12);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      name: 'Abdullah Nazmus Sakib (Super Admin)',
      email: superAdminEmail,
      passwordHash,
      role: RoleName.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  console.log('✅ Seeding complete! Super Admin ready: admin@jobtracker.com / SuperAdmin@2026');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
