export class LeaderElection {
  private leaderId: string | null = null;
  private termExpiry: number = 0;

  async acquireLeadership(nodeId: string, durationMs = 10000): Promise<boolean> {
    const now = Date.now();
    if (this.leaderId === null || now > this.termExpiry || this.leaderId === nodeId) {
      this.leaderId = nodeId;
      this.termExpiry = now + durationMs;
      return true; // Successfully acquired or renewed leadership mutex
    }
    return false; // Leadership is held by another active node
  }

  getLeaderId(): string | null {
    if (Date.now() > this.termExpiry) {
      this.leaderId = null;
    }
    return this.leaderId;
  }
}
