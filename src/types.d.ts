import { TextDocument } from "vscode";

export type TestType = "Focused" | "File"; 
export type Resolver = (document: TextDocument, number: number, testType: TestType) => string | null;