import { Migration } from "../migration-framework/migration";
import { Client } from "pg";

export class InitialSchema implements Migration {
  sortKey = 0;

  public async up(database: Client): Promise<any> {
    await database.query(
      `create table "author" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "name" varchar(255) not null, "email" varchar(255) not null, "age" int4 null, "terms_accepted" bool not null, "born" date null, "favourite_book_id" int4 not null);`
    );
    await database.query(
      `create table "book" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "title" varchar(255) not null, "author_id" int4 not null, "publisher_id" int4 null, "meta_object" json not null, "meta_array" json not null, "meta_array_of_strings" json not null);`
    );
    await database.query(
      `create table "book_tag" ("id" serial primary key, "name" varchar(255) not null);`
    );
    await database.query(
      `create table "publisher" ("id" serial primary key, "name" varchar(255) not null, "type" text check ("type" in ('local', 'global')) not null);`
    );
    await database.query(
      `create table "book_to_book_tag" ("book_id" int4 not null, "book_tag_id" int4 not null);`
    );
    await database.query(
      `alter table "book_to_book_tag" add constraint "book_to_book_tag_pkey" primary key ("book_id", "book_tag_id");`
    );
    await database.query(
      `alter table "author" add constraint "author_favourite_book_id_foreign" foreign key ("favourite_book_id") references "book" ("id") on update cascade;`
    );
    await database.query(
      `alter table "book" add constraint "book_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade;`
    );
    await database.query(
      `alter table "book" add constraint "book_publisher_id_foreign" foreign key ("publisher_id") references "publisher" ("id") on update cascade on delete cascade;`
    );
    await database.query(
      `alter table "book_to_book_tag" add constraint "book_to_book_tag_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade on delete cascade;`
    );
    await database.query(
      `alter table "book_to_book_tag" add constraint "book_to_book_tag_book_tag_id_foreign" foreign key ("book_tag_id") references "book_tag" ("id") on update cascade on delete cascade;`
    );
  }
}
