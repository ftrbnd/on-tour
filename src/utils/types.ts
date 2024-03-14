export type Group<T extends string> = `(${T})`;

export type SharedSegment = Group<"index"> | Group<"explore"> | Group<"profile">;
