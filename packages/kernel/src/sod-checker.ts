export class SegregationOfDutiesChecker {
  private readonly conflictingPairs = [
    ['STUDENT', 'TEACHER'],
    ['STUDENT', 'ADMIN'],
    ['TEACHER', 'SUPERADMIN'],
  ];

  hasConflict(roles: string[]): boolean {
    for (const pair of this.conflictingPairs) {
      if (roles.includes(pair[0]) && roles.includes(pair[1])) {
        return true; // Conflicting combination detected
      }
    }
    return false;
  }
}
