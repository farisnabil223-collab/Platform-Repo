export interface IMailProvider {
  sendEmail(to: string, subject: string, templateName: string, context: Record<string, any>): Promise<void>;
  sendRawEmail(to: string, subject: string, body: string, isHtml?: boolean): Promise<void>;
}
