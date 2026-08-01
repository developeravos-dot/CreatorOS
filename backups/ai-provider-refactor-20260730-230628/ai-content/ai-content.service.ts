import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { randomUUID } from 'node:crypto';
import {
  GenerateIdeasDto,
  GenerateScriptDto,
  OptimizeContentDto,
  ProductionPackageDto,
  ReviewContentDto,
} from './ai-content.dto';

type JsonRecord = Record<string, unknown>;

@Injectable()
export class AiContentService {
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    this.model = process.env.OPENAI_MODEL?.trim() || 'gpt-5';
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  status() {
    return {
      success: true,
      module: 'CreatorOS AI Content Engine',
      status: this.client ? 'operational' : 'configuration-required',
      provider: 'OpenAI',
      model: this.model,
      version: 'MP3-1.0.0',
      configured: Boolean(this.client),
      capabilities: [
        'ai-idea-generation',
        'ai-script-generation',
        'ai-platform-optimization',
        'ai-quality-review',
        'ai-production-package',
      ],
    };
  }

  async generateIdeas(input: GenerateIdeasDto) {
    const count = input.count ?? 5;
    const result = await this.generateJson(
      'توليد أفكار محتوى عربية أصلية',
      `أنشئ ${count} أفكار محتوى عربية أصلية ومختلفة بوضوح.

الموضوع: ${input.topic}
الجمهور: ${input.audience}
المنصة: ${input.platform}
الأسلوب: ${input.tone ?? 'professional'}

قواعد إلزامية:
- افهم الموضوع قبل الكتابة.
- لا تستخدم قوالب عامة أو عناوين مكررة.
- اجعل كل فكرة مناسبة للموضوع والجمهور والمنصة تحديدًا.
- اجعل العنوان طبيعيًا وجذابًا، والخطاف قويًا ومباشرًا.
- أعط كل فكرة زاوية إبداعية مختلفة وتقييمًا من 100.
- أعد JSON صالحًا فقط بهذه البنية:
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

    const rawIdeas = Array.isArray(result.ideas) ? result.ideas : [];
    const ideas = rawIdeas.slice(0, count).map((item, index) => {
      const idea = this.asRecord(item);
      return {
        id: randomUUID(),
        title: this.asString(idea.title, `فكرة محتوى حول ${input.topic}`),
        hook: this.asString(idea.hook, `ماذا سيحدث لو تغيّر كل ما نعرفه عن ${input.topic}؟`),
        angle: this.asString(idea.angle, 'زاوية تحليلية أصلية'),
        targetAudience: input.audience,
        platform: input.platform,
        score: this.asScore(idea.score, Math.max(75, 96 - index * 3)),
        createdAt: new Date().toISOString(),
      };
    });

    return { success: true, provider: 'OpenAI', model: this.model, ideas };
  }

  async generateScript(input: GenerateScriptDto) {
    const duration = input.durationSeconds ?? (input.platform === 'TikTok' ? 60 : 360);
    const result = await this.generateJson(
      'كتابة سكربت عربي احترافي جاهز للإنتاج',
      `اكتب سكربتًا عربيًا أصليًا وجاهزًا للإنتاج.

الموضوع: ${input.topic}
الجمهور: ${input.audience}
المنصة: ${input.platform}
الأسلوب: ${input.tone ?? 'professional'}
المدة المطلوبة: ${duration} ثانية

قواعد إلزامية:
- ابدأ بخطاف قوي في الثواني الأولى.
- تجنب المقدمات العامة والحشو.
- ابنِ تسلسلًا قصصيًا واضحًا.
- اربط كل معلومة بالموضوع الحقيقي.
- أضف توجيهًا بصريًا لكل قسم.
- اختم بدعوة واحدة مناسبة لاتخاذ إجراء.
- أعد JSON صالحًا فقط بهذه البنية:
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
      provider: 'OpenAI',
      model: this.model,
      script: result.script ?? result,
    };
  }

  async optimize(input: OptimizeContentDto) {
    const result = await this.generateJson(
      'تحسين المحتوى للمنصة المستهدفة',
      `حلل المحتوى التالي وحسّنه لمنصة ${input.platform}.

العنوان: ${input.title}

المحتوى:
${input.content}

أنشئ خمسة عناوين قوية غير مضللة، ووصفًا محسنًا، وكلمات مفتاحية، ووسومًا، وأفكار صور مصغرة، ونسخة محسنة من المحتوى، وقائمة تحسينات عملية.

أعد JSON صالحًا فقط بهذه البنية:
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
      provider: 'OpenAI',
      model: this.model,
      optimization: result.optimization ?? result,
    };
  }

  async review(input: ReviewContentDto) {
    const result = await this.generateJson(
      'مراجعة جودة المحتوى',
      `راجع المحتوى التالي مراجعة تحريرية احترافية لمنصة ${input.platform}.

العنوان: ${input.title}

المحتوى:
${input.content}

قيّم من 100: الوضوح، والاحتفاظ بالمشاهد، والأصالة، وملاءمة المنصة، والنتيجة العامة. حدد نقاط القوة والمخاطر والتوصيات والأجزاء التي تحتاج إلى إعادة كتابة.

أعد JSON صالحًا فقط بهذه البنية:
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
      provider: 'OpenAI',
      model: this.model,
      review: result.review ?? result,
    };
  }

  async createProductionPackage(input: ProductionPackageDto) {
    const duration = input.durationSeconds ?? (input.platform === 'TikTok' ? 60 : 360);
    const result = await this.generateJson(
      'إنشاء حزمة إنتاج محتوى متكاملة',
      `أنشئ حزمة إنتاج عربية متكاملة وجاهزة للتنفيذ.

الموضوع: ${input.topic}
الجمهور: ${input.audience}
المنصة: ${input.platform}
الأسلوب: ${input.tone ?? 'professional'}
المدة: ${duration} ثانية

يجب أن تشمل: فكرة أصلية، عنوانًا، خطافًا، سكربتًا كاملًا، تقسيم المشاهد، التعليق الصوتي، التوجيه البصري، النصوص على الشاشة، الموسيقى والمؤثرات، أسلوب المونتاج، الصورة المصغرة، العنوان والوصف والوسوم، أصول الإنتاج المطلوبة، وقائمة فحص قبل النشر.

أعد JSON صالحًا فقط بهذه البنية:
{
  "idea": {},
  "script": {},
  "scenePlan": [],
  "productionPlan": {},
  "optimization": {},
  "qualityChecklist": []
}`,
    );

    return { success: true, provider: 'OpenAI', model: this.model, ...result };
  }

  private async generateJson(task: string, prompt: string): Promise<JsonRecord> {
    if (!this.client) {
      throw new ServiceUnavailableException({
        success: false,
        message: 'مفتاح OpenAI غير موجود. أضف OPENAI_API_KEY إلى ملف .env ثم أعد تشغيل السيرفر.',
      });
    }

    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions:
          'أنت محرك CreatorOS المتخصص في صناعة المحتوى. اكتب بالعربية الفصحى الطبيعية، وتجنب الحشو والقوالب العامة والتكرار. أعد JSON صالحًا فقط من دون Markdown.',
        input: `${task}\n\n${prompt}`,
        text: {
          format: { type: 'json_object' },
        },
      });

      const output = response.output_text?.trim();
      if (!output) {
        throw new Error('The OpenAI response was empty.');
      }

      return this.parseJson(output);
    } catch (error) {
      const details = error instanceof Error ? error.message : 'Unknown OpenAI error';
      throw new InternalServerErrorException({
        success: false,
        message: 'فشل محرك الذكاء الاصطناعي في إنشاء المحتوى.',
        provider: 'OpenAI',
        model: this.model,
        details,
      });
    }
  }

  private parseJson(value: string): JsonRecord {
    const cleaned = value
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned) as JsonRecord;
    } catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) {
        return JSON.parse(cleaned.slice(start, end + 1)) as JsonRecord;
      }
      throw new Error('The OpenAI response was not valid JSON.');
    }
  }

  private asRecord(value: unknown): JsonRecord {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? (value as JsonRecord)
      : {};
  }

  private asString(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  private asScore(value: unknown, fallback: number): number {
    const score = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : fallback;
  }
}