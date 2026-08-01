export class IdeaEntity {
  id!: string;
  projectId!: string;
  channelFamilyId?: string;
  title!: string;
  summary!: string;
  contentType!: string;
  targetAudience!: string;
  sourceMode!: string;
  status!: string;
  score!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
