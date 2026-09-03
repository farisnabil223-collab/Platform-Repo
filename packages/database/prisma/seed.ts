import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from workspace root .env if not present
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

// Deterministic UUID Constants for Idempotent Reference Data
const ROLE_SUPERADMIN_ID = '00000000-0000-0000-0000-000000000001';
const ROLE_ADMIN_ID      = '00000000-0000-0000-0000-000000000002';
const ROLE_TEACHER_ID    = '00000000-0000-0000-0000-000000000003';
const ROLE_STUDENT_ID    = '00000000-0000-0000-0000-000000000004';
const ROLE_PARENT_ID     = '00000000-0000-0000-0000-000000000005';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000010';
const DEFAULT_ORG_ID    = '00000000-0000-0000-0000-000000000011';

const SUPERADMIN_USER_ID = '00000000-0000-0000-0000-000000000099';
const DEMO_STUDENT_USER_ID = '00000000-0000-0000-0000-000000000101';
const DEMO_STUDENT_PROFILE_ID = '00000000-0000-0000-0000-000000000102';
const DEMO_TEACHER_USER_ID = '00000000-0000-0000-0000-000000000201';
const DEMO_TEACHER_PROFILE_ID = '00000000-0000-0000-0000-000000000202';

async function main() {
  console.log('🌱 Starting EduVerse Production-Ready Seeding Engine...');
  const isProduction = process.env.NODE_ENV === 'production';

  // ==============================================================================
  // 1. RBAC SYSTEM ROLES BOOTSTRAP (Idempotent Upsert)
  // ==============================================================================
  console.log('📦 1/4 Seeding RBAC System Roles...');
  const rolesData = [
    { id: ROLE_SUPERADMIN_ID, name: 'SUPERADMIN', description: 'Platform SuperAdmin with unrestricted global permissions' },
    { id: ROLE_ADMIN_ID,      name: 'ADMIN',      description: 'Institutional Administrator access role' },
    { id: ROLE_TEACHER_ID,    name: 'TEACHER',    description: 'Educator and course instructor access role' },
    { id: ROLE_STUDENT_ID,    name: 'STUDENT',    description: 'Enrolled student learner access role' },
    { id: ROLE_PARENT_ID,     name: 'PARENT',     description: 'Guardian and parent oversight access role' },
  ];

  for (const role of rolesData) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        id: role.id,
        name: role.name,
        description: role.description,
      },
    });
  }
  console.log(' ✅ RBAC Roles synchronized.');

  // ==============================================================================
  // 2. TENANT & ORGANIZATION BOOTSTRAP (Environment-Driven & Idempotent)
  // ==============================================================================
  console.log('📦 2/4 Seeding Primary Bootstrap Tenant & Organization...');
  const tenantName = process.env.SEED_TENANT_NAME || 'EduVerse Primary Institution';

  const tenant = await prisma.tenant.upsert({
    where: { id: DEFAULT_TENANT_ID },
    update: {
      name: tenantName,
      status: 'ACTIVE',
    },
    create: {
      id: DEFAULT_TENANT_ID,
      name: tenantName,
      status: 'ACTIVE',
    },
  });

  const org = await prisma.organization.upsert({
    where: { id: DEFAULT_ORG_ID },
    update: {
      name: `${tenantName} Core Campus`,
      status: 'ACTIVE',
    },
    create: {
      id: DEFAULT_ORG_ID,
      tenantId: tenant.id,
      name: `${tenantName} Core Campus`,
      type: 'MAIN_CAMPUS',
      status: 'ACTIVE',
    },
  });

  console.log(` ✅ Primary Tenant & Org synchronized: ${tenant.name} (${org.name}).`);

  // ==============================================================================
  // 3. INITIAL SUPERADMIN ACCOUNT BOOTSTRAP (Environment-Driven & Secure)
  // ==============================================================================
  console.log('📦 3/4 Seeding Initial SuperAdmin Account...');
  const superAdminEmail = process.env.SEED_SUPERADMIN_EMAIL || 'superadmin@eduverse.com';
  const rawSuperAdminPassword = process.env.SEED_SUPERADMIN_PASSWORD || 'SuperAdminSecure2026!';
  
  const superAdminPasswordHash = await argon2.hash(rawSuperAdminPassword);

  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      isActive: true,
      emailVerified: true,
    },
    create: {
      id: SUPERADMIN_USER_ID,
      email: superAdminEmail,
      passwordHash: superAdminPasswordHash,
      isActive: true,
      emailVerified: true,
    },
  });

  // Assign SUPERADMIN Role (Idempotent check)
  const existingUserRole = await prisma.userRole.findFirst({
    where: { userId: superAdminUser.id, roleId: ROLE_SUPERADMIN_ID },
  });

  if (!existingUserRole) {
    await prisma.userRole.create({
      data: {
        userId: superAdminUser.id,
        roleId: ROLE_SUPERADMIN_ID,
      },
    });
  }
  console.log(` ✅ SuperAdmin Account synchronized: ${superAdminUser.email}`);

  // ==============================================================================
  // 4. DEMO & DEVELOPMENT DATA ISOLATION (Non-Production Only)
  // ==============================================================================
  if (!isProduction) {
    console.log('📦 4/4 Seeding Development & Demo Fixtures (Non-Production Mode)...');
    
    const demoPasswordHash = await argon2.hash('password123');

    // Demo Student User
    const demoStudentUser = await prisma.user.upsert({
      where: { email: 'student@eduverse.com' },
      update: { isActive: true, emailVerified: true },
      create: {
        id: DEMO_STUDENT_USER_ID,
        email: 'student@eduverse.com',
        passwordHash: demoPasswordHash,
        isActive: true,
        emailVerified: true,
      },
    });

    const existingStudentRole = await prisma.userRole.findFirst({
      where: { userId: demoStudentUser.id, roleId: ROLE_STUDENT_ID },
    });
    if (!existingStudentRole) {
      await prisma.userRole.create({ data: { userId: demoStudentUser.id, roleId: ROLE_STUDENT_ID } });
    }

    const demoStudentProfile = await prisma.student.upsert({
      where: { userId: demoStudentUser.id },
      update: { status: 'ACTIVE' },
      create: {
        id: DEMO_STUDENT_PROFILE_ID,
        userId: demoStudentUser.id,
        studentCode: 'EV-2026-8942',
        status: 'ACTIVE',
        academicMetadata: { advisor: 'د. سارة أحمد', department: 'الرياضيات' },
      },
    });

    // Demo Teacher User
    const demoTeacherUser = await prisma.user.upsert({
      where: { email: 'teacher@eduverse.com' },
      update: { isActive: true, emailVerified: true },
      create: {
        id: DEMO_TEACHER_USER_ID,
        email: 'teacher@eduverse.com',
        passwordHash: demoPasswordHash,
        isActive: true,
        emailVerified: true,
      },
    });

    const existingTeacherRole = await prisma.userRole.findFirst({
      where: { userId: demoTeacherUser.id, roleId: ROLE_TEACHER_ID },
    });
    if (!existingTeacherRole) {
      await prisma.userRole.create({ data: { userId: demoTeacherUser.id, roleId: ROLE_TEACHER_ID } });
    }

    const demoTeacherProfile = await prisma.teacher.upsert({
      where: { userId: demoTeacherUser.id },
      update: { bio: 'مدرسة واستشارية مادة الرياضيات العامة والهندسة الفراغية.' },
      create: {
        id: DEMO_TEACHER_PROFILE_ID,
        userId: demoTeacherUser.id,
        teacherCode: 'TCH-9936',
        bio: 'مدرسة واستشارية مادة الرياضيات العامة والهندسة الفراغية.',
        specialties: ['الرياضيات', 'الهندسة'],
      },
    });

    // Demo Courses
    const coursesData = [
      { id: '00000000-0000-0000-0000-000000000301', code: 'MATH-101', slug: 'math-101', title: 'Calculus I', desc: 'Differential and integral calculus of one variable.' },
      { id: '00000000-0000-0000-0000-000000000302', code: 'PHYS-202', slug: 'phys-202', title: 'Quantum Physics', desc: 'Wave mechanics, Schrödinger equation, and atomic structures.' },
      { id: '00000000-0000-0000-0000-000000000303', code: 'CS-301',   slug: 'cs-301',   title: 'Introduction to Software Engineering', desc: 'Software lifecycle models, design patterns, and agile methods.' },
    ];

    for (const c of coursesData) {
      await prisma.course.upsert({
        where: { code: c.code },
        update: { title: c.title, description: c.desc, status: 'PUBLISHED' },
        create: {
          id: c.id,
          code: c.code,
          slug: c.slug,
          title: c.title,
          description: c.desc,
          status: 'PUBLISHED',
          teacherId: demoTeacherProfile.id,
        },
      });
    }

    console.log(' ✅ Development demo fixtures synchronized.');
  } else {
    console.log(' ℹ️ Production Mode detected: Skipped creating development demo users & courses.');
  }

  console.log('🌱 EduVerse Seeding Engine finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ CRITICAL SEEDING ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
