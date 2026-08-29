export interface ICredentialRenderer {
  render(template: string, variables: Record<string, any>): Promise<Buffer>;
  supportedType(): 'html' | 'pdf' | 'svg' | 'png';
}
