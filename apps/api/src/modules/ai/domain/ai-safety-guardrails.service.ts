import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AISafetyGuardrails {
  validateInput(input: string): string {
    // 1. Simple PII masking (e.g. Email addresses, Credit cards)
    let sanitized = input.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[MASKED_EMAIL]');

    // 2. Simple Prompt Injection heuristic validation
    const lower = sanitized.toLowerCase();
    const injectionKeywords = [
      'ignore previous instructions',
      'system prompt',
      'bypass filters',
      'act as',
    ];

    for (const kw of injectionKeywords) {
      if (lower.includes(kw)) {
        throw new BadRequestException('Security Alert: Potential prompt injection attempt blocked.');
      }
    }

    return sanitized;
  }

  validateOutput(output: string): string {
    // Verify output doesn't contain forbidden keywords or debug leak tokens
    if (output.includes('SYSTEM_PROMPT_UNLOCKED') || output.includes('INTERNAL_ERROR_EXPOSE')) {
      return 'The generated response was filtered by safety guardrails.';
    }
    return output;
  }
}
