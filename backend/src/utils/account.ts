import { UserRoles, UserRolesType } from '../blueprint';

export function checkAccountRole(
  provider: string,
  email: string,
  role?: UserRolesType
): typeof UserRoles[number] | null {
  let organization = email.split('@');

  if (provider === 'credentials') {
    if (role && UserRoles.includes(role)) {
      return role;
    }

    return null;
  }

  if (provider === 'google') {
    if (organization[1] === 'smkn3singaraja.sch.id') {
      return 'family';
    }
  }

  return null;
}