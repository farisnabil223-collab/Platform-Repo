import { Module } from '@nestjs/common';
import { WorkflowController } from './presentation/workflow-v1.controller';

@Module({
  controllers: [WorkflowController],
  providers: [],
  exports: [],
})
export class WorkflowModule {}
