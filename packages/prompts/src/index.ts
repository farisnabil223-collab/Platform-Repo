export type PromptLifecycleState = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'DEPRECATED' | 'ARCHIVED';

export interface PromptTemplate {
  id: string;
  code: string;
  templateText: string;
  version: number;
  state: PromptLifecycleState;
  variables: string[];
}

export class PromptRegistry {
  private templates = new Map<string, PromptTemplate[]>();

  registerTemplate(template: PromptTemplate) {
    const list = this.templates.get(template.code) || [];
    list.push(template);
    this.templates.set(template.code, list);
  }

  getLatestApproved(code: string): PromptTemplate | null {
    const list = this.templates.get(code);
    if (!list) return null;
    const approved = list.filter((t) => t.state === 'APPROVED' || t.state === 'PUBLISHED');
    if (approved.length === 0) return null;
    return approved.sort((a, b) => b.version - a.version)[0];
  }

  formatPrompt(template: PromptTemplate, variables: Record<string, string>): string {
    let result = template.templateText;
    for (const key of template.variables) {
      const val = variables[key] || '';
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }
    return result;
  }
}
