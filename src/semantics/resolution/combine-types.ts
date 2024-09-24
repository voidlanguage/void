import {
  IntersectionType,
  ObjectType,
  Type,
  UnionType,
} from "../../syntax-objects/types.js";

/**
 * Combines types into their least common denominator.
 * If all types are the same, it returns that type.
 * If all types are different (but still object types), it returns a UnionType.
 * If types are mixed and not all object types, it returns undefined.
 */
export const combineTypes = (types: Type[]): Type | undefined => {
  const firstType = types[0];
  if (!types.length || !firstType?.isObjectType()) {
    return firstType;
  }

  let topType: ObjectType | IntersectionType | UnionType = firstType;
  for (const type of types.slice(1)) {
    if (type.id === topType.id) {
      continue;
    }

    if (isObjectOrIntersection(type) && isObjectOrIntersection(topType)) {
      const union = new UnionType({
        name: `CombinedTypeUnion`,
      });
      union.types = [topType, type];
      topType = union;
      continue;
    }

    if (isObjectOrIntersection(type) && topType.isUnionType()) {
      topType.types.push(type);
      continue;
    }

    return undefined;
  }

  return topType;
};

const isObjectOrIntersection = (
  type: Type
): type is ObjectType | IntersectionType => {
  return type.isObjectType() || type.isIntersectionType();
};