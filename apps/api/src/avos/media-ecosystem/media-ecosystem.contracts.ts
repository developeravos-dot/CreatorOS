export type MediaProjectStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'archived';

export type MediaChannelStatus =
  | 'planned'
  | 'ready'
  | 'active'
  | 'paused'
  | 'archived';

export type MediaContentStatus =
  | 'draft'
  | 'researching'
  | 'idea_proposed'
  | 'awaiting_approval'
  | 'approved'
  | 'scripting'
  | 'pre_production'
  | 'producing'
  | 'quality_review'
  | 'ready_to_publish'
  | 'scheduled'
  | 'published'
  | 'analyzing'
  | 'archived';

export type MediaApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export type MediaPlatform =
  | 'youtube'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'other';

export interface MediaProject {
  id: string;
  name: string;
  description?: string;
  primaryLanguage: string;
  targetMarkets: string[];
  status: MediaProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MediaChannel {
  id: string;
  projectId: string;
  familyId: string;
  parentChannelId?: string;
  name: string;
  platform: MediaPlatform;
  language: string;
  market?: string;
  niche: string;
  audience: string;
  status: MediaChannelStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MediaChannelFamily {
  id: string;
  projectId: string;
  name: string;
  rootChannelId: string;
  channelIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaContentIdea {
  id: string;
  projectId: string;
  channelFamilyId?: string;
  title: string;
  summary: string;
  contentType: string;
  targetAudience: string;
  sourceMode:
    | 'original'
    | 'research-inspired'
    | 'public-domain';
  status: MediaContentStatus;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaHumanApproval {
  id: string;
  entityType:
    | 'project'
    | 'channel'
    | 'idea'
    | 'script'
    | 'episode'
    | 'campaign';
  entityId: string;
  action: string;
  requestedBy: string;
  status: MediaApprovalStatus;
  notes?: string;
  decidedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaDomainEvent {
  id: string;
  type: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}