export interface IQuestionScoringStrategy {
  scoreAnswer(userResponse: any, correctResponse: any, maxPoints: number): number;
}

export const IQuestionScoringStrategy = Symbol('IQuestionScoringStrategy');

export class MultipleChoiceScoring implements IQuestionScoringStrategy {
  scoreAnswer(userResponse: any, correctResponse: any, maxPoints: number): number {
    return userResponse === correctResponse ? maxPoints : 0;
  }
}

export class MultipleSelectScoring implements IQuestionScoringStrategy {
  scoreAnswer(userResponse: string[], correctResponse: string[], maxPoints: number): number {
    if (!userResponse || !correctResponse) return 0;
    const correctCount = userResponse.filter((val) => correctResponse.includes(val)).length;
    return (correctCount / correctResponse.length) * maxPoints;
  }
}

export class TrueFalseScoring implements IQuestionScoringStrategy {
  scoreAnswer(userResponse: any, correctResponse: any, maxPoints: number): number {
    const userBool = String(userResponse).toLowerCase() === 'true';
    const correctBool = String(correctResponse).toLowerCase() === 'true';
    return userBool === correctBool ? maxPoints : 0;
  }
}

export class OrderingScoring implements IQuestionScoringStrategy {
  scoreAnswer(userResponse: string[], correctResponse: string[], maxPoints: number): number {
    if (!userResponse || !correctResponse || userResponse.length !== correctResponse.length) return 0;
    const matches = userResponse.filter((val, idx) => val === correctResponse[idx]).length;
    return (matches / correctResponse.length) * maxPoints;
  }
}

export class RubricScoring implements IQuestionScoringStrategy {
  scoreAnswer(userResponse: any, criterionScore: number, maxPoints: number): number {
    return Math.min(criterionScore, maxPoints);
  }
}
