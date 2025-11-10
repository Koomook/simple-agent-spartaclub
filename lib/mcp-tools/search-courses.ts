import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sparta Course Search Tool
 *
 * Searches the Sparta coding club course database (48 courses)
 * by natural language query, category, and filters.
 */
export const searchCourses = tool(
  "search-courses",
  "Search Sparta coding club courses by query, category, or filters",
  {
    query: z.string().optional().describe("Natural language search query to match against title and description"),
    category: z.string().optional().describe("Filter by course category (e.g., 'AI ∙ GPT', '개발', '취업 ∙ 자격증', '데이터', '디자인', '기타')"),
    is_free: z.boolean().optional().describe("Show only free courses"),
    is_government_supported: z.boolean().optional().describe("Show only government-supported courses"),
    limit: z.number().optional().default(10).describe("Maximum number of results to return (default: 10, max: 50)"),
  },
  async ({ query, category, is_free, is_government_supported, limit = 10 }) => {
    try {
      // Validate limit
      const validLimit = Math.min(Math.max(1, limit), 50);

      // Build where clause
      const whereConditions: any[] = [];

      // Text search across title and description
      if (query && query.trim()) {
        whereConditions.push({
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        });
      }

      // Category filter
      if (category) {
        whereConditions.push({ category: { equals: category } });
      }

      // Free courses filter
      if (is_free !== undefined) {
        whereConditions.push({ is_free });
      }

      // Government-supported filter
      if (is_government_supported !== undefined) {
        whereConditions.push({ is_government_supported });
      }

      // Execute query
      const courses = await prisma.courses.findMany({
        where: whereConditions.length > 0 ? { AND: whereConditions } : {},
        take: validLimit,
        orderBy: { created_at: 'desc' },
      });

      // Format results
      if (courses.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: formatNoResults(query, category, is_free, is_government_supported),
          }],
        };
      }

      const formattedResults = formatCourses(courses, query, category, is_free, is_government_supported);

      return {
        content: [{
          type: "text" as const,
          text: formattedResults,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `데이터베이스 연결 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        }],
        isError: true,
      };
    }
  }
);

/**
 * Format courses into readable text
 */
function formatCourses(
  courses: any[],
  query?: string,
  category?: string,
  is_free?: boolean,
  is_government_supported?: boolean
): string {
  const parts: string[] = [];

  // Header with search summary
  const filters: string[] = [];
  if (query) filters.push(`검색어: "${query}"`);
  if (category) filters.push(`카테고리: ${category}`);
  if (is_free) filters.push('무료 강의만');
  if (is_government_supported) filters.push('국비지원 강의만');

  parts.push(`**스파르타코딩클럽 강의 검색 결과**\n`);
  if (filters.length > 0) {
    parts.push(`🔍 ${filters.join(' | ')}\n`);
  }
  parts.push(`📚 총 ${courses.length}개의 강의를 찾았습니다.\n`);

  // Course listings
  courses.forEach((course, index) => {
    const tags: string[] = [];
    if (course.is_free) tags.push('💰 무료');
    if (course.is_government_supported) tags.push('🎓 국비지원');
    if (course.category) tags.push(`📂 ${course.category}`);

    const tagString = tags.length > 0 ? ` ${tags.join(' · ')}` : '';
    const priceString = course.price ? ` | 가격: ${course.price}` : '';

    parts.push(`\n${index + 1}. **${course.title}**${tagString}`);

    if (course.description) {
      // Truncate long descriptions
      const maxDescLength = 200;
      const desc = course.description.length > maxDescLength
        ? course.description.substring(0, maxDescLength) + '...'
        : course.description;
      parts.push(`   ${desc}`);
    }

    if (course.url) {
      parts.push(`   🔗 [강의 보기](${course.url})`);
    }
  });

  parts.push('\n---\n💡 더 많은 강의를 보시려면 [스파르타코딩클럽](https://spartacodingclub.kr)을 방문하세요!');

  return parts.join('\n');
}

/**
 * Format no results message
 */
function formatNoResults(
  query?: string,
  category?: string,
  is_free?: boolean,
  is_government_supported?: boolean
): string {
  const parts: string[] = [];

  parts.push('**검색 결과가 없습니다** 😔\n');

  const filters: string[] = [];
  if (query) filters.push(`검색어: "${query}"`);
  if (category) filters.push(`카테고리: ${category}`);
  if (is_free) filters.push('무료 강의만');
  if (is_government_supported) filters.push('국비지원 강의만');

  if (filters.length > 0) {
    parts.push(`🔍 ${filters.join(' | ')}`);
  }

  parts.push('\n**다음을 시도해보세요:**');
  parts.push('- 다른 검색어를 사용해보세요');
  parts.push('- 필터 조건을 줄여보세요');
  parts.push('- 카테고리를 변경해보세요');
  parts.push('\n💡 전체 강의를 보시려면 [스파르타코딩클럽](https://spartacodingclub.kr)을 방문하세요!');

  return parts.join('\n');
}
