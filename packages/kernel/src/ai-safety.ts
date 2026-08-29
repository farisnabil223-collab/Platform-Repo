export class AISafetyEngine {
  isPromptSafe(prompt: string): boolean {
    const maliciousPatterns = [
      /ignore previous instructions/i,
      /system override/i,
      /jailbreak/i,
      /prompt injection/i,
    ];
    return !maliciousPatterns.some(pattern => pattern.test(prompt));
  }

  maskPII(text: string): string {
    // Basic email and social security number mask
    let masked = text.replace(/[\w.-]+@([\w-]+\.)+[\w-]{2,4}/gi, '[EMAIL_MASKED]');
    masked = masked.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_MASKED]');
    return masked;
  }
}
