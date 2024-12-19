import { SequenceProblem, SequenceDirection, ProblemFormat } from "../types";

const UPPERCASE_ALPHABET = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWERCASE_ALPHABET = Array.from("abcdefghijklmnopqrstuvwxyz");

function getRandomSequenceLength(): number {
    // Sequence length between 4 and 6 for young children
    return Math.floor(Math.random() * 3) + 4;
}

function getRandomDirection(): SequenceDirection {
    return Math.random() < 0.5 ? "ascending" : "descending";
}

function generateNumberSequence(): SequenceProblem {
    const direction = getRandomDirection();
    const length = getRandomSequenceLength();

    // For 5-year-olds, keep numbers very simple
    let start: number;
    let step: number;

    if (direction === "ascending") {
        start = Math.floor(Math.random() * 5) + 1; // Start with 1-5
        step = Math.random() < 0.7 ? 1 : 2; // 70% chance of step=1, 30% chance of step=2
    } else {
        start = Math.floor(Math.random() * 5) + 6; // Start with 6-10
        step = Math.random() < 0.7 ? 1 : 2; // 70% chance of step=1, 30% chance of step=2
    }

    const sequence = Array.from({ length }, (_, i) => {
        if (direction === "ascending") {
            return String(start + i * step);
        } else {
            return String(start - i * step);
        }
    });

    const missingIndex = Math.floor(Math.random() * length);
    const answer = sequence[missingIndex];
    sequence[missingIndex] = "?";

    return {
        sequence,
        answer,
        format: "numberSequence",
        direction,
        missingIndex,
    };
}

function generateAlphabetSequence(): SequenceProblem {
    const direction = getRandomDirection();
    const length = getRandomSequenceLength();
    const useUpperCase = Math.random() < 0.5;

    const alphabet = useUpperCase ? UPPERCASE_ALPHABET : LOWERCASE_ALPHABET;
    const startIndex = Math.floor(Math.random() * (alphabet.length - length));

    let sequence: string[];
    if (direction === "ascending") {
        sequence = alphabet.slice(startIndex, startIndex + length);
    } else {
        sequence = alphabet.slice(startIndex, startIndex + length).reverse();
    }

    const missingIndex = Math.floor(Math.random() * length);
    const answer = sequence[missingIndex];
    sequence[missingIndex] = "?";

    return {
        sequence,
        answer,
        format: "alphabetSequence",
        direction,
        missingIndex,
    };
}

export function generateSequenceProblem(): SequenceProblem {
    // Randomly choose between number and alphabet sequence
    return Math.random() < 0.5
        ? generateNumberSequence()
        : generateAlphabetSequence();
}

export function generateSequenceChoices(
    answer: string,
    format: ProblemFormat
): string[] {
    const choices = new Set<string>([answer]);

    while (choices.size < 3) {
        if (format === "numberSequence") {
            // Generate numbers that are 1 or 2 away from the answer
            const num = parseInt(answer);
            const variation = Math.random() < 0.5 ? 1 : 2;
            const direction = Math.random() < 0.5 ? 1 : -1;
            const wrongAnswer = String(num + variation * direction);

            if (!choices.has(wrongAnswer) && parseInt(wrongAnswer) >= 0) {
                choices.add(wrongAnswer);
            }
        } else {
            // Generate nearby letters as wrong answers
            const isUpperCase = answer === answer.toUpperCase();
            const alphabet = isUpperCase
                ? UPPERCASE_ALPHABET
                : LOWERCASE_ALPHABET;
            const currentIndex = alphabet.indexOf(answer);
            const offset = Math.floor(Math.random() * 3) + 1;
            const newIndex =
                (currentIndex +
                    (Math.random() < 0.5 ? offset : -offset) +
                    alphabet.length) %
                alphabet.length;
            const wrongAnswer = alphabet[newIndex];
            if (!choices.has(wrongAnswer)) {
                choices.add(wrongAnswer);
            }
        }
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
}
