import {
  AuthProvider,
  ObjectiveStatus,
  ProjectStatus,
  Role,
  NotificationType,
  ReactionEmoji,
} from './enums';

// ─── User ───

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  authProvider: AuthProvider;
  isOnboarded: boolean;
}

export interface OnboardingInput {
  displayName: string;
  roles: Role[];
  departmentIds?: string[];
}

// ─── Project ───

export interface ProjectSummary {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  memberCount: number;
  overallProgress: number;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  customDepartments?: { name: string; icon?: string; color?: string }[];
}

// ─── Department ───

export interface DepartmentSummary {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isCustom: boolean;
  order: number;
  progress: { total: number; completed: number; percentage: number };
}

// ─── Objective ───

export interface ObjectiveSummary {
  id: string;
  title: string;
  status: ObjectiveStatus;
  deadline: string | null;
  primaryDeptId: string;
  departmentNames: string[];
  collaborators: CollaboratorInfo[];
  createdAt: string;
}

export interface ObjectiveDetail extends ObjectiveSummary {
  description: string | null;
  phase: string | null;
  sceneOrLocation: string | null;
  whatIsNormallyDone: string | null;
  directorsVision: string | null;
  decisions: DecisionInfo[];
  links: LinkInfo[];
}

export interface CreateObjectiveInput {
  title: string;
  description?: string;
  deadline?: string;
  phase?: string;
  sceneOrLocation?: string;
  templateId?: string;
  sharedDepartmentIds?: string[];
}

export interface CollaboratorInfo {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  isActive: boolean;
}

// ─── Decision ───

export interface DecisionInfo {
  id: string;
  content: string;
  createdBy: { displayName: string; avatarUrl: string | null };
  createdAt: string;
}

// ─── Link ───

export interface LinkInfo {
  id: string;
  url: string;
  description: string | null;
  authorName: string;
  updatedAt: string;
}

export interface CreateLinkInput {
  url: string;
  description?: string;
  authorName: string;
}

// ─── Comment ───

export interface CommentInfo {
  id: string;
  content: string;
  parentId: string | null;
  createdBy: { id: string; displayName: string; avatarUrl: string | null };
  reactions: { emoji: ReactionEmoji; count: number; reacted: boolean }[];
  replies: CommentInfo[];
  createdAt: string;
}

// ─── Notification ───

export interface NotificationInfo {
  id: string;
  type: NotificationType;
  referenceId: string;
  referenceType: string;
  read: boolean;
  createdAt: string;
}

// ─── Supervision ───

export interface SupervisionDashboard {
  departments: DepartmentSummary[];
  overallProgress: number;
}
