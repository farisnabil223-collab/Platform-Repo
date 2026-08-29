import { Injectable } from '@nestjs/common';
import { QuizRepository, prisma } from '@eduverse/database';
import { Quiz, generateUuidV7 } from '@eduverse/kernel';
import { CreateQuizDto } from '../../dto/quiz.dto';

@Injectable()
export class CreateQuizHandler {
  constructor(private readonly quizRepository: QuizRepository) {}

  async execute(dto: CreateQuizDto): Promise<Quiz> {
    const quiz = new Quiz(generateUuidV7(), {
      title: dto.title,
      passingScore: dto.passingScore,
      timeLimitSeconds: dto.timeLimitSeconds,
      isActive: true,
    });

    await this.quizRepository.save(quiz);

    // Register questions and choices
    for (let i = 0; i < dto.questions.length; i++) {
      const qDto = dto.questions[i];
      const questionId = generateUuidV7();

      await prisma.question.create({
        data: {
          id: questionId,
          code: `QST_QUIZ_${questionId.substring(0, 8).toUpperCase()}`,
          text: qDto.text,
          type: qDto.type as any,
          difficulty: 'MEDIUM',
          choices: {
            create: qDto.choices.map(c => ({
              id: generateUuidV7(),
              text: c.text,
              isCorrect: c.isCorrect,
            })),
          },
        },
      });

      // Map to Quiz (which is mapped to prisma.assessmentQuestion)
      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: quiz.id,
          questionId,
          sortOrder: i + 1,
          pointsWeight: 10.0,
        },
      });
    }

    return quiz;
  }
}
