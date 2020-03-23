import { PrimaryKey, Property, IdEntity, DateType } from "mikro-orm";

export abstract class BaseEntity implements IdEntity<BaseEntity> {
  @PrimaryKey({ type: "number" })
  id!: number;

  @Property({ type: DateType })
  createdAt = new Date();

  @Property({ type: DateType, onUpdate: () => new Date() })
  updatedAt = new Date();
}
