import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type {
  NormalizedPatentDocument,
} from '../../v3-2/models/novelty-v3-2.models';

import type {
  ExtractedClaimElement,
  MechanismSignature,
  PatentKnowledgeEdge,
  PatentKnowledgeGraph,
  PatentKnowledgeNode,
} from '../models/novelty-v3-3.models';

@Injectable()
export class PriorArtKnowledgeGraphEngine {
  build(
    title: string,
    claimElements: ExtractedClaimElement[],
    mechanisms: MechanismSignature[],
    documents: NormalizedPatentDocument[],
  ): PatentKnowledgeGraph {
    const nodes: PatentKnowledgeNode[] = [];
    const edges: PatentKnowledgeEdge[] = [];

    const ideaId = `idea:${this.slug(title)}`;

    nodes.push({
      id: ideaId,
      type: 'idea',
      label: title,
      description: title,
      metadata: {},
    });

    const claimIds = new Map<number, string>();

    for (const element of claimElements) {
      let claimId =
        claimIds.get(element.claimNumber);

      if (!claimId) {
        claimId = `claim:${element.claimNumber}`;
        claimIds.set(
          element.claimNumber,
          claimId,
        );

        nodes.push({
          id: claimId,
          type: 'claim',
          label:
            `Claim ${element.claimNumber}`,
          description:
            `Patent claim ${element.claimNumber}`,
          metadata: {
            claimNumber:
              element.claimNumber,
            claimType:
              element.claimType,
          },
        });

        edges.push(
          this.edge(
            ideaId,
            claimId,
            'contains',
            100,
            'الفكرة تحتوي على المطالبة.',
          ),
        );
      }

      nodes.push({
        id: element.id,
        type: 'claim-element',
        label: element.text,
        description: element.text,
        metadata: {
          category: element.category,
          essential: element.essential,
          claimNumber:
            element.claimNumber,
        },
      });

      edges.push(
        this.edge(
          claimId,
          element.id,
          'contains',
          element.essential ? 100 : 70,
          'المطالبة تحتوي على هذا العنصر.',
        ),
      );
    }

    for (const mechanism of mechanisms) {
      const mechanismNodeId =
        `mechanism:${this.slug(
          mechanism.mechanismId,
        )}`;

      nodes.push({
        id: mechanismNodeId,
        type: 'mechanism',
        label: mechanism.name,
        description: mechanism.problem,
        metadata: {
          inputs: mechanism.inputs,
          operations:
            mechanism.operations,
          outputs: mechanism.outputs,
        },
      });

      edges.push(
        this.edge(
          ideaId,
          mechanismNodeId,
          'implements',
          100,
          'الفكرة تنفذ هذه الآلية.',
        ),
      );

      for (
        let index = 0;
        index <
        mechanism.technicalEffects.length;
        index += 1
      ) {
        const effect =
          mechanism.technicalEffects[index];

        if (!effect) {
          continue;
        }

        const effectId =
          `effect:${this.slug(
            `${mechanism.mechanismId}-${index}`,
          )}`;

        nodes.push({
          id: effectId,
          type: 'technical-effect',
          label: effect,
          description: effect,
          metadata: {},
        });

        edges.push(
          this.edge(
            mechanismNodeId,
            effectId,
            'produces',
            90,
            'الآلية تنتج أثرًا تقنيًا.',
          ),
        );
      }

      for (const element of claimElements) {
        if (
          this.overlaps(
            [
              mechanism.name,
              mechanism.problem,
              ...mechanism.inputs,
              ...mechanism.operations,
              ...mechanism.outputs,
            ].join(' '),
            element.text,
          )
        ) {
          edges.push(
            this.edge(
              element.id,
              mechanismNodeId,
              'implements',
              75,
              'عنصر المطالبة مرتبط بالآلية.',
            ),
          );
        }
      }
    }

    for (const document of documents) {
      const documentNodeId =
        `patent:${document.documentId}`;

      nodes.push({
        id: documentNodeId,
        type: 'patent-document',
        label: document.title,
        description: document.abstract,
        sourceId: document.documentId,
        metadata: {
          providerId:
            document.providerId,
          verified:
            document.verificationStatus ===
            'verified',
          synthetic:
            document.synthetic,
          publicationNumber:
            document.publicationNumber ??
            '',
        },
      });

      for (const classification of
        document.classifications) {
        const classificationId =
          `classification:${this.slug(
            classification,
          )}`;

        if (
          !nodes.some(
            (node) =>
              node.id ===
              classificationId,
          )
        ) {
          nodes.push({
            id: classificationId,
            type: 'classification',
            label: classification,
            description: classification,
            metadata: {},
          });
        }

        edges.push(
          this.edge(
            documentNodeId,
            classificationId,
            'belongs-to',
            100,
            'الوثيقة تنتمي إلى هذا التصنيف.',
          ),
        );
      }

      const documentText = [
        document.title,
        document.abstract,
        ...document.claims,
      ].join(' ');

      for (const mechanism of mechanisms) {
        const similarity =
          this.similarity(
            mechanism.signatureTokens,
            this.tokens(documentText),
          );

        if (similarity < 0.08) {
          continue;
        }

        const mechanismNodeId =
          `mechanism:${this.slug(
            mechanism.mechanismId,
          )}`;

        edges.push(
          this.edge(
            documentNodeId,
            mechanismNodeId,
            'overlaps',
            Math.round(
              similarity * 100,
            ),
            'توجد علاقة دلالية بين الوثيقة والآلية.',
          ),
        );
      }
    }

    const uniqueNodes =
      this.uniqueNodes(nodes);

    const uniqueEdges =
      this.uniqueEdges(edges);

    return {
      nodes: uniqueNodes,
      edges: uniqueEdges,
      metrics: {
        nodeCount: uniqueNodes.length,
        edgeCount: uniqueEdges.length,

        claimNodes:
          uniqueNodes.filter(
            (node) =>
              node.type === 'claim' ||
              node.type ===
                'claim-element',
          ).length,

        mechanismNodes:
          uniqueNodes.filter(
            (node) =>
              node.type === 'mechanism',
          ).length,

        patentNodes:
          uniqueNodes.filter(
            (node) =>
              node.type ===
              'patent-document',
          ).length,

        connectedComponents:
          this.connectedComponents(
            uniqueNodes,
            uniqueEdges,
          ),

        graphDensity:
          this.density(
            uniqueNodes.length,
            uniqueEdges.length,
          ),
      },
    };
  }

  private edge(
    from: string,
    to: string,
    type: PatentKnowledgeEdge['type'],
    weight: number,
    explanation: string,
  ): PatentKnowledgeEdge {
    return {
      id: randomUUID(),
      from,
      to,
      type,
      weight: Math.max(
        0,
        Math.min(100, weight),
      ),
      explanation,
    };
  }

  private uniqueNodes(
    nodes: PatentKnowledgeNode[],
  ): PatentKnowledgeNode[] {
    const map =
      new Map<
        string,
        PatentKnowledgeNode
      >();

    for (const node of nodes) {
      map.set(node.id, node);
    }

    return [...map.values()];
  }

  private uniqueEdges(
    edges: PatentKnowledgeEdge[],
  ): PatentKnowledgeEdge[] {
    const seen = new Set<string>();
    const output: PatentKnowledgeEdge[] = [];

    for (const edge of edges) {
      const key =
        `${edge.from}:${edge.to}:` +
        `${edge.type}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      output.push(edge);
    }

    return output;
  }

  private connectedComponents(
    nodes: PatentKnowledgeNode[],
    edges: PatentKnowledgeEdge[],
  ): number {
    const adjacency =
      new Map<string, Set<string>>();

    for (const node of nodes) {
      adjacency.set(node.id, new Set());
    }

    for (const edge of edges) {
      adjacency.get(edge.from)?.add(edge.to);
      adjacency.get(edge.to)?.add(edge.from);
    }

    const visited = new Set<string>();
    let components = 0;

    for (const node of nodes) {
      if (visited.has(node.id)) {
        continue;
      }

      components += 1;

      const stack = [node.id];

      while (stack.length > 0) {
        const current = stack.pop();

        if (
          !current ||
          visited.has(current)
        ) {
          continue;
        }

        visited.add(current);

        for (
          const neighbor of
          adjacency.get(current) ??
          []
        ) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }

    return components;
  }

  private density(
    nodeCount: number,
    edgeCount: number,
  ): number {
    if (nodeCount <= 1) {
      return 0;
    }

    const maximum =
      nodeCount * (nodeCount - 1);

    return Math.round(
      (edgeCount / maximum) *
      10000,
    ) / 100;
  }

  private overlaps(
    left: string,
    right: string,
  ): boolean {
    return (
      this.similarity(
        this.tokens(left),
        this.tokens(right),
      ) >= 0.12
    );
  }

  private similarity(
    left: string[],
    right: string[],
  ): number {
    const leftSet = new Set(left);
    const rightSet = new Set(right);

    const union = new Set([
      ...leftSet,
      ...rightSet,
    ]);

    if (union.size === 0) {
      return 0;
    }

    let intersection = 0;

    for (const token of leftSet) {
      if (rightSet.has(token)) {
        intersection += 1;
      }
    }

    return intersection / union.size;
  }

  private tokens(value: string): string[] {
    return [
      ...new Set(
        value
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s]/gu, ' ')
          .split(/\s+/)
          .map((token) => token.trim())
          .filter((token) => token.length >= 3),
      ),
    ];
  }

  private slug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 100);
  }
}
