import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
  IdEntity
} from "mikro-orm";
import { Book } from ".";

@Entity()
export class Publisher implements IdEntity<Publisher> {
  @PrimaryKey({ type: "number" })
  id!: number;

  @Property({ type: "string" })
  name: string;

  @Enum(() => PublisherType)
  type: PublisherType;

  @OneToMany(
    () => Book,
    b => b.publisher
  )
  books = new Collection<Book>(this);

  constructor(name: string, type = PublisherType.LOCAL) {
    this.name = name;
    this.type = type;
  }
}

export enum PublisherType {
  LOCAL = "local",
  GLOBAL = "global"
}
