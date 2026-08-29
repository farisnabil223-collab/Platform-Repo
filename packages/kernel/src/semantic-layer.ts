export interface SemanticMetric {
  id: string;
  name: string;
  formulaExpression: string;
  version: string;
  dependencies: string[];
  category: string;
}

export interface Dataset {
  id: string;
  name: string;
  version: string;
  ownership: string;
  tags: string[];
  certified: boolean;
  validationRules: any;
}

export interface LineageEdge {
  id: string;
  sourceNode: string;
  targetNode: string;
  transformationType: string;
}

export class SemanticLayer {
  private metrics: Map<string, SemanticMetric> = new Map();
  private datasets: Map<string, Dataset> = new Map();
  private lineage: LineageEdge[] = [];

  registerMetric(metric: SemanticMetric): void {
    // Validate semantic versioning format (e.g. 1.0.0)
    if (!/^\d+\.\d+\.\d+$/.test(metric.version)) {
      throw new Error(`Invalid semantic version for metric: ${metric.name}`);
    }
    this.metrics.set(metric.name, metric);
  }

  getMetric(name: string): SemanticMetric | undefined {
    return this.metrics.get(name);
  }

  registerDataset(dataset: Dataset): void {
    this.datasets.set(dataset.name, dataset);
  }

  addLineageTrace(edge: LineageEdge): void {
    this.lineage.push(edge);
  }

  getLineageTrace(targetNode: string): LineageEdge[] {
    return this.lineage.filter(edge => edge.targetNode === targetNode);
  }

  evaluateAlert(metricName: string, value: number, threshold: number, operator: 'GT' | 'LT' | 'EQ'): boolean {
    switch (operator) {
      case 'GT':
        return value > threshold;
      case 'LT':
        return value < threshold;
      case 'EQ':
        return value === threshold;
      default:
        return false;
    }
  }
}
