export interface SlaTask {
  id: string;
  slaDeadline: Date;
  status: string;
  escalationLevel: string;
}

export class SlaTracker {
  evaluateEscalation(task: SlaTask): string {
    if (task.status === 'RESOLVED') {
      return task.escalationLevel;
    }
    const isOverdue = new Date().getTime() > new Date(task.slaDeadline).getTime();
    if (isOverdue) {
      if (task.escalationLevel === 'LEVEL_1') return 'LEVEL_2';
      if (task.escalationLevel === 'LEVEL_2') return 'LEVEL_3';
      return 'LEVEL_3'; // Capped at LEVEL_3
    }
    return task.escalationLevel;
  }
}
