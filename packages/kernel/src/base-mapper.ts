export interface BaseMapper<Domain, Entity, DTO = any> {
  toDomain(raw: Entity): Domain;
  toPersistence(domain: Domain): Entity;
  toDTO(domain: Domain): DTO;
}
