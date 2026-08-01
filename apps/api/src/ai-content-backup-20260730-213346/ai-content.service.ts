import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  GenerateIdeasDto,
  GenerateScriptDto,
  OptimizeContentDto,
  ProductionPackageDto,
  ReviewContentDto,
} from './ai-content.dto';
import {
  AiContentIdea,
  AiContentOptimization,
  AiContentReview,
  AiContentScript,
  AiContentTone,
} from './ai-content.types';

@Injectable()
export class AiContentService {
  status() {
    return {
      success: true,
      module: 'CreatorOS AI Content Engine',
      status: 'operational',
      version: 'MP2-1.0.0',
      capabilities: [
        'idea-generation',
        'script-generation',
        'platform-optimization',
        'quality-review',
        'production-package',
      ],
    };
  }

  generateIdeas(input: GenerateIdeasDto) {
    const count = input.count ?? 5;
    const tone = input.tone ?? 'professional';

    const angles = [
      'Ù…Ø¹Ù„ÙˆÙ…Ø© ØºÙŠØ± Ù…ØªÙˆÙ‚Ø¹Ø© ØªØºÙŠÙ‘Ø± ÙÙ‡Ù… Ø§Ù„Ø¬Ù…Ù‡ÙˆØ± Ù„Ù„Ù…ÙˆØ¶ÙˆØ¹',
      'Ø®Ø·Ø£ Ø´Ø§Ø¦Ø¹ ÙŠÙ‚Ø¹ ÙÙŠÙ‡ Ù…Ø¹Ø¸Ù… Ø§Ù„Ù†Ø§Ø³',
      'Ù…Ù‚Ø§Ø±Ù†Ø© Ø¹Ù…Ù„ÙŠØ© Ø¨ÙŠÙ† Ø§Ù„Ø£Ø³Ù„ÙˆØ¨ Ø§Ù„ØªÙ‚Ù„ÙŠØ¯ÙŠ ÙˆØ§Ù„Ø£Ø³Ù„ÙˆØ¨ Ø§Ù„Ø°ÙƒÙŠ',
      'Ù‚ØµØ© ØªØ¨Ø¯Ø£ Ø¨Ù…Ø´ÙƒÙ„Ø© ÙˆØªÙ†ØªÙ‡ÙŠ Ø¨Ù†ØªÙŠØ¬Ø© ÙˆØ§Ø¶Ø­Ø©',
      'ØªØ¬Ø±Ø¨Ø© Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„ØªØ·Ø¨ÙŠÙ‚ Ø®Ù„Ø§Ù„ ÙŠÙˆÙ… ÙˆØ§Ø­Ø¯',
      'ØªØ­Ù„ÙŠÙ„ Ù…Ø§ ÙˆØ±Ø§Ø¡ Ø§Ù„ÙƒÙˆØ§Ù„ÙŠØ³',
      'Ø³ÙŠÙ†Ø§Ø±ÙŠÙˆ Ù…Ø§Ø°Ø§ Ù„Ùˆ',
      'Ù‚Ø§Ø¦Ù…Ø© Ù‚Ø±Ø§Ø±Ø§Øª Ø°ÙƒÙŠØ© ÙˆØ³Ø±ÙŠØ¹Ø©',
      'ØªØ­Ø¯Ù ØªÙ†Ø§ÙØ³ÙŠ Ù‚Ø§Ø¨Ù„ Ù„Ù„Ù‚ÙŠØ§Ø³',
      'ØªÙˆÙ‚Ø¹ Ù…Ø³ØªÙ‚Ø¨Ù„ÙŠ Ù…Ø¨Ù†ÙŠ Ø¹Ù„Ù‰ Ø¥Ø´Ø§Ø±Ø§Øª Ø­Ø§Ù„ÙŠØ©',
      'ØªÙÙƒÙŠÙƒ Ø®Ø±Ø§ÙØ© Ù…Ù†ØªØ´Ø±Ø©',
      'Ø¯Ù„ÙŠÙ„ ØªÙ†ÙÙŠØ°ÙŠ Ù…Ù† Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© Ø¥Ù„Ù‰ Ø§Ù„Ù†ØªÙŠØ¬Ø©',
    ];

    const ideas: AiContentIdea[] = Array.from(
      { length: count },
      (_, index) => {
        const angle = angles[index % angles.length] ?? angles[0] ?? "زاوية محتوى ذكية";

        return {
          id: randomUUID(),
          title: this.buildIdeaTitle(input.topic, index, tone),
          hook: this.buildHook(input.topic, input.audience, index),
          angle,
          targetAudience: input.audience,
          platform: input.platform,
          score: Math.max(72, 96 - index * 3),
          createdAt: new Date().toISOString(),
        };
      },
    );

    return {
      success: true,
      ideas,
    };
  }

  generateScript(input: GenerateScriptDto) {
    return {
      success: true,
      script: this.buildScript(input),
    };
  }

  optimize(input: OptimizeContentDto) {
    return {
      success: true,
      optimization: this.buildOptimization(input),
    };
  }

  review(input: ReviewContentDto) {
    return {
      success: true,
      review: this.buildReview(input),
    };
  }

  createProductionPackage(input: ProductionPackageDto) {
    const idea = this.generateIdeas({
      ...input,
      count: 1,
    }).ideas[0];

    const script = this.buildScript(input);

    const content = [
      script.hook,
      script.introduction,
      ...script.sections.map((section) => section.narration),
      script.callToAction,
    ].join('\n\n');

    const optimization = this.buildOptimization({
      title: script.title,
      content,
      platform: input.platform,
    });

    const review = this.buildReview({
      title: script.title,
      content,
      platform: input.platform,
    });

    return {
      success: true,
      idea,
      script,
      optimization,
      review,
      productionPlan: {
        visualStyle:
          input.tone === 'cinematic'
            ? 'Ø³ÙŠÙ†Ù…Ø§Ø¦ÙŠ Ø¹Ø§Ù„ÙŠ Ø§Ù„ØªØ¨Ø§ÙŠÙ† Ù…Ø¹ Ù„Ù‚Ø·Ø§Øª Ø§ÙØªØªØ§Ø­ÙŠØ© Ù‚ÙˆÙŠØ©'
            : 'Ø­Ø¯ÙŠØ« ÙˆÙ†Ø¸ÙŠÙ Ù…Ø¹ Ø­Ø±ÙƒØ© Ø¨ØµØ±ÙŠØ© Ù…Ø³ØªÙ…Ø±Ø©',
        voiceStyle:
          input.platform === 'TikTok'
            ? 'Ø³Ø±ÙŠØ¹ØŒ Ù…Ø¨Ø§Ø´Ø±ØŒ ÙˆØ­ÙŠÙˆÙŠ'
            : 'ÙˆØ§Ø¶Ø­ØŒ ÙˆØ§Ø«Ù‚ØŒ ÙˆÙ…ØªØ¯Ø±Ø¬',
        musicDirection:
          'Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø£ØµÙ„ÙŠØ© Ù…ØªØµØ§Ø¹Ø¯Ø© Ù…Ù† Ø¯ÙˆÙ† Ø£Ù† ØªØ·ØºÙ‰ Ø¹Ù„Ù‰ Ø§Ù„ØªØ¹Ù„ÙŠÙ‚ Ø§Ù„ØµÙˆØªÙŠ',
        editingStyle:
          input.platform === 'TikTok'
            ? 'Ù‚ØµØ§Øª Ø³Ø±ÙŠØ¹Ø©ØŒ Ù†ØµÙˆØµ Ø¹Ù„Ù‰ Ø§Ù„Ø´Ø§Ø´Ø©ØŒ ÙˆØªØºÙŠÙŠØ± Ø¨ØµØ±ÙŠ ÙƒÙ„ 2-3 Ø«ÙˆØ§Ù†Ù'
            : 'Ù…ÙˆÙ†ØªØ§Ø¬ Ù‚ØµØµÙŠØŒ ÙØµÙˆÙ„ ÙˆØ§Ø¶Ø­Ø©ØŒ ÙˆØ§Ù†ØªÙ‚Ø§Ù„Ø§Øª Ù…Ø­Ø³ÙˆØ¨Ø©',
        publishingRecommendation:
          input.platform === 'Both'
            ? 'Ø¥Ù†Ø´Ø§Ø¡ Ù†Ø³Ø®Ø© Ø·ÙˆÙŠÙ„Ø© Ù„ÙŠÙˆØªÙŠÙˆØ¨ ÙˆÙ†Ø³Ø®Ø© Ø¹Ù…ÙˆØ¯ÙŠØ© Ù…Ø®ØªØµØ±Ø© Ù„ØªÙŠÙƒ ØªÙˆÙƒ'
            : `ØªØ­Ø³ÙŠÙ† Ø§Ù„Ù†Ø³Ø®Ø© Ø§Ù„Ù†Ù‡Ø§Ø¦ÙŠØ© Ø®ØµÙŠØµÙ‹Ø§ Ù„Ù…Ù†ØµØ© ${input.platform}`,
      },
    };
  }

  private buildIdeaTitle(
    topic: string,
    index: number,
    tone: AiContentTone,
  ): string {
    const templates: Record<AiContentTone, string[]> = {
      professional: [
        `Ø§Ù„Ø¯Ù„ÙŠÙ„ Ø§Ù„Ø°ÙƒÙŠ Ù„ÙÙ‡Ù… ${topic}`,
        `${topic}: Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª Ø§Ù„ØªÙŠ ØªØµÙ†Ø¹ Ø§Ù„ÙØ±Ù‚`,
        `ÙƒÙŠÙ ØªØªØ¹Ø§Ù…Ù„ Ø¨Ø§Ø­ØªØ±Ø§Ù Ù…Ø¹ ${topic}`,
      ],
      cinematic: [
        `Ø¯Ø§Ø®Ù„ Ø¹Ø§Ù„Ù… ${topic}`,
        `Ø§Ù„Ù„Ø­Ø¸Ø© Ø§Ù„ØªÙŠ ØºÙŠÙ‘Ø±Øª ${topic}`,
        `${topic}: Ø§Ù„Ù‚ØµØ© Ø§Ù„ØªÙŠ Ù„Ù… ØªÙØ±ÙˆÙŽ`,
      ],
      educational: [
        `${topic} Ø¨Ø¨Ø³Ø§Ø·Ø©`,
        `Ù…Ø§ ØªØ­ØªØ§Ø¬ Ù…Ø¹Ø±ÙØªÙ‡ Ø¹Ù† ${topic}`,
        `Ø´Ø±Ø­ ${topic} Ø®Ø·ÙˆØ© Ø¨Ø®Ø·ÙˆØ©`,
      ],
      entertaining: [
        `Ù„Ù† ØªØµØ¯Ù‚ Ù…Ø§ ÙŠØ­Ø¯Ø« ÙÙŠ ${topic}`,
        `Ø£ØºØ±Ø¨ Ø­Ù‚Ø§Ø¦Ù‚ ${topic}`,
        `Ø§Ø®ØªØ¨Ø± Ù…Ø¹Ù„ÙˆÙ…Ø§ØªÙƒ Ø¹Ù† ${topic}`,
      ],
      inspirational: [
        `ÙƒÙŠÙ ÙŠÙ…ÙƒÙ† Ù„Ù€ ${topic} Ø£Ù† ÙŠØºÙŠÙ‘Ø± Ù…Ø³ØªÙ‚Ø¨Ù„Ùƒ`,
        `Ø§Ø¨Ø¯Ø£ Ø±Ø­Ù„ØªÙƒ Ù…Ø¹ ${topic}`,
        `Ù…Ù† Ø§Ù„ÙÙƒØ±Ø© Ø¥Ù„Ù‰ Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²: ${topic}`,
      ],
    };

    const values = templates[tone];
    return values[index % values.length] ?? values[0] ?? topic;
  }

  private buildHook(
    topic: string,
    audience: string,
    index: number,
  ): string {
    const hooks = [
      `Ù…Ø¹Ø¸Ù… ${audience} ÙŠÙ†Ø¸Ø±ÙˆÙ† Ø¥Ù„Ù‰ ${topic} Ø¨Ø§Ù„Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø®Ø·Ø£ØŒ ÙˆÙ‡Ø°Ù‡ Ù‡ÙŠ Ø§Ù„Ø­Ù‚ÙŠÙ‚Ø©.`,
      `Ø®Ù„Ø§Ù„ Ø§Ù„Ø¯Ù‚Ø§Ø¦Ù‚ Ø§Ù„Ù‚Ø§Ø¯Ù…Ø© Ø³ØªÙƒØªØ´Ù Ø¬Ø§Ù†Ø¨Ù‹Ø§ Ù…Ù† ${topic} Ù„Ø§ ÙŠØªØ­Ø¯Ø« Ø¹Ù†Ù‡ Ø£Ø­Ø¯.`,
      `Ù‚Ø±Ø§Ø± ÙˆØ§Ø­Ø¯ ÙÙŠ ${topic} Ù‚Ø¯ ÙŠÙˆÙØ± Ø¹Ù„ÙŠÙƒ ÙˆÙ‚ØªÙ‹Ø§ ÙˆØ¬Ù‡Ø¯Ù‹Ø§ ÙƒØ¨ÙŠØ±ÙŠÙ†.`,
      `ØªØ®ÙŠÙ„ Ø£Ù† ØªØªÙ…ÙƒÙ† Ù…Ù† ÙÙ‡Ù… ${topic} Ù…Ù† Ø¯ÙˆÙ† Ø§Ù„ØªØ¹Ù‚ÙŠØ¯ Ø§Ù„Ù…Ø¹ØªØ§Ø¯.`,
      `Ù‚Ø¨Ù„ Ø£Ù† ØªØ¨Ø¯Ø£ ÙÙŠ ${topic}ØŒ Ù‡Ù†Ø§Ùƒ Ù†Ù‚Ø·Ø© Ø­Ø§Ø³Ù…Ø© ÙŠØ¬Ø¨ Ø£Ù† ØªØ¹Ø±ÙÙ‡Ø§.`,
    ];

    return hooks[index % hooks.length] ?? hooks[0] ?? topic;
  }

  private buildScript(input: GenerateScriptDto): AiContentScript {
    const duration = input.durationSeconds ?? (
      input.platform === 'TikTok' ? 60 : 360
    );

    const tone = input.tone ?? 'professional';

    return {
      title: this.buildIdeaTitle(input.topic, 0, tone),
      hook: this.buildHook(input.topic, input.audience, 0),
      introduction:
        `Ù‡Ø°Ø§ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù…Ø®ØµØµ Ù„Ù€ ${input.audience}ØŒ ÙˆØ³Ù†Ø­ÙˆÙ‘Ù„ Ù…ÙˆØ¶ÙˆØ¹ ${input.topic} ` +
        'Ø¥Ù„Ù‰ Ø®Ø·ÙˆØ§Øª ÙˆØ§Ø¶Ø­Ø© ÙˆÙ…ÙÙŠØ¯Ø© ÙˆÙ‚Ø§Ø¨Ù„Ø© Ù„Ù„ØªØ·Ø¨ÙŠÙ‚.',
      sections: [
        {
          heading: 'Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ©',
          narration:
            `Ù†Ø¨Ø¯Ø£ Ø¨ØªØ­Ø¯ÙŠØ¯ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© Ø§Ù„Ù…Ø±ØªØ¨Ø·Ø© Ø¨Ù€ ${input.topic}ØŒ ` +
            'ÙˆÙ„Ù…Ø§Ø°Ø§ ØªÙØ´Ù„ Ø§Ù„Ø­Ù„ÙˆÙ„ Ø§Ù„Ø³Ø·Ø­ÙŠØ© ÙÙŠ ØªÙ‚Ø¯ÙŠÙ… Ù†ØªÙŠØ¬Ø© Ù…Ø³ØªØ¯Ø§Ù…Ø©.',
          visualDirection:
            'Ù„Ù‚Ø·Ø§Øª ØªÙˆØ¶ÙŠØ­ÙŠØ© Ø³Ø±ÙŠØ¹Ø© Ù…Ø¹ Ø¹Ù†ÙˆØ§Ù† ÙƒØ¨ÙŠØ± ÙŠØ­Ø¯Ø¯ Ø§Ù„Ù…Ø´ÙƒÙ„Ø©.',
        },
        {
          heading: 'Ø§Ù„ÙÙƒØ±Ø© Ø§Ù„Ø°ÙƒÙŠØ©',
          narration:
            `Ø§Ù„ÙÙƒØ±Ø© Ù„ÙŠØ³Øª Ø¥Ø¶Ø§ÙØ© Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„ØªØ¹Ù‚ÙŠØ¯ØŒ Ø¨Ù„ Ø¨Ù†Ø§Ø¡ Ø·Ø±ÙŠÙ‚Ø© Ù…Ù†Ø¸Ù…Ø© ` +
            `ØªØ¬Ø¹Ù„ ${input.topic} Ù…ÙÙ‡ÙˆÙ…Ù‹Ø§ ÙˆÙ‚Ø§Ø¨Ù„Ù‹Ø§ Ù„Ù„Ù‚ÙŠØ§Ø³ ÙˆØ§Ù„ØªØ­Ø³ÙŠÙ†.`,
          visualDirection:
            'Ù…Ø®Ø·Ø· Ø¨ØµØ±ÙŠ ÙŠØªØ­ÙˆÙ„ Ù…Ù† Ø§Ù„ÙÙˆØ¶Ù‰ Ø¥Ù„Ù‰ Ù…Ø³Ø§Ø± ÙˆØ§Ø¶Ø­.',
        },
        {
          heading: 'Ø§Ù„ØªØ·Ø¨ÙŠÙ‚ Ø§Ù„Ø¹Ù…Ù„ÙŠ',
          narration:
            'Ø§Ø¨Ø¯Ø£ Ø¨Ø®Ø·ÙˆØ© ØµØºÙŠØ±Ø©ØŒ Ø§Ø®ØªØ¨Ø± Ø§Ù„Ù†ØªÙŠØ¬Ø©ØŒ Ø³Ø¬Ù„ Ù…Ø§ Ø­Ø¯Ø«ØŒ Ø«Ù… Ø­Ø³Ù‘Ù† Ø§Ù„Ù‚Ø±Ø§Ø± Ø§Ù„ØªØ§Ù„ÙŠ ' +
            'Ø§Ø¹ØªÙ…Ø§Ø¯Ù‹Ø§ Ø¹Ù„Ù‰ Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø¨Ø¯Ù„ Ø§Ù„ØªØ®Ù…ÙŠÙ†.',
          visualDirection:
            'Ø¹Ø±Ø¶ Ø«Ù„Ø§Ø« Ø®Ø·ÙˆØ§Øª Ù…Ø±Ù‚Ù…Ø© Ù…Ø¹ Ù…Ø«Ø§Ù„ Ø¹Ù…Ù„ÙŠ.',
        },
        {
          heading: 'Ø§Ù„Ù†ØªÙŠØ¬Ø© Ø§Ù„Ù…ØªÙˆÙ‚Ø¹Ø©',
          narration:
            `Ø¹Ù†Ø¯ ØªØ·Ø¨ÙŠÙ‚ Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ù„ÙˆØ¨ Ø¹Ù„Ù‰ ${input.topic} Ø³ØªØµØ¨Ø­ Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª Ø£Ø³Ø±Ø¹ØŒ ` +
            'ÙˆØ§Ù„Ø¬ÙˆØ¯Ø© Ø£ÙƒØ«Ø± Ø§ØªØ³Ø§Ù‚Ù‹Ø§ØŒ ÙˆØ§Ù„Ù†ØªØ§Ø¦Ø¬ Ø£Ø³Ù‡Ù„ ÙÙŠ Ø§Ù„ØªÙƒØ±Ø§Ø±.',
          visualDirection:
            'Ù„Ù‚Ø·Ø© Ù†ØªÙŠØ¬Ø© Ù†Ù‡Ø§Ø¦ÙŠØ© Ù…Ø¹ Ù…Ù‚Ø§Ø±Ù†Ø© Ù‚Ø¨Ù„ ÙˆØ¨Ø¹Ø¯.',
        },
      ],
      callToAction:
        'Ø§ÙƒØªØ¨ Ø±Ø£ÙŠÙƒ Ø£Ùˆ ØªØ¬Ø±Ø¨ØªÙƒØŒ ÙˆØ§Ø­ÙØ¸ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù„Ù„Ø¹ÙˆØ¯Ø© Ø¥Ù„Ù‰ Ø§Ù„Ø®Ø·ÙˆØ§Øª Ø¹Ù†Ø¯ Ø§Ù„ØªØ·Ø¨ÙŠÙ‚.',
      estimatedDurationSeconds: duration,
    };
  }

  private buildOptimization(
    input: OptimizeContentDto,
  ): AiContentOptimization {
    const keyword = input.title
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .trim()
      .split(/\s+/)
      .slice(0, 5)
      .join(' ');

    const compactKeyword = keyword.replace(/\s+/g, '');

    return {
      titles: [
        input.title,
        `${input.title} | Ø§Ù„Ø¯Ù„ÙŠÙ„ Ø§Ù„ÙƒØ§Ù…Ù„`,
        `${input.title}: Ù…Ø§ Ù„Ø§ ÙŠØ®Ø¨Ø±Ùƒ Ø¨Ù‡ Ø§Ù„Ø¢Ø®Ø±ÙˆÙ†`,
        `ÙƒÙŠÙ ØªØ­Ù‚Ù‚ Ø£ÙØ¶Ù„ Ù†ØªÙŠØ¬Ø© ÙÙŠ ${input.title}`,
        `${input.title} Ø®Ø·ÙˆØ© Ø¨Ø®Ø·ÙˆØ©`,
      ],
      description:
        `Ù†Ø³ØªØ¹Ø±Ø¶ ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù…ÙˆØ¶ÙˆØ¹ "${input.title}" Ø¨Ø·Ø±ÙŠÙ‚Ø© ÙˆØ§Ø¶Ø­Ø© ÙˆØ¹Ù…Ù„ÙŠØ©ØŒ ` +
        `Ù…Ø¹ Ø£Ù‡Ù… Ø§Ù„Ø£ÙÙƒØ§Ø± ÙˆØ§Ù„Ø®Ø·ÙˆØ§Øª Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø© Ù„Ù…Ù†ØµØ© ${input.platform}.`,
      tags: [
        keyword,
        `${keyword} Ø´Ø±Ø­`,
        `${keyword} Ø¯Ù„ÙŠÙ„`,
        'CreatorOS',
        'Ø°ÙƒØ§Ø¡ Ø§ØµØ·Ù†Ø§Ø¹ÙŠ',
        'ØµÙ†Ø§Ø¹Ø© Ø§Ù„Ù…Ø­ØªÙˆÙ‰',
      ].filter(Boolean),
      hashtags: [
        `#${compactKeyword || 'CreatorOS'}`,
        '#ØµÙ†Ø§Ø¹Ø©_Ø§Ù„Ù…Ø­ØªÙˆÙ‰',
        '#Ø°ÙƒØ§Ø¡_Ø§ØµØ·Ù†Ø§Ø¹ÙŠ',
        input.platform === 'TikTok' ? '#ØªÙŠÙƒ_ØªÙˆÙƒ' : '#ÙŠÙˆØªÙŠÙˆØ¨',
      ],
      thumbnailIdeas: [
        `ÙˆØ¬Ù‡ Ø£Ùˆ Ø¹Ù†ØµØ± Ø±Ø¦ÙŠØ³ÙŠ ÙˆØ§Ø¶Ø­ Ù…Ø¹ Ø¹Ø¨Ø§Ø±Ø©: Ø³Ø± ${input.title}`,
        'ØªÙ‚Ø³ÙŠÙ… Ø§Ù„ØµÙˆØ±Ø© Ø¥Ù„Ù‰ Ù‚Ø¨Ù„ ÙˆØ¨Ø¹Ø¯ Ù…Ø¹ ØªØ¨Ø§ÙŠÙ† Ø¨ØµØ±ÙŠ Ù‚ÙˆÙŠ',
        'Ø±Ù‚Ù… ÙƒØ¨ÙŠØ± Ù…Ø¹ Ø³Ø¤Ø§Ù„ ÙŠØ«ÙŠØ± Ø§Ù„ÙØ¶ÙˆÙ„',
      ],
    };
  }

  private buildReview(input: ReviewContentDto): AiContentReview {
    const length = input.content.trim().length;
    const clarityScore = Math.min(96, 70 + Math.floor(length / 400));
    const retentionScore = input.content.includes('ØŸ') ? 89 : 82;
    const originalityScore = 86;
    const platformFitScore =
      input.platform === 'TikTok'
        ? length <= 1800 ? 92 : 76
        : length >= 800 ? 91 : 80;

    const overallScore = Math.round(
      (
        clarityScore +
        retentionScore +
        originalityScore +
        platformFitScore
      ) / 4,
    );

    const risks: string[] = [];

    if (length < 300) {
      risks.push('Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù‚ØµÙŠØ± ÙˆÙ‚Ø¯ Ù„Ø§ ÙŠØ´Ø±Ø­ Ø§Ù„ÙÙƒØ±Ø© Ø¨Ù…Ø§ ÙŠÙƒÙÙŠ.');
    }

    if (input.platform === 'TikTok' && length > 1800) {
      risks.push('Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ø·ÙˆÙŠÙ„ Ù†Ø³Ø¨ÙŠÙ‹Ø§ Ù„Ù†Ø³Ø®Ø© ØªÙŠÙƒ ØªÙˆÙƒ Ø³Ø±ÙŠØ¹Ø©.');
    }

    if (!input.content.includes('ØŸ')) {
      risks.push('ÙŠÙ…ÙƒÙ† Ø¥Ø¶Ø§ÙØ© Ø³Ø¤Ø§Ù„ Ù…Ø¨ÙƒØ± Ù„Ø±ÙØ¹ Ø§Ù„ÙØ¶ÙˆÙ„ ÙˆØ§Ù„Ø§Ø­ØªÙØ§Ø¸.');
    }

    return {
      overallScore,
      clarityScore,
      retentionScore,
      originalityScore,
      platformFitScore,
      strengths: [
        'Ø§Ù„ÙÙƒØ±Ø© Ø§Ù„Ø£Ø³Ø§Ø³ÙŠØ© ÙˆØ§Ø¶Ø­Ø©.',
        'Ø§Ù„Ø¨Ù†ÙŠØ© Ù‚Ø§Ø¨Ù„Ø© Ù„Ù„ØªØ­ÙˆÙŠÙ„ Ø¥Ù„Ù‰ Ù…Ø´Ø§Ù‡Ø¯ Ø¥Ù†ØªØ§Ø¬.',
        'Ø§Ù„Ù…Ø­ØªÙˆÙ‰ Ù…Ù†Ø§Ø³Ø¨ Ù„Ù„ØªØ­Ø³ÙŠÙ† Ù…ØªØ¹Ø¯Ø¯ Ø§Ù„Ù…Ù†ØµØ§Øª.',
      ],
      risks,
      recommendations: [
        'Ø§Ø¬Ø¹Ù„ Ø£ÙˆÙ„ Ø¬Ù…Ù„Ø© Ø£Ù‚ØµØ± ÙˆØ£ÙƒØ«Ø± Ø­Ø¯Ø©.',
        'Ø£Ø¶Ù ØªØºÙŠÙŠØ±Ù‹Ø§ Ø¨ØµØ±ÙŠÙ‹Ø§ ÙˆØ§Ø¶Ø­Ù‹Ø§ ÙÙŠ Ø¨Ø¯Ø§ÙŠØ© ÙƒÙ„ Ù‚Ø³Ù….',
        'Ø§Ø®ØªÙ… Ø¨Ø¯Ø¹ÙˆØ© ÙˆØ§Ø­Ø¯Ø© Ù…Ø­Ø¯Ø¯Ø© Ù„Ø§ØªØ®Ø§Ø° Ø¥Ø¬Ø±Ø§Ø¡.',
      ],
    };
  }
}
