import {
  IAssessmentRepository,
  IAssessmentAttemptRepository,
  IQuestionRepository,
  IQuestionBankRepository,
  IAssessmentResultRepository,
  Assessment,
  AssessmentCode,
  AssessmentDuration,
  PassingScore,
  Score,
  Question,
  QuestionCode,
  QuestionDifficulty,
  QuestionType,
  QuestionBank,
  AssessmentAttempt,
  AttemptNumber,
  AssessmentResult
} from '@eduverse/kernel';
import { prisma } from './index';

// ==========================================
// 1. Assessment Repository
// ==========================================

export class AssessmentRepository implements IAssessmentRepository {
  async findById(id: string): Promise<Assessment | null> {
    const row = await prisma.assessment.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Assessment(row.id, {
      code: new AssessmentCode(row.code),
      title: row.title,
      type: row.type,
      status: row.status as any,
      maxScore: new Score(row.maxScore),
      passingScore: new PassingScore(row.passingScore),
      durationSeconds: new AssessmentDuration(row.durationSeconds),
      settings: row.settings as Record<string, any>,
      version: row.version,
    }, row.version);
  }

  async findByCode(code: string): Promise<Assessment | null> {
    const row = await prisma.assessment.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Assessment(row.id, {
      code: new AssessmentCode(row.code),
      title: row.title,
      type: row.type,
      status: row.status as any,
      maxScore: new Score(row.maxScore),
      passingScore: new PassingScore(row.passingScore),
      durationSeconds: new AssessmentDuration(row.durationSeconds),
      settings: row.settings as Record<string, any>,
      version: row.version,
    }, row.version);
  }

  async findAll(): Promise<Assessment[]> {
    const rows = await prisma.assessment.findMany({ where: { deletedAt: null } });
    return rows.map(row => new Assessment(row.id, {
      code: new AssessmentCode(row.code),
      title: row.title,
      type: row.type,
      status: row.status as any,
      maxScore: new Score(row.maxScore),
      passingScore: new PassingScore(row.passingScore),
      durationSeconds: new AssessmentDuration(row.durationSeconds),
      settings: row.settings as Record<string, any>,
      version: row.version,
    }, row.version));
  }

  async save(entity: Assessment): Promise<void> {
    await prisma.assessment.upsert({
      where: { id: entity.id },
      update: {
        code: entity.code.value,
        title: entity.title,
        type: entity.type,
        status: entity.status as any,
        maxScore: entity.maxScore.value,
        passingScore: entity.passingScore.value,
        durationSeconds: entity.durationSeconds.value,
        settings: entity.settings,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        code: entity.code.value,
        title: entity.title,
        type: entity.type,
        status: entity.status as any,
        maxScore: entity.maxScore.value,
        passingScore: entity.passingScore.value,
        durationSeconds: entity.durationSeconds.value,
        settings: entity.settings,
        version: 1,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.assessment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

// ==========================================
// 2. Question Repository
// ==========================================

export class QuestionRepository implements IQuestionRepository {
  async findById(id: string): Promise<Question | null> {
    const row = await prisma.question.findFirst({ where: { id, deletedAt: null } });
    if (!row) return null;
    return new Question(row.id, {
      bankId: row.bankId || undefined,
      code: new QuestionCode(row.code),
      type: new QuestionType(row.type),
      difficulty: new QuestionDifficulty(row.difficulty as any),
      text: row.text,
      version: row.version,
    }, row.version);
  }

  async findByCode(code: string): Promise<Question | null> {
    const row = await prisma.question.findFirst({ where: { code, deletedAt: null } });
    if (!row) return null;
    return new Question(row.id, {
      bankId: row.bankId || undefined,
      code: new QuestionCode(row.code),
      type: new QuestionType(row.type),
      difficulty: new QuestionDifficulty(row.difficulty as any),
      text: row.text,
      version: row.version,
    }, row.version);
  }

  async findAll(): Promise<Question[]> {
    const rows = await prisma.question.findMany({ where: { deletedAt: null } });
    return rows.map(row => new Question(row.id, {
      bankId: row.bankId || undefined,
      code: new QuestionCode(row.code),
      type: new QuestionType(row.type),
      difficulty: new QuestionDifficulty(row.difficulty as any),
      text: row.text,
      version: row.version,
    }, row.version));
  }

  async save(entity: Question): Promise<void> {
    await prisma.question.upsert({
      where: { id: entity.id },
      update: {
        bankId: entity.bankId,
        code: entity.code.value,
        type: entity.type.value as any,
        difficulty: entity.difficulty.value,
        text: entity.text,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        bankId: entity.bankId,
        code: entity.code.value,
        type: entity.type.value as any,
        difficulty: entity.difficulty.value,
        text: entity.text,
        version: 1,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.question.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

// ==========================================
// 3. Question Bank Repository
// ==========================================

export class QuestionBankRepository implements IQuestionBankRepository {
  async findById(id: string): Promise<QuestionBank | null> {
    const row = await prisma.questionBank.findUnique({ where: { id } });
    if (!row) return null;
    return new QuestionBank(row.id, {
      title: row.title,
      description: row.description || undefined,
    });
  }

  async findAll(): Promise<QuestionBank[]> {
    const rows = await prisma.questionBank.findMany();
    return rows.map(row => new QuestionBank(row.id, {
      title: row.title,
      description: row.description || undefined,
    }));
  }

  async save(entity: QuestionBank): Promise<void> {
    await prisma.questionBank.upsert({
      where: { id: entity.id },
      update: {
        title: entity.title,
        description: entity.description,
      },
      create: {
        id: entity.id,
        title: entity.title,
        description: entity.description,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.questionBank.delete({ where: { id } });
  }
}

// ==========================================
// 4. Assessment Attempt Repository
// ==========================================

export class AssessmentAttemptRepository implements IAssessmentAttemptRepository {
  async findById(id: string): Promise<AssessmentAttempt | null> {
    const row = await prisma.assessmentAttempt.findUnique({ where: { id } });
    if (!row) return null;
    return new AssessmentAttempt(row.id, {
      assessmentId: row.assessmentId,
      studentId: row.studentId,
      status: row.status as any,
      attemptNum: new AttemptNumber(row.attemptNum),
      startedAt: row.startedAt,
      submittedAt: row.submittedAt || undefined,
      savedAnswers: row.savedAnswers as Record<string, any>,
      version: row.version,
    }, row.version);
  }

  async findByStudentAndAssessment(studentId: string, assessmentId: string, attemptNum: number): Promise<AssessmentAttempt | null> {
    const row = await prisma.assessmentAttempt.findUnique({
      where: {
        studentId_assessmentId_attemptNum: { studentId, assessmentId, attemptNum },
      },
    });
    if (!row) return null;
    return new AssessmentAttempt(row.id, {
      assessmentId: row.assessmentId,
      studentId: row.studentId,
      status: row.status as any,
      attemptNum: new AttemptNumber(row.attemptNum),
      startedAt: row.startedAt,
      submittedAt: row.submittedAt || undefined,
      savedAnswers: row.savedAnswers as Record<string, any>,
      version: row.version,
    }, row.version);
  }

  async findAll(): Promise<AssessmentAttempt[]> {
    const rows = await prisma.assessmentAttempt.findMany();
    return rows.map(row => new AssessmentAttempt(row.id, {
      assessmentId: row.assessmentId,
      studentId: row.studentId,
      status: row.status as any,
      attemptNum: new AttemptNumber(row.attemptNum),
      startedAt: row.startedAt,
      submittedAt: row.submittedAt || undefined,
      savedAnswers: row.savedAnswers as Record<string, any>,
      version: row.version,
    }, row.version));
  }

  async save(entity: AssessmentAttempt): Promise<void> {
    await prisma.assessmentAttempt.upsert({
      where: { id: entity.id },
      update: {
        status: entity.status as any,
        submittedAt: entity.submittedAt,
        savedAnswers: entity.savedAnswers,
        version: { increment: 1 },
      },
      create: {
        id: entity.id,
        assessmentId: entity.assessmentId,
        studentId: entity.studentId,
        status: entity.status as any,
        attemptNum: entity.attemptNum.value,
        startedAt: entity.startedAt,
        submittedAt: entity.submittedAt,
        savedAnswers: entity.savedAnswers,
        version: 1,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.assessmentAttempt.delete({ where: { id } });
  }
}

// ==========================================
// 5. Assessment Result Repository
// ==========================================

export class AssessmentResultRepository implements IAssessmentResultRepository {
  async findById(id: string): Promise<AssessmentResult | null> {
    const row = await prisma.assessmentResult.findUnique({ where: { id } });
    if (!row) return null;
    return new AssessmentResult(row.id, {
      attemptId: row.attemptId,
      score: new Score(row.score),
      percentage: row.percentage,
      grade: row.grade,
      passed: row.passed,
      publishedAt: row.publishedAt || undefined,
    });
  }

  async findByAttemptId(attemptId: string): Promise<AssessmentResult | null> {
    const row = await prisma.assessmentResult.findUnique({ where: { attemptId } });
    if (!row) return null;
    return new AssessmentResult(row.id, {
      attemptId: row.attemptId,
      score: new Score(row.score),
      percentage: row.percentage,
      grade: row.grade,
      passed: row.passed,
      publishedAt: row.publishedAt || undefined,
    });
  }

  async findAll(): Promise<AssessmentResult[]> {
    const rows = await prisma.assessmentResult.findMany();
    return rows.map(row => new AssessmentResult(row.id, {
      attemptId: row.attemptId,
      score: new Score(row.score),
      percentage: row.percentage,
      grade: row.grade,
      passed: row.passed,
      publishedAt: row.publishedAt || undefined,
    }));
  }

  async save(entity: AssessmentResult): Promise<void> {
    await prisma.assessmentResult.upsert({
      where: { id: entity.id },
      update: {
        score: entity.score.value,
        percentage: entity.percentage,
        grade: entity.grade,
        passed: entity.passed,
        publishedAt: entity.publishedAt,
      },
      create: {
        id: entity.id,
        attemptId: entity.attemptId,
        score: entity.score.value,
        percentage: entity.percentage,
        grade: entity.grade,
        passed: entity.passed,
        publishedAt: entity.publishedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.assessmentResult.delete({ where: { id } });
  }
}
