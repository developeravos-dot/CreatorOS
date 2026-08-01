import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  GenerateIdeasDto,
  GenerateScriptDto,
  OptimizeContentDto,
  ProductionPackageDto,
  ReviewContentDto,
} from './ai-content.dto';
import { AiProviderRouterService } from './providers/ai-provider-router.service';

type JsonRecord = Record<string, unknown>;

@Injectable()
export class AiContentService {
  constructor(
    private readonly providerRouter: AiProviderRouterService,
  ) {}

  status() {
    const routing = this.providerRouter.status();

    return {
      success: true,
      module: 'CreatorOS AI Content Engine',
      status: routing.registeredProviders.some((provider) => provider.configured)
        ? 'operational'
        : 'configuration-required',
      provider: routing.primaryProvider,
      model: 'provider-managed',
      version: 'MP4-1.0.0',
      configured: routing.registeredProviders.some(
        (provider) => provider.configured,
      ),
      routing,
      capabilities: [
        'ai-idea-generation',
        'ai-script-generation',
        'ai-platform-optimization',
        'ai-quality-review',
        'ai-production-package',
        'multi-provider-routing',
        'automatic-fallback',
      ],
    };
  }

  async generateIdeas(input: GenerateIdeasDto) {
    const count = input.count ?? 5;
    const result = await this.generateJson(
      'ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â¯ ÃƒËœÃ‚Â£Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â§ÃƒËœÃ‚Â± Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â£ÃƒËœÃ‚ÂµÃƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©',
      `ÃƒËœÃ‚Â£Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â´ÃƒËœÃ‚Â¦ ${count} ÃƒËœÃ‚Â£Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â§ÃƒËœÃ‚Â± Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â£ÃƒËœÃ‚ÂµÃƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â®ÃƒËœÃ‚ÂªÃƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‚ÂÃƒËœÃ‚Â© ÃƒËœÃ‚Â¨Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â­.

ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¹: ${input.topic}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¬Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â±: ${input.audience}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â©: ${input.platform}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â£ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¨: ${input.tone ?? 'professional'}

Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ ÃƒËœÃ‚Â¥Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â²ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©:
- ÃƒËœÃ‚Â§Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Â¡Ãƒâ„¢Ã¢â‚¬Â¦ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¹ Ãƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Å¾ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã†â€™ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â©.
- Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â§ ÃƒËœÃ‚ÂªÃƒËœÃ‚Â³ÃƒËœÃ‚ÂªÃƒËœÃ‚Â®ÃƒËœÃ‚Â¯Ãƒâ„¢Ã¢â‚¬Â¦ Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¨ ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â© ÃƒËœÃ‚Â£Ãƒâ„¢Ã‹â€  ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â§Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â  Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â±ÃƒËœÃ‚Â©.
- ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Å¾ Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Å¾ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â§ÃƒËœÃ‚Â³ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¹ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¬Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â± Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â© ÃƒËœÃ‚ÂªÃƒËœÃ‚Â­ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â¯Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§.
- ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Å¾ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â  ÃƒËœÃ‚Â·ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â¹Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â°ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â®ÃƒËœÃ‚Â·ÃƒËœÃ‚Â§Ãƒâ„¢Ã‚Â Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â§ÃƒËœÃ‚Â´ÃƒËœÃ‚Â±Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§.
- ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â· Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Å¾ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â© ÃƒËœÃ‚Â²ÃƒËœÃ‚Â§Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â¥ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¹Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â®ÃƒËœÃ‚ÂªÃƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‚ÂÃƒËœÃ‚Â© Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚ÂªÃƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã…Â Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â  100.
- ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ JSON ÃƒËœÃ‚ÂµÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â· ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â°Ãƒâ„¢Ã¢â‚¬Â¡ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©:
{
  "ideas": [
    {
      "title": "",
      "hook": "",
      "angle": "",
      "score": 90
    }
  ]
}`,
    );

    const rawIdeas = Array.isArray(result.output.ideas)
      ? result.output.ideas
      : [];

    const ideas = rawIdeas.slice(0, count).map((item, index) => {
      const idea = this.asRecord(item);
      return {
        id: randomUUID(),
        title: this.asString(
          idea.title,
          `Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â­Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Å¾ ${input.topic}`,
        ),
        hook: this.asString(
          idea.hook,
          `Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â§ÃƒËœÃ‚Â°ÃƒËœÃ‚Â§ ÃƒËœÃ‚Â³Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â­ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â« Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‹â€  ÃƒËœÃ‚ÂªÃƒËœÃ‚ÂºÃƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬ËœÃƒËœÃ‚Â± Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Å¾ Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â§ Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â±Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Â¡ ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â  ${input.topic}ÃƒËœÃ…Â¸`,
        ),
        angle: this.asString(idea.angle, 'ÃƒËœÃ‚Â²ÃƒËœÃ‚Â§Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚ÂªÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â£ÃƒËœÃ‚ÂµÃƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©'),
        targetAudience: input.audience,
        platform: input.platform,
        score: this.asScore(
          idea.score,
          Math.max(75, 96 - index * 3),
        ),
        createdAt: new Date().toISOString(),
      };
    });

    return {
      success: true,
      provider: result.providerId,
      model: result.model,
      ideas,
    };
  }

  async generateScript(input: GenerateScriptDto) {
    const duration =
      input.durationSeconds ??
      (input.platform === 'TikTok' ? 60 : 360);

    const result = await this.generateJson(
      'Ãƒâ„¢Ã†â€™ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â© ÃƒËœÃ‚Â³Ãƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨ÃƒËœÃ‚Âª ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â  ÃƒËœÃ‚Â§ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒËœÃ‚Â±ÃƒËœÃ‚Â§Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã…Â  ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â² Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¥Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬',
      `ÃƒËœÃ‚Â§Ãƒâ„¢Ã†â€™ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¨ ÃƒËœÃ‚Â³Ãƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨ÃƒËœÃ‚ÂªÃƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ ÃƒËœÃ‚Â£ÃƒËœÃ‚ÂµÃƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â²Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¥Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬.

ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¹: ${input.topic}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¬Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â±: ${input.audience}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â©: ${input.platform}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â£ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¨: ${input.tone ?? 'professional'}
ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â·Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â©: ${duration} ÃƒËœÃ‚Â«ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©

Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ ÃƒËœÃ‚Â¥Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â²ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©:
- ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â£ ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â®ÃƒËœÃ‚Â·ÃƒËœÃ‚Â§Ãƒâ„¢Ã‚Â Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â  Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã…Â  ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â«Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã…Â  ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â£Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â°.
- ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¬Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â¨ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â¯Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â§ÃƒËœÃ‚Âª ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â© Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­ÃƒËœÃ‚Â´Ãƒâ„¢Ã‹â€ .
- ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã‚Â ÃƒËœÃ‚ÂªÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚ÂµÃƒËœÃ‚ÂµÃƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¶ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§.
- ÃƒËœÃ‚Â§ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â· Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Å¾ Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â© ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¹ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã…Â .
- ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‚Â ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¬Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¡Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ ÃƒËœÃ‚Â¨ÃƒËœÃ‚ÂµÃƒËœÃ‚Â±Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Å¾ Ãƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Â¦.
- ÃƒËœÃ‚Â§ÃƒËœÃ‚Â®ÃƒËœÃ‚ÂªÃƒâ„¢Ã¢â‚¬Â¦ ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â¹Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â© Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§ÃƒËœÃ‚Â­ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â§ÃƒËœÃ‚Â³ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â§ÃƒËœÃ‚ÂªÃƒËœÃ‚Â®ÃƒËœÃ‚Â§ÃƒËœÃ‚Â° ÃƒËœÃ‚Â¥ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â±ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¡.
- ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ JSON ÃƒËœÃ‚ÂµÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â· ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â°Ãƒâ„¢Ã¢â‚¬Â¡ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©:
{
  "script": {
    "title": "",
    "hook": "",
    "introduction": "",
    "sections": [
      { "heading": "", "narration": "", "visualDirection": "" }
    ],
    "callToAction": "",
    "estimatedDurationSeconds": ${duration}
  }
}`,
    );

    return {
      success: true,
      provider: result.providerId,
      model: result.model,
      script: result.output.script ?? result.output,
    };
  }

  async optimize(input: OptimizeContentDto) {
    const result = await this.generateJson(
      'ÃƒËœÃ‚ÂªÃƒËœÃ‚Â­ÃƒËœÃ‚Â³Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â  ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â° Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â³ÃƒËœÃ‚ÂªÃƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â¯Ãƒâ„¢Ã‚ÂÃƒËœÃ‚Â©',
      `ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¾ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â  Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â­ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬ËœÃƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã¢â‚¬Â¡ Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â© ${input.platform}.

ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â : ${input.title}

ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â°:
${input.content}

ÃƒËœÃ‚Â£Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â´ÃƒËœÃ‚Â¦ ÃƒËœÃ‚Â®Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â³ÃƒËœÃ‚Â© ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â§Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â  Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚ÂºÃƒâ„¢Ã…Â ÃƒËœÃ‚Â± Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â¶Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â©ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚ÂµÃƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã†â€™Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â§ÃƒËœÃ‚Âª Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã‚ÂÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â­Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â³Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â£Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â§ÃƒËœÃ‚Â± ÃƒËœÃ‚ÂµÃƒâ„¢Ã‹â€ ÃƒËœÃ‚Â± Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚ÂµÃƒËœÃ‚ÂºÃƒËœÃ‚Â±ÃƒËœÃ‚Â©ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â³ÃƒËœÃ‚Â®ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚Â³Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â  ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â°ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¦Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â© ÃƒËœÃ‚ÂªÃƒËœÃ‚Â­ÃƒËœÃ‚Â³Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â§ÃƒËœÃ‚Âª ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©.

ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ JSON ÃƒËœÃ‚ÂµÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â· ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â°Ãƒâ„¢Ã¢â‚¬Â¡ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©:
{
  "optimization": {
    "titles": [],
    "description": "",
    "tags": [],
    "hashtags": [],
    "thumbnailIdeas": [],
    "optimizedContent": "",
    "improvements": []
  }
}`,
    );

    return {
      success: true,
      provider: result.providerId,
      model: result.model,
      optimization:
        result.output.optimization ?? result.output,
    };
  }

  async review(input: ReviewContentDto) {
    const result = await this.generateJson(
      'Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â±ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â© ÃƒËœÃ‚Â¬Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â°',
      `ÃƒËœÃ‚Â±ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â¹ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã…Â  Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â±ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â© ÃƒËœÃ‚ÂªÃƒËœÃ‚Â­ÃƒËœÃ‚Â±Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â±Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒËœÃ‚Â±ÃƒËœÃ‚Â§Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã…Â ÃƒËœÃ‚Â© Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â© ${input.platform}.

ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â : ${input.title}

ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â°:
${input.content}

Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬ËœÃƒâ„¢Ã¢â‚¬Â¦ Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â  100: ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â¶Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â­ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â§ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‚ÂÃƒËœÃ‚Â§ÃƒËœÃ‚Â¸ ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â´ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â¯ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â£ÃƒËœÃ‚ÂµÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â©ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¡Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂµÃƒËœÃ‚Â©ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚ÂªÃƒâ„¢Ã…Â ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â©. ÃƒËœÃ‚Â­ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â¯ Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â§ÃƒËœÃ‚Â· ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â© Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â®ÃƒËœÃ‚Â§ÃƒËœÃ‚Â·ÃƒËœÃ‚Â± Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ ÃƒËœÃ‚ÂµÃƒâ„¢Ã…Â ÃƒËœÃ‚Â§ÃƒËœÃ‚Âª Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¬ÃƒËœÃ‚Â²ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¡ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚ÂªÃƒâ„¢Ã…Â  ÃƒËœÃ‚ÂªÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â¬ ÃƒËœÃ‚Â¥Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â¥ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¯ÃƒËœÃ‚Â© Ãƒâ„¢Ã†â€™ÃƒËœÃ‚ÂªÃƒËœÃ‚Â§ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â©.

ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ JSON ÃƒËœÃ‚ÂµÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â· ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â¡ÃƒËœÃ‚Â°Ãƒâ„¢Ã¢â‚¬Â¡ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¨Ãƒâ„¢Ã¢â‚¬Â Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©:
{
  "review": {
    "overallScore": 0,
    "clarityScore": 0,
    "retentionScore": 0,
    "originalityScore": 0,
    "platformFitScore": 0,
    "strengths": [],
    "risks": [],
    "recommendations": [],
    "rewriteSuggestions": []
  }
}`,
    );

    return {
      success: true,
      provider: result.providerId,
      model: result.model,
      review: result.output.review ?? result.output,
    };
  }

  async createProductionPackage(input: ProductionPackageDto) {
    const duration =
      input.durationSeconds ??
      (input.platform === 'TikTok' ? 60 : 360);

    const result = await this.generateJson(
      'Create a complete production-ready content package',
      `Create a complete content production package.

Topic: ${input.topic}
Audience: ${input.audience}
Platform: ${input.platform}
Tone: ${input.tone ?? 'professional'}
Duration: ${duration} seconds

Return valid JSON only with this exact structure:
{
  "idea": {
    "title": "",
    "hook": "",
    "angle": "",
    "targetAudience": ""
  },
  "script": {
    "title": "",
    "hook": "",
    "introduction": "",
    "sections": [
      {
        "heading": "",
        "narration": "",
        "visualDirection": "",
        "onScreenText": "",
        "durationSeconds": 30
      }
    ],
    "callToAction": "",
    "estimatedDurationSeconds": ${duration}
  },
  "scenePlan": [
    {
      "sceneNumber": 1,
      "heading": "",
      "voiceOver": "",
      "visualPrompt": "",
      "onScreenText": "",
      "music": "",
      "soundEffects": "",
      "editingDirection": "",
      "durationSeconds": 30
    }
  ],
  "productionPlan": {
    "visualStyle": "",
    "voiceStyle": "",
    "musicStyle": "",
    "editingStyle": "",
    "thumbnailPrompt": "",
    "requiredAssets": []
  },
  "optimization": {
    "title": "",
    "description": "",
    "tags": [],
    "hashtags": [],
    "keywords": []
  },
  "qualityChecklist": []
}

Mandatory rules:
- Produce at least 4 script sections.
- Produce at least 4 scenePlan items.
- Every section must contain narration and visualDirection.
- Every scene must contain voiceOver and visualPrompt.
- Do not return empty arrays.
- Do not return Markdown.`,
    );

    const output = this.asRecord(result.output);
    const rawIdea = this.asRecord(output.idea);
    const rawScript = this.asRecord(output.script);
    const rawProductionPlan = this.asRecord(output.productionPlan);
    const rawOptimization = this.asRecord(output.optimization);

    const fallbackSections = [
      {
        heading: 'Opening hook',
        narration: `Imagine how ${input.topic} could change the way we live, learn, and work.`,
        visualDirection: `Fast cinematic opening illustrating ${input.topic}.`,
        onScreenText: input.topic,
        durationSeconds: Math.max(15, Math.round(duration * 0.15)),
      },
      {
        heading: 'Current reality',
        narration: `This section explains the present state of ${input.topic} and why it matters to ${input.audience}.`,
        visualDirection: 'Clear examples, relevant footage, and simple animated data.',
        onScreenText: 'Why it matters',
        durationSeconds: Math.max(20, Math.round(duration * 0.25)),
      },
      {
        heading: 'Main transformation',
        narration: `The central transformation is presented through practical examples and direct benefits for the target audience.`,
        visualDirection: 'Before-and-after comparison with supporting visual examples.',
        onScreenText: 'The transformation',
        durationSeconds: Math.max(20, Math.round(duration * 0.35)),
      },
      {
        heading: 'Conclusion and action',
        narration: `The audience receives a concise conclusion and a clear next step related to ${input.topic}.`,
        visualDirection: 'Strong closing montage followed by a clean call-to-action screen.',
        onScreenText: 'What happens next?',
        durationSeconds: Math.max(15, Math.round(duration * 0.25)),
      },
    ];

    const rawSections = Array.isArray(rawScript.sections)
      ? rawScript.sections
      : Array.isArray(output.sections)
        ? output.sections
        : [];

    const sections = (rawSections.length > 0 ? rawSections : fallbackSections)
      .map((value, index) => {
        const section = this.asRecord(value);
        const fallback = fallbackSections[index % fallbackSections.length] ?? fallbackSections[0]!;

        return {
          heading: this.asString(section.heading, fallback.heading),
          narration: this.asString(section.narration, fallback.narration),
          visualDirection: this.asString(
            section.visualDirection,
            fallback.visualDirection,
          ),
          onScreenText: this.asString(
            section.onScreenText,
            fallback.onScreenText,
          ),
          durationSeconds:
            typeof section.durationSeconds === 'number'
              ? section.durationSeconds
              : fallback.durationSeconds,
        };
      });

    const rawScenes = Array.isArray(output.scenePlan)
      ? output.scenePlan
      : [];

    const scenePlan = (rawScenes.length > 0 ? rawScenes : sections)
      .map((value, index) => {
        const scene = this.asRecord(value);
        const section = sections[index % sections.length] ?? fallbackSections[0]!;

        return {
          sceneNumber: index + 1,
          heading: this.asString(scene.heading, section.heading),
          voiceOver: this.asString(
            scene.voiceOver,
            this.asString(scene.narration, section.narration),
          ),
          visualPrompt: this.asString(
            scene.visualPrompt,
            this.asString(scene.visualDirection, section.visualDirection),
          ),
          onScreenText: this.asString(
            scene.onScreenText,
            section.onScreenText,
          ),
          music: this.asString(
            scene.music,
            'Modern cinematic background music',
          ),
          soundEffects: this.asString(
            scene.soundEffects,
            'Subtle transitions and emphasis effects',
          ),
          editingDirection: this.asString(
            scene.editingDirection,
            'Clean cuts, purposeful motion, and platform-appropriate pacing',
          ),
          durationSeconds:
            typeof scene.durationSeconds === 'number'
              ? scene.durationSeconds
              : section.durationSeconds,
        };
      });

    const title = this.asString(
      rawIdea.title,
      this.asString(rawScript.title, input.topic),
    );

    const hook = this.asString(
      rawIdea.hook,
      this.asString(
        rawScript.hook,
        `What if ${input.topic} changes everything sooner than expected?`,
      ),
    );

    const optimization = {
      title: this.asString(rawOptimization.title, title),
      description: this.asString(
        rawOptimization.description,
        `A complete exploration of ${input.topic} created for ${input.audience}.`,
      ),
      tags: Array.isArray(rawOptimization.tags)
        ? rawOptimization.tags
        : [input.topic, input.platform, 'CreatorOS'],
      hashtags: Array.isArray(rawOptimization.hashtags)
        ? rawOptimization.hashtags
        : ['#CreatorOS', '#AIContent'],
      keywords: Array.isArray(rawOptimization.keywords)
        ? rawOptimization.keywords
        : [input.topic, input.audience],
    };

    const qualityChecklist =
      Array.isArray(output.qualityChecklist) &&
      output.qualityChecklist.length > 0
        ? output.qualityChecklist
        : [
            'Hook is clear and immediate',
            'Narration matches the target audience',
            'Every scene has a visual direction',
            'Voice-over is production-ready',
            'Thumbnail supports the main promise',
            'Metadata matches the platform',
            'Call to action is clear',
          ];

    return {
      success: true,
      provider: result.providerId,
      model: result.model,
      title,
      targetAudience: [input.audience],
      platform: input.platform,
      contentType: input.tone ?? 'professional',
      duration,
      hook,
      idea: {
        title,
        hook,
        angle: this.asString(
          rawIdea.angle,
          `A practical and engaging exploration of ${input.topic}`,
        ),
        targetAudience: this.asString(
          rawIdea.targetAudience,
          input.audience,
        ),
      },
      script: {
        title,
        hook,
        introduction: this.asString(
          rawScript.introduction,
          `In this production, we explore ${input.topic} and its significance for ${input.audience}.`,
        ),
        sections,
        callToAction: this.asString(
          rawScript.callToAction,
          'Share your opinion and follow for the next production.',
        ),
        estimatedDurationSeconds: duration,
      },
      sections,
      scenePlan,
      productionPlan: {
        visualStyle: this.asString(
          rawProductionPlan.visualStyle,
          'Modern cinematic educational style',
        ),
        voiceStyle: this.asString(
          rawProductionPlan.voiceStyle,
          'Clear, confident, and natural narration',
        ),
        musicStyle: this.asString(
          rawProductionPlan.musicStyle,
          'Subtle cinematic electronic music',
        ),
        editingStyle: this.asString(
          rawProductionPlan.editingStyle,
          'Fast opening followed by clear narrative pacing',
        ),
        thumbnailPrompt: this.asString(
          rawProductionPlan.thumbnailPrompt,
          `High-impact ${input.platform} thumbnail about ${input.topic}, strong focal subject, dramatic lighting, clean composition, no clutter`,
        ),
        requiredAssets: Array.isArray(rawProductionPlan.requiredAssets)
          ? rawProductionPlan.requiredAssets
          : [
              'Voice-over recording',
              'Background music',
              'Scene visuals',
              'On-screen text',
              'Thumbnail',
            ],
      },
      optimization,
      qualityChecklist,
    };
  }
  private generateJson(task: string, prompt: string) {
    return this.providerRouter.generateJson<JsonRecord>({
      task,
      prompt,
      responseFormat: 'json',
      systemInstruction:
        'ÃƒËœÃ‚Â£Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Âª Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚Â±Ãƒâ„¢Ã†â€™ CreatorOS ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚ÂªÃƒËœÃ‚Â®ÃƒËœÃ‚ÂµÃƒËœÃ‚Âµ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã…Â  ÃƒËœÃ‚ÂµÃƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â§ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â­ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â°. ÃƒËœÃ‚Â§Ãƒâ„¢Ã†â€™ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¨ ÃƒËœÃ‚Â¨ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â±ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â© ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã‚ÂÃƒËœÃ‚ÂµÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â° ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â·ÃƒËœÃ‚Â¨Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â¹Ãƒâ„¢Ã…Â ÃƒËœÃ‚Â©ÃƒËœÃ…â€™ Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¬Ãƒâ„¢Ã¢â‚¬Â ÃƒËœÃ‚Â¨ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­ÃƒËœÃ‚Â´Ãƒâ„¢Ã‹â€  Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾Ãƒâ„¢Ã¢â‚¬Å¡Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¨ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Â¦ÃƒËœÃ‚Â© Ãƒâ„¢Ã‹â€ ÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚ÂªÃƒâ„¢Ã†â€™ÃƒËœÃ‚Â±ÃƒËœÃ‚Â§ÃƒËœÃ‚Â±. ÃƒËœÃ‚Â£ÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯ JSON ÃƒËœÃ‚ÂµÃƒËœÃ‚Â§Ãƒâ„¢Ã¢â‚¬Å¾ÃƒËœÃ‚Â­Ãƒâ„¢Ã¢â‚¬Â¹ÃƒËœÃ‚Â§ Ãƒâ„¢Ã‚ÂÃƒâ„¢Ã¢â‚¬Å¡ÃƒËœÃ‚Â· Ãƒâ„¢Ã¢â‚¬Â¦Ãƒâ„¢Ã¢â‚¬Â  ÃƒËœÃ‚Â¯Ãƒâ„¢Ã‹â€ Ãƒâ„¢Ã¢â‚¬Â  Markdown.',
    });
  }

  private asRecord(value: unknown): JsonRecord {
    return value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
      ? (value as JsonRecord)
      : {};
  }

  private asString(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim()
      ? value.trim()
      : fallback;
  }

  private asScore(value: unknown, fallback: number): number {
    const score =
      typeof value === 'number' ? value : Number(value);

    return Number.isFinite(score)
      ? Math.max(0, Math.min(100, Math.round(score)))
      : fallback;
  }
}