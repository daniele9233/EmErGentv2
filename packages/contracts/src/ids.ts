import { type Brand } from './brand.js';

/**
 * Branded identifiers for every aggregate defined in the FASE 0 domain model.
 * All ids are UUID strings at runtime; the brand exists only at type level.
 */
export type UserId = Brand<string, 'UserId'>;
export type WorkspaceId = Brand<string, 'WorkspaceId'>;
export type MembershipId = Brand<string, 'MembershipId'>;
export type ProjectId = Brand<string, 'ProjectId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type ChatMessageId = Brand<string, 'ChatMessageId'>;
export type AgentRunId = Brand<string, 'AgentRunId'>;
export type AgentStepId = Brand<string, 'AgentStepId'>;
export type FileNodeId = Brand<string, 'FileNodeId'>;
export type FileVersionId = Brand<string, 'FileVersionId'>;
export type SnapshotId = Brand<string, 'SnapshotId'>;
export type BuildId = Brand<string, 'BuildId'>;
export type DeploymentId = Brand<string, 'DeploymentId'>;
export type TemplateId = Brand<string, 'TemplateId'>;
export type ApiKeyId = Brand<string, 'ApiKeyId'>;
