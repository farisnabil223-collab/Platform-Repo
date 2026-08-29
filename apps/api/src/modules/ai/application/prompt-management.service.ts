import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class PromptManagementService {
  async getPromptTemplate(code: string): Promise<string> {
    const template = await prisma.promptTemplate.findUnique({
      where: { code },
    });

    if (template) {
      return template.contentTemplate;
    }

    // Default template text fallback if not present in DB
    return 'Analyze following data: {{data}}';
  }

  async createOrUpdateTemplate(code: string, category: string, contentTemplate: string) {
    return prisma.promptTemplate.upsert({
      where: { code },
      update: { contentTemplate },
      create: {
        id: generateUuidV7(),
        code,
        category,
        contentTemplate,
        tags: 'ai',
        metadata: {},
      },
    });
  }
}
