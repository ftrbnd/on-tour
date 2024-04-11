export type Group<T extends string> = `(${T})`;

export type SharedSegment = Group<"home"> | Group<"explore"> | Group<"profile">;
