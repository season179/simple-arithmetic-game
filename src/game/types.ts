export type OperationType = "+" | "-";

export type ProblemFormat =
    | "standard"
    | "missingEnd"
    | "missingMiddle"
    | "missingStart"
    | "numberSequence"
    | "alphabetSequence";

export type SequenceDirection = "ascending" | "descending";

export type Problem = {
    num1: number;
    num2: number;
    operation: OperationType;
    answer: number;
    format: ProblemFormat;
    result: number;
};

export type SequenceProblem = {
    sequence: string[];
    answer: string;
    format: ProblemFormat;
    direction: SequenceDirection;
    missingIndex: number;
    points?: number; // Optional points field for scoring
};
