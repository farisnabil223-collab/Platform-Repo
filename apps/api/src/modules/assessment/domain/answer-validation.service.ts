import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AnswerValidationService {
  validateAnswer(questionType: string, response: any): void {
    if (response === undefined || response === null) {
      throw new BadRequestException('Response cannot be empty');
    }

    switch (questionType) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE':
      case 'SHORT_ANSWER':
        if (typeof response !== 'string') {
          throw new BadRequestException(`Response must be a string for type ${questionType}`);
        }
        break;
      case 'MULTIPLE_SELECT':
      case 'ORDERING':
      case 'MATCHING':
        if (!Array.isArray(response)) {
          throw new BadRequestException(`Response must be an array for type ${questionType}`);
        }
        break;
      default:
        break;
    }
  }
}
