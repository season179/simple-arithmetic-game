/**
 * Utility functions for generating arithmetic problems and answer choices.
 * These functions ensure problems are appropriate for the target age group
 * and maintain a good balance of challenge and achievability.
 */

import { Problem } from '../types';

/**
 * Generates a random arithmetic problem with addition or subtraction.
 * For addition: uses smaller numbers (1-5) to keep sums manageable for 5-year-olds.
 * For subtraction: ensures the result is always positive to avoid negative numbers.
 * For 8-year-olds: larger numbers up to 100.
 * 
 * @param {number} ageGroup - The age group to determine the number ranges (default: 5)
 * @returns {Problem} A problem object containing two numbers, operation, and correct answer
 */
export function generateProblem(ageGroup: number = 5): Problem {
  const operations: ('+' | '-')[] = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number;
  let num2: number;

  if (ageGroup === 8) {
    // For 8-year-olds: larger numbers up to 100
    if (operation === '+') {
      // For addition: numbers up to 50 to keep sums under 100
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * (100 - num1)) + 1;
    } else {
      // For subtraction: first number up to 100, second number smaller
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
    }
  } else {
    // For 5-year-olds: keep original simple number ranges
    num1 = operation === '+' 
      ? Math.floor(Math.random() * 5) + 1
      : Math.floor(Math.random() * 8) + 2;
    
    num2 = operation === '+' 
      ? Math.floor(Math.random() * 5) + 1
      : Math.floor(Math.random() * (num1 - 1)) + 1;
  }

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
 * @param {number} ageGroup - The age group to determine the range of wrong answers (default: 5)
 * @returns {number[]} Array of three unique numbers including the correct answer
 */
export function generateChoices(answer: number, ageGroup: number = 5): number[] {
  const choices = new Set<number>([answer]);
  
  // Determine the range for wrong answers based on age group
  const variation = ageGroup === 8 ? 10 : 2;
  
  while (choices.size < 3) {
    // Generate wrong answers within ±variation of the correct answer
    const wrongAnswer = answer + (Math.floor(Math.random() * (variation * 2 + 1)) - variation);
    
    // Ensure wrong answers are non-negative and different from existing choices
    if (wrongAnswer >= 0 && !choices.has(wrongAnswer)) {
      choices.add(wrongAnswer);
    }
  }
  
  // Convert to array and shuffle
  return Array.from(choices).sort(() => Math.random() - 0.5);
}