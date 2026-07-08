import { describe, expect, it } from 'vitest';

import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  ROLE_PERMISSIONS,
  WORKSPACE_ROLES,
  hasPermission,
  roleIsAtLeast,
} from './rbac.js';

describe('ROLE_PERMISSIONS matrix', () => {
  it('declares grants for every role and every resource', () => {
    for (const role of WORKSPACE_ROLES) {
      for (const resource of PERMISSION_RESOURCES) {
        expect(Array.isArray(ROLE_PERMISSIONS[role][resource])).toBe(true);
      }
    }
  });

  it('grants the owner every action on every resource', () => {
    for (const resource of PERMISSION_RESOURCES) {
      for (const action of PERMISSION_ACTIONS) {
        expect(hasPermission('owner', resource, action)).toBe(true);
      }
    }
  });

  it('never grants the viewer a mutating action', () => {
    for (const resource of PERMISSION_RESOURCES) {
      for (const action of PERMISSION_ACTIONS) {
        if (action !== 'read') {
          expect(hasPermission('viewer', resource, action)).toBe(false);
        }
      }
    }
  });
});

describe('hasPermission', () => {
  it('lets an editor create projects but not delete them', () => {
    expect(hasPermission('editor', 'projects', 'create')).toBe(true);
    expect(hasPermission('editor', 'projects', 'delete')).toBe(false);
  });

  it('lets an editor manage files fully except manage', () => {
    expect(hasPermission('editor', 'files', 'delete')).toBe(true);
    expect(hasPermission('editor', 'files', 'manage')).toBe(false);
  });

  it('denies workspace deletion to admins', () => {
    expect(hasPermission('admin', 'workspace', 'delete')).toBe(false);
    expect(hasPermission('admin', 'workspace', 'update')).toBe(true);
  });

  it('denies billing access below admin', () => {
    expect(hasPermission('admin', 'billing', 'read')).toBe(true);
    expect(hasPermission('editor', 'billing', 'read')).toBe(false);
    expect(hasPermission('viewer', 'billing', 'read')).toBe(false);
  });
});

describe('roleIsAtLeast', () => {
  it('orders roles owner > admin > editor > viewer', () => {
    expect(roleIsAtLeast('owner', 'admin')).toBe(true);
    expect(roleIsAtLeast('admin', 'editor')).toBe(true);
    expect(roleIsAtLeast('editor', 'viewer')).toBe(true);
    expect(roleIsAtLeast('viewer', 'editor')).toBe(false);
    expect(roleIsAtLeast('editor', 'admin')).toBe(false);
  });

  it('treats a role as at least itself', () => {
    expect(roleIsAtLeast('editor', 'editor')).toBe(true);
  });
});
