import { Problem, ProblemFormat, OperationType } from "../types";

/**
 * Generates a random problem format
 */
function getRandomProblemFormat(): ProblemFormat {
    const formats: ProblemFormat[] = [
        "missingEnd",
        "missingMiddle",
        "missingStart",
    ];
    return formats[Math.floor(Math.random() * formats.length)];
}

/**
 * Generates numbers for the problem based on age group and format
 */
function generateNumbers(
    ageGroup: number,
    operation: OperationType,
    format: ProblemFormat
): {
    num1: number;
    num2: number;
    result: number;
    answer: number;
} {
    let num1: number;
    let num2: number;
    let result: number;
    let answer: number;

    if (ageGroup === 8) {
        // For 8-year-olds: larger numbers up to 100
        if (operation === "+") {
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * (100 - num1)) + 1;
            result = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * num1) + 1;
            result = num1 - num2;
        }
    } else {
        // For 5-year-olds: keep simple number ranges
        if (operation === "+") {
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            result = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 8) + 2;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            result = num1 - num2;
        }
    }

    // Determine the answer based on the format
    switch (format) {
        case "missingEnd":
            answer = result;
            break;
        case "missingMiddle":
            answer = num2;
            break;
        case "missingStart":
            answer = num1;
            break;
        default:
            answer = result;
    }

    return { num1, num2, result, answer };
}

export function generateProblem(ageGroup: number = 5): Problem {
    const operation: OperationType = Math.random() < 0.5 ? "+" : "-";
    const format = getRandomProblemFormat();

    // Only allow missingEnd and missingMiddle for subtraction
    if (operation === "-" && format === "missingStart") {
        return generateProblem(ageGroup); // Try again
    }

    const { num1, num2, result, answer } = generateNumbers(
        ageGroup,
        operation,
        format
    );

    return {
        num1,
        num2,
        operation,
        format,
        result,
        answer,
    };
}

export function generateChoices(
    answer: number,
    ageGroup: number = 5
): number[] {
    const choices = new Set<number>([answer]);
    const variation = ageGroup === 8 ? 10 : 2;

    while (choices.size < 3) {
        const wrongAnswer =
            answer +
            (Math.floor(Math.random() * (variation * 2 + 1)) - variation);
        if (wrongAnswer >= 0 && !choices.has(wrongAnswer)) {
            choices.add(wrongAnswer);
        }
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
}
