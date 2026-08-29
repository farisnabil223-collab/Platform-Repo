import { DomainRuleViolationException } from './domain-exceptions';

export class FormValidatorService {
  validateSubmission(fieldsJson: any, payload: Record<string, any>): void {
    const fields = Array.isArray(fieldsJson) ? fieldsJson : [];
    for (const field of fields) {
      if (field.required && (payload[field.name] === undefined || payload[field.name] === null || payload[field.name] === '')) {
        throw new DomainRuleViolationException(`Form submission validation error: Field "${field.label || field.name}" is required.`);
      }
    }
  }
}

export class LowCodeRuntimeEngine {
  executeApp(appConfig: any, userRoles: string[]): boolean {
    const allowedRoles = appConfig.allowedRoles as string[] | undefined;
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAccess = userRoles.some(r => allowedRoles.includes(r));
      if (!hasAccess) {
        throw new DomainRuleViolationException('Low-Code Runtime Access Denied: User role insufficient for application execution');
      }
    }
    return true;
  }
}

export class EntitySchemaGenerator {
  validateAttributes(attributesJson: any): void {
    const attrs = Array.isArray(attributesJson) ? attributesJson : [];
    if (attrs.length === 0) {
      throw new DomainRuleViolationException('Dynamic Entity Validation Error: Entity must declare at least one attribute.');
    }
  }
}

export class AiAppGeneratorService {
  generateAppFromPrompt(prompt: string): { name: string; pages: any[]; nav: any } {
    const cleanPrompt = prompt.trim();
    return {
      name: `AI Generated App: ${cleanPrompt.substring(0, 30)}...`,
      pages: [
        { title: 'Dashboard', layout: 'grid', widgets: ['metric-1', 'chart-1'] },
        { title: 'Management Form', layout: 'single-column', fields: ['name', 'status', 'notes'] },
      ],
      nav: { items: ['Dashboard', 'Management Form'] },
    };
  }
}
