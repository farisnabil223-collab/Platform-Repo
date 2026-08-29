export class IntegrationSchemaValidator {
  validatePayload(payload: any, schema: any): boolean {
    // Basic verification matching required fields presence
    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (!(field in payload)) {
          return false;
        }
      }
    }
    return true;
  }

  isCompatible(oldSchema: any, newSchema: any): boolean {
    // Backward compatibility validation: new schema must not add new required fields
    if (newSchema.required && Array.isArray(newSchema.required)) {
      const oldRequired = oldSchema.required || [];
      for (const field of newSchema.required) {
        if (!oldRequired.includes(field)) {
          return false; // Incompatible change: added a new required field
        }
      }
    }
    return true;
  }
}
