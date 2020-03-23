export * from "./Author";
export * from "./Book";
export * from "./BookTag";
export * from "./Publisher";

// Allow consuming modules to not have to hard code the
// entity list
import { Author } from "./Author";
import { Book } from "./Book";
import { BookTag } from "./BookTag";
import { Publisher } from "./Publisher";
import { BaseEntity } from "./BaseEntity";
export const Entities = [Author, Book, BookTag, Publisher, BaseEntity];
