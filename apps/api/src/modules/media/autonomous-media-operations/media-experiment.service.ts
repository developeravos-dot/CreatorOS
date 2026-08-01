import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaExperiment } from './autonomous-media-operations.types';

@Injectable()
export class MediaExperimentService {
  private readonly experiments = new Map<string, MediaExperiment>();

  create(projectId: string, hypothesis: string, variants: string[], metric: string) {
    if (!hypothesis?.trim()) throw new Error('hypothesis is required');
    if (!Array.isArray(variants) || variants.length < 2) throw new Error('at least two variants are required');
    if (!metric?.trim()) throw new Error('metric is required');

    const experiment: MediaExperiment = {
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId,
      hypothesis: hypothesis.trim(),
      variants: [...new Set(variants.map((value) => value.trim()).filter(Boolean))],
      metric: metric.trim(),
      status: 'planned',
      createdAt: new Date().toISOString(),
    };
    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  start(id: string) {
    const experiment = this.get(id);
    experiment.status = 'running';
    return experiment;
  }

  complete(id: string, winner: string) {
    const experiment = this.get(id);
    if (!experiment.variants.includes(winner)) throw new Error('winner must be one of the experiment variants');
    experiment.status = 'completed';
    experiment.winner = winner;
    return experiment;
  }

  list(projectId?: string) {
    const values = [...this.experiments.values()];
    return projectId ? values.filter((item) => item.projectId === projectId) : values;
  }

  get(id: string) {
    const experiment = this.experiments.get(id);
    if (!experiment) throw new NotFoundException(`Experiment ${id} was not found`);
    return experiment;
  }
}
