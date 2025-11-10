/**
 * E2E Test Script for search-courses tool
 *
 * Tests the Prisma connection and search functionality
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...\n");

  try {
    const count = await prisma.courses.count();
    console.log(`✅ Connected successfully! Found ${count} courses\n`);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

async function testTextSearch() {
  console.log("🔍 Testing text search for 'AI'...\n");

  try {
    const courses = await prisma.courses.findMany({
      where: {
        OR: [
          { title: { contains: 'AI', mode: 'insensitive' } },
          { description: { contains: 'AI', mode: 'insensitive' } },
        ],
      },
      take: 3,
    });

    console.log(`✅ Found ${courses.length} AI courses:`);
    courses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title}`);
    });
    console.log();
    return true;
  } catch (error) {
    console.error("❌ Text search failed:", error);
    return false;
  }
}

async function testCategoryFilter() {
  console.log("🔍 Testing category filter 'AI ∙ GPT'...\n");

  try {
    const courses = await prisma.courses.findMany({
      where: { category: 'AI ∙ GPT' },
      take: 3,
    });

    console.log(`✅ Found ${courses.length} courses in AI ∙ GPT category:`);
    courses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title} (${course.category})`);
    });
    console.log();
    return true;
  } catch (error) {
    console.error("❌ Category filter failed:", error);
    return false;
  }
}

async function testFreeCourses() {
  console.log("🔍 Testing free courses filter...\n");

  try {
    const courses = await prisma.courses.findMany({
      where: { is_free: true },
      take: 3,
    });

    console.log(`✅ Found ${courses.length} free courses:`);
    courses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title} (무료: ${course.is_free})`);
    });
    console.log();
    return true;
  } catch (error) {
    console.error("❌ Free courses filter failed:", error);
    return false;
  }
}

async function testGovernmentSupported() {
  console.log("🔍 Testing government-supported courses filter...\n");

  try {
    const courses = await prisma.courses.findMany({
      where: { is_government_supported: true },
      take: 3,
    });

    console.log(`✅ Found ${courses.length} government-supported courses:`);
    courses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title} (국비지원: ${course.is_government_supported})`);
    });
    console.log();
    return true;
  } catch (error) {
    console.error("❌ Government-supported filter failed:", error);
    return false;
  }
}

async function testCombinedFilters() {
  console.log("🔍 Testing combined filters (AI ∙ GPT + free)...\n");

  try {
    const courses = await prisma.courses.findMany({
      where: {
        AND: [
          { category: 'AI ∙ GPT' },
          { is_free: true },
        ],
      },
      take: 3,
    });

    console.log(`✅ Found ${courses.length} free AI ∙ GPT courses:`);
    courses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title} (${course.category}, 무료: ${course.is_free})`);
    });
    console.log();
    return true;
  } catch (error) {
    console.error("❌ Combined filters failed:", error);
    return false;
  }
}

async function runTests() {
  console.log("=" .repeat(60));
  console.log("  E2E Test: Sparta Course Search Tool");
  console.log("=" .repeat(60));
  console.log();

  const tests = [
    testDatabaseConnection,
    testTextSearch,
    testCategoryFilter,
    testFreeCourses,
    testGovernmentSupported,
    testCombinedFilters,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log("=" .repeat(60));
  console.log(`  Test Results: ${passed} passed, ${failed} failed`);
  console.log("=" .repeat(60));
  console.log();

  await prisma.$disconnect();

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
