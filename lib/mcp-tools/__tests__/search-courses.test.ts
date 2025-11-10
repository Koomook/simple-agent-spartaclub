import { describe, it, expect, beforeAll } from '@jest/globals';
import { PrismaClient } from '../../generated/prisma';

describe('Search Courses Tool', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  describe('Database Connection', () => {
    it('should connect to the database successfully', async () => {
      const courses = await prisma.courses.findMany({ take: 1 });
      expect(courses).toBeDefined();
    });

    it('should retrieve 48 total courses', async () => {
      const count = await prisma.courses.count();
      expect(count).toBe(48);
    });
  });

  describe('Course Search', () => {
    it('should search by text query in title', async () => {
      const courses = await prisma.courses.findMany({
        where: {
          title: { contains: 'AI', mode: 'insensitive' },
        },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
    });

    it('should search by text query in description', async () => {
      const courses = await prisma.courses.findMany({
        where: {
          description: { contains: '개발', mode: 'insensitive' },
        },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const courses = await prisma.courses.findMany({
        where: { category: 'AI ∙ GPT' },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
      courses.forEach(course => {
        expect(course.category).toBe('AI ∙ GPT');
      });
    });

    it('should filter by is_free', async () => {
      const courses = await prisma.courses.findMany({
        where: { is_free: true },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
      courses.forEach(course => {
        expect(course.is_free).toBe(true);
      });
    });

    it('should filter by is_government_supported', async () => {
      const courses = await prisma.courses.findMany({
        where: { is_government_supported: true },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
      courses.forEach(course => {
        expect(course.is_government_supported).toBe(true);
      });
    });

    it('should combine multiple filters', async () => {
      const courses = await prisma.courses.findMany({
        where: {
          AND: [
            { category: 'AI ∙ GPT' },
            { is_free: true },
          ],
        },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
      courses.forEach(course => {
        expect(course.category).toBe('AI ∙ GPT');
        expect(course.is_free).toBe(true);
      });
    });

    it('should respect limit parameter', async () => {
      const courses = await prisma.courses.findMany({
        take: 5,
      });
      expect(courses.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle no results gracefully', async () => {
      const courses = await prisma.courses.findMany({
        where: { title: { contains: 'nonexistentcoursexyz123' } },
      });
      expect(courses).toEqual([]);
    });

    it('should handle Korean text search', async () => {
      const courses = await prisma.courses.findMany({
        where: {
          OR: [
            { title: { contains: '강의', mode: 'insensitive' } },
            { description: { contains: '강의', mode: 'insensitive' } },
          ],
        },
        take: 10,
      });
      expect(courses.length).toBeGreaterThan(0);
    });
  });
});
