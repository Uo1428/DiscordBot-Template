import permissions from '../utils/permissions.mjs';

export {
  parsePermissions
} 

// parsePermissions
function parsePermissions(perms) {
  const permissionWord = `permission${perms.length > 1 ? "s" : ""}`;
  return perms.map((perm) => `\`${permissions[perm]}\` `).join(", ") + permissionWord;
}