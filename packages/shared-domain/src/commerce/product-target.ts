export interface IProductTarget {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  type: string;
}

export interface IProductTargetResolver {
  resolve(targetType: string, targetId: string): Promise<IProductTarget | null>;
}
