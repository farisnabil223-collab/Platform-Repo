import { Injectable } from '@nestjs/common';
import { IAITool, ToolRegistry, ToolExecutor } from '../domain/ai-tool-calling.interface';

@Injectable()
export class MockToolCallingService implements ToolRegistry, ToolExecutor {
  private tools = new Map<string, IAITool>();

  registerTool(tool: IAITool): void {
    this.tools.set(tool.getName(), tool);
  }

  getTool(name: string): IAITool | undefined {
    return this.tools.get(name);
  }

  listTools(): IAITool[] {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, args: any): Promise<any> {
    const tool = this.getTool(name);
    if (!tool) throw new Error(`Tool "${name}" not found in registry.`);
    return tool.execute(args);
  }
}
