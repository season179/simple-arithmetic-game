/**
 * Utility functions for generating arithmetic problems and answer choices.
 * These functions ensure problems are appropriate for the target age group
 * and maintain a good balance of challenge and achievability.
 */

import { Problem } from '../types';

/**
 * Generates a random arithmetic problem with addition or subtraction.
 * For addition: uses smaller numbers (1-5) to keep sums manageable.
 * For subtraction: ensures the result is always positive to avoid negative numbers.
 * 
 * @returns {Problem} A problem object containing two numbers, operation, and correct answer
 */
export function generateProblem(): Problem {
  const operations: ('+' | '-')[] = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  // For addition: numbers 1-5 to keep sums simple
  // For subtraction: first number 2-9 to allow meaningful subtraction
  const num1 = operation === '+' 
    ? Math.floor(Math.random() * 5) + 1
    : Math.floor(Math.random() * 8) + 2;
  
  // For subtraction: ensure second number is smaller than first
  // to avoid negative results
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

/**
 * Generates a set of multiple choice answers including the correct answer.
 * Creates plausible wrong answers by adding or subtracting small numbers
 * from the correct answer, ensuring all choices are non-negative.
 * 
 * @param {number} answer - The correct answer to generate choices around
 * @returns {number[]} Array of three unique numbers including the correct answer
 */
export function generateChoices(answer: number): number[] {
  const choices = new Set<number>([answer]);
  
  // Generate two wrong answers within ±2 of the correct answer
  while (choices.size < 3) {
    const choice = answer + (Math.floor(Math.random() * 5) - 2);
    if (choice >= 0) {
      choices.add(choice);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
}