import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  memberAc,
  adminAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  administration: ["create", "read", "update", "delete"],
  finance: ["create", "read", "update", "delete"],
  people: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

const member = ac.newRole({
  ...memberAc.statements,
  finance: ["read"],
  people: ["read"],
});

const admin = ac.newRole({
  ...adminAc.statements,
  administration: ["read"],
  finance: ["create", "read", "update"],
  people: ["create", "read", "update"],
});

const owner = ac.newRole({
  ...ownerAc.statements,
  administration: ["create", "read", "update", "delete"],
  finance: ["create", "read", "update", "delete"],
  people: ["create", "read", "update", "delete"],
});

const secretary = ac.newRole({
  ...memberAc.statements,
  administration: ["read"],
  people: ["read"],
});

const treasurer = ac.newRole({
  ...memberAc.statements,
  administration: ["read"],
  finance: ["create", "read", "update", "delete"],
  people: ["read"],
});

export const roles = {
  member,
  admin,
  owner,
  secretary,
  treasurer,
};
