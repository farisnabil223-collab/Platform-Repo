import { Injectable } from '@nestjs/common';
import { AssessmentRepository, QuestionRepository, prisma } from '@eduverse/database';
import {
  Assessment,
  AssessmentCode,
  AssessmentDuration,
  PassingScore,
  Score,
  AssessmentCreatedEvent,
  DomainEventBus,
  generateUuidV7
} from '@eduverse/kernel';
import { CreateAssessmentDto } from '../../dto/assessment.dto';

// LCG Pseudorandom Seed Generator for deterministic generation
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

@Injectable()
export class CreateAssessmentHandler {
  constructor(
    private readonly assessmentRepository: AssessmentRepository,
    private readonly questionRepository: QuestionRepository
  ) {}

  async execute(dto: CreateAssessmentDto): Promise<Assessment> {
    const seed = dto.randomSeed ?? Math.floor(Math.random() * 1000000);
    const rng = new SeededRandom(seed);

    // 1. Fetch available questions pool
    const pool = await prisma.question.findMany({
      include: {
        choices: true,
        topics: true,
      },
    });

    let selectedQuestions = [...pool];

    // 2. Blueprint topic distribution filters
    if (dto.blueprintTopics && dto.blueprintTopics.length > 0) {
      const filtered: typeof pool = [];
      for (const tConfig of dto.blueprintTopics) {
        const matching = pool.filter(q =>
          q.topics.some(tp => tp.name.toLowerCase() === tConfig.topicName.toLowerCase())
        );
        // Shuffle matching deterministically via LCG
        matching.sort(() => rng.next() - 0.5);
        filtered.push(...matching.slice(0, tConfig.count));
      }
      selectedQuestions = filtered;
    }

    // 3. Blueprint difficulty distribution filters
    if (dto.blueprintDifficulties && dto.blueprintDifficulties.length > 0) {
      const filtered: typeof pool = [];
      for (const dConfig of dto.blueprintDifficulties) {
        const matching = selectedQuestions.filter(q => q.difficulty === dConfig.difficulty);
        matching.sort(() => rng.next() - 0.5);
        const count = Math.round(selectedQuestions.length * dConfig.ratio);
        filtered.push(...matching.slice(0, count));
      }
      if (filtered.length > 0) {
        selectedQuestions = filtered;
      }
    }

    // 4. Random Questions order shuffle
    selectedQuestions.sort(() => rng.next() - 0.5);

    // 5. Create Assessment Aggregate Root
    const id = generateUuidV7();
    const assessment = new Assessment(id, {
      code: new AssessmentCode(dto.code),
      title: dto.title,
      type: dto.type,
      status: 'DRAFT',
      maxScore: new Score(dto.maxScore),
      passingScore: new PassingScore(dto.passingScore),
      durationSeconds: new AssessmentDuration(dto.durationSeconds),
      settings: {
        seed,
        randomizeChoices: true,
        reviewPolicy: 'SHOW_SCORE_ONLY',
      },
      version: 1,
    });

    await this.assessmentRepository.save(assessment);

    // 6. Map questions choices list deterministically using LCG
    for (let i = 0; i < selectedQuestions.length; i++) {
      const q = selectedQuestions[i];
      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: id,
          questionId: q.id,
          sortOrder: i + 1,
          pointsWeight: dto.maxScore / selectedQuestions.length,
        },
      });
    }

    // Publish event
    await DomainEventBus.getInstance().publish(
      new AssessmentCreatedEvent(id, dto.code, dto.title)
    );

    return assessment;
  }
}
