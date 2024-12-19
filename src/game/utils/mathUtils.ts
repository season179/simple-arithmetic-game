import { Problem } from '../types';

export function generateProblem(): Problem {
  const operations: ('+' | '-')[] = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  const num1 = operation === '+' 
    ? Math.floor(Math.random() * 5) + 1
    : Math.floor(Math.random() * 8) + 2;
    
  const num2 = operation === '+' 
    ? Math.floor(Math.random() * 5) + 1
    : Math.floor(Math.random() * (num1 - 1)) + 1;

  return {
    num1,
    num2,
    operation,
    answer: operation === '+' ? num1 + num2 : num1 - num2
  };
}

export function generateChoices(answer: number): number[] {
  const choices = new Set<number>([answer]);
  
  while (choices.size < 3) {
    const choice = answer + (Math.floor(Math.random() * 5) - 2);
    if (choice >= 0) {
      choices.add(choice);
    }
  }
  
  return Array.from(choices).sort(() => Math.random() - 0.5);
}