import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
  ManyToOne,
  DateType
} from "mikro-orm";

import { Book } from ".";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Author extends BaseEntity {
  @Property({ type: "string" })
  name: string;

  @Property({ type: "string" })
  email: string;

  @Property({ type: "number", nullable: true })
  age?: number;

  @Property({ type: "boolean" })
  termsAccepted = false;

  @Property({ type: DateType, nullable: true })
  born?: Date;

  @OneToMany(
    () => Book,
    b => b.author,
    { cascade: [Cascade.ALL] }
  )
  books = new Collection<Book>(this);

  @ManyToOne(() => Book)
  favouriteBook?: Book;

  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }
}
