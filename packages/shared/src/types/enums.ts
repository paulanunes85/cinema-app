// ─── Authentication ───

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
}

// ─── Project ───

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

// ─── Roles ───

export enum Role {
  DIRECTOR = 'DIRECTOR',
  AD = 'AD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  TEAM_MEMBER = 'TEAM_MEMBER',
}

/** Roles that grant access to Supervision Mode */
export const SUPERVISOR_ROLES: Role[] = [Role.DIRECTOR, Role.AD];

// ─── Objective Status ───

export enum ObjectiveStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// ─── Notifications ───

export enum NotificationType {
  MENTION = 'MENTION',
  STATUS_CHANGE = 'STATUS_CHANGE',
  COMMENT = 'COMMENT',
  INVITATION = 'INVITATION',
}

// ─── Comment Reactions ───

export const ALLOWED_REACTIONS = ['✅', '👀', '👍'] as const;
export type ReactionEmoji = (typeof ALLOWED_REACTIONS)[number];
