import { Injectable } from '@nestjs/common';
import { IProductTargetResolver, IProductTarget } from '@eduverse/shared-domain';
import { prisma } from '@eduverse/database';

@Injectable()
export class ProductTargetResolver implements IProductTargetResolver {
  async resolve(targetType: string, targetId: string): Promise<IProductTarget | null> {
    if (targetType === 'COURSE') {
      const course = await prisma.course.findUnique({
        where: { id: targetId },
      });
      if (!course) return null;
      return {
        id: course.id,
        title: course.title,
        description: course.description || undefined,
        thumbnail: undefined,
        type: 'COURSE',
      };
    }

    if (targetType === 'BUNDLE') {
      const bundle = await prisma.bundle.findUnique({
        where: { id: targetId },
      });
      if (!bundle) return null;
      return {
        id: bundle.id,
        title: bundle.name,
        description: bundle.description || undefined,
        type: 'BUNDLE',
      };
    }

    if (targetType.endsWith('_SUBSCRIPTION')) {
      return {
        id: targetId,
        title: `${targetType.replace('_', ' ')} Plan`,
        type: targetType,
      };
    }

    return null;
  }
}
export const IProductTargetResolverToken = Symbol('IProductTargetResolver');
