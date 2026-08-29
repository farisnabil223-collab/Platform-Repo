export interface IAITool {
  getName(): string;
  getDescription(): string;
  getParametersSchema(): any;
  execute(args: any): Promise<any>;
}

export interface ToolRegistry {
  registerTool(tool: IAITool): void;
  getTool(name: string): IAITool | undefined;
  listTools(): IAITool[];
}
export const ToolRegistry = Symbol('ToolRegistry');

export interface ToolExecutor {
  executeTool(name: string, args: any): Promise<any>;
}
export const ToolExecutor = Symbol('ToolExecutor');
