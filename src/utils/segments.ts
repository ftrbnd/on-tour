export type Group<T extends string> = `(${T})`;

export type Segment = "home" | "explore" | "profile";

export type SharedSegment = Group<Segment>;

export type NestedSegment = ["(drawer)", "(tabs)", SharedSegment, Segment];
