export type Group<T extends string> = `(${T})`;

export type Route = "home" | "explore" | "profile";

export type SharedSegment = Group<Route>;

export type NestedSegment = ["(drawer)", "(tabs)", SharedSegment, Route];
