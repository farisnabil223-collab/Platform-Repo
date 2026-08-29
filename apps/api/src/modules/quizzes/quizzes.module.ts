import { Module } from '@nestjs/common';
import { QuizzesController } from './presentation/quizzes.controller';
import { CreateQuizHandler } from './application/commands/create-quiz.handler';
import { SubmitQuizAttemptHandler } from './application/commands/submit-quiz-attempt.handler';
import { QuizRepository } from '@eduverse/database';

@Module({
  controllers: [QuizzesController],
  providers: [
    CreateQuizHandler,
    SubmitQuizAttemptHandler,
    {
      provide: QuizRepository,
      useFactory: () => new QuizRepository(),
    },
  ],
  exports: [
    CreateQuizHandler,
    SubmitQuizAttemptHandler,
  ],
})
export class QuizzesModule {}
