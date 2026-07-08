export const WORKSPACE_ROLES = ['owner', 'admin', 'editor', 'viewer'] as const;

export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const PERMISSION_RESOURCES = [
  'workspace',
  'members',
  'projects',
  'files',
  'agent-runs',
  'deployments',
  'templates',
  'billing',
  'settings',
] as const;

export type PermissionResource = (typeof PERMISSION_RESOURCES)[number];

export const PERMISSION_ACTIONS = ['read', 'create', 'update', 'delete', 'manage'] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

type PermissionGrants = Readonly<Record<PermissionResource, readonly PermissionAction[]>>;

const ALL_ACTIONS: readonly PermissionAction[] = PERMISSION_ACTIONS;
const READ_ONLY: readonly PermissionAction[] = ['read'];
const NO_ACCESS: readonly PermissionAction[] = [];

/**
 * Workspace RBAC matrix — the single source of truth for authorization.
 * The backend enforces it in guards; the frontend may only use it to hide UI.
 * The matrix is exhaustive and literal on purpose: no implication rules,
 * what is granted is exactly what is listed.
 */
export const ROLE_PERMISSIONS: Record<WorkspaceRole, PermissionGrants> = {
  owner: {
    workspace: ALL_ACTIONS,
    members: ALL_ACTIONS,
    projects: ALL_ACTIONS,
    files: ALL_ACTIONS,
    'agent-runs': ALL_ACTIONS,
    deployments: ALL_ACTIONS,
    templates: ALL_ACTIONS,
    billing: ALL_ACTIONS,
    settings: ALL_ACTIONS,
  },
  admin: {
    workspace: ['read', 'update'],
    members: ['read', 'create', 'update', 'delete'],
    projects: ALL_ACTIONS,
    files: ALL_ACTIONS,
    'agent-runs': ALL_ACTIONS,
    deployments: ALL_ACTIONS,
    templates: ALL_ACTIONS,
    billing: READ_ONLY,
    settings: ['read', 'update'],
  },
  editor: {
    workspace: READ_ONLY,
    members: READ_ONLY,
    projects: ['read', 'create', 'update'],
    files: ['read', 'create', 'update', 'delete'],
    'agent-runs': ['read', 'create'],
    deployments: ['read', 'create'],
    templates: READ_ONLY,
    billing: NO_ACCESS,
    settings: READ_ONLY,
  },
  viewer: {
    workspace: READ_ONLY,
    members: READ_ONLY,
    projects: READ_ONLY,
    files: READ_ONLY,
    'agent-runs': READ_ONLY,
    deployments: READ_ONLY,
    templates: READ_ONLY,
    billing: NO_ACCESS,
    settings: READ_ONLY,
  },
};

export function hasPermission(
  role: WorkspaceRole,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  return ROLE_PERMISSIONS[role][resource].includes(action);
}

const ROLE_PRIORITY: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function roleIsAtLeast(role: WorkspaceRole, minimum: WorkspaceRole): boolean {
  return ROLE_PRIORITY[role] >= ROLE_PRIORITY[minimum];
}
