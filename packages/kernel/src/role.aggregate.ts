import { AggregateRoot } from './aggregate-root';
import { DomainRuleViolationException } from './domain-exceptions';

export interface RoleProps {
  name: string;
  description?: string | null;
  permissionIds: string[];
}

export class Role extends AggregateRoot<RoleProps> {
  private _name: string;
  private _description: string | null;
  private _permissionIds: string[];

  constructor(
    id: string,
    props: RoleProps,
    version = 1,
    createdAt = new Date(),
    updatedAt = new Date(),
    deletedAt: Date | null = null,
    createdBy: string | null = null,
    updatedBy: string | null = null
  ) {
    super(id, props, version, createdAt, updatedAt, deletedAt, createdBy, updatedBy);
    if (!props.name) {
      throw new DomainRuleViolationException('Role name cannot be empty');
    }
    this._name = props.name.toUpperCase();
    this._description = props.description || null;
    this._permissionIds = props.permissionIds || [];
  }

  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get permissionIds(): string[] { return this._permissionIds; }

  public addPermission(permissionId: string): void {
    if (this._permissionIds.includes(permissionId)) {
      return;
    }
    this._permissionIds.push(permissionId);
  }

  public removePermission(permissionId: string): void {
    this._permissionIds = this._permissionIds.filter((id) => id !== permissionId);
  }
}
