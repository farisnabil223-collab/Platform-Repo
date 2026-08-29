export abstract class BaseEntity<T> {
  protected readonly _id: string;
  protected props: T;
  public readonly version: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;
  public readonly createdBy: string | null;
  public readonly updatedBy: string | null;

  constructor(
    id: string,
    props: T,
    version = 1,
    createdAt = new Date(),
    updatedAt = new Date(),
    deletedAt: Date | null = null,
    createdBy: string | null = null,
    updatedBy: string | null = null
  ) {
    this._id = id;
    this.props = props;
    this.version = version;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }

  get id(): string {
    return this._id;
  }

  public equals(object?: BaseEntity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof BaseEntity)) {
      return false;
    }

    return this._id === object._id;
  }
}
