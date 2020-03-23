import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property
} from "mikro-orm";
import { Author, BookTag, Publisher } from "./index";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Book extends BaseEntity {
  @Property({ type: "string" })
  title: string;

  @ManyToOne(() => Author, { inversedBy: a => a.books })
  author: Author;

  @ManyToOne(() => Publisher, { cascade: [Cascade.PERSIST, Cascade.REMOVE] })
  publisher?: Publisher;

  @ManyToMany(() => BookTag)
  tags = new Collection<BookTag>(this);

  @Property({ type: "object" })
  metaObject?: object;

  @Property({ type: "any[]" })
  metaArray?: any[];

  @Property({ type: "string[]" })
  metaArrayOfStrings?: string[];

  constructor(title: string, author: Author) {
    super();
    this.title = title;
    this.author = author;
  }
}
