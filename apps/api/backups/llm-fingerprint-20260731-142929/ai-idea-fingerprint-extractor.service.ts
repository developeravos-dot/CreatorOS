import { Injectable } from '@nestjs/common';

export interface IdeaFingerprint {
  itemIndex: number;
  title: string;
  domain: string;
  audience: string;
  contentMechanism: string;
  aiRole: string;
  valueProposition: string;
  monetization: string;
  productionStyle: string;
  contentFormat: string;
  goal: string;
}

interface OllamaGenerateResponse {
  response?: string;
  done?: boolean;
}

@Injectable()
export class AiIdeaFingerprintExtractorService {
  private readonly ollamaUrl =
    process.env.OLLAMA_BASE_URL?.trim() ||
    'http://localhost:11434';

  private readonly model =
    process.env.CREATOROS_FINGERPRINT_MODEL?.trim() ||
    'qwen2.5:7b';

  async extract(
    content: string,
  ): Promise<IdeaFingerprint[]> {
    const items = this.extractItems(content);

    if (items.length === 0) {
      return [];
    }

    try {
      const fingerprints =
        await this.extractWithLlm(items);

      if (
        fingerprints.length ===
        items.length
      ) {
        return fingerprints;
      }

      return this.mergeMissingFingerprints(
        items,
        fingerprints,
      );
    } catch {
      return items.map((item) =>
        this.createFallbackFingerprint(
          item.index,
          item.title,
          item.body,
        ),
      );
    }
  }

  private async extractWithLlm(
    items: Array<{
      index: number;
      title: string;
      body: string;
    }>,
  ): Promise<IdeaFingerprint[]> {
    const prompt = `
أنت محرك CreatorOS لاستخراج البصمة الدلالية للأفكار.

حلل كل فكرة بناءً على معناها الفعلي، وليس بمجرد الكلمات المشتركة.

أعد JSON صالحًا فقط، بدون Markdown وبدون شرح، بالشكل:

{
  "fingerprints": [
    {
      "itemIndex": 1,
      "title": "اسم مختصر",
      "domain": "المجال المحدد",
      "audience": "الجمهور المحدد",
      "contentMechanism": "كيف يعمل المحتوى فعليًا",
      "aiRole": "الدور المحدد للذكاء الاصطناعي",
      "valueProposition": "القيمة الفريدة للمستخدم",
      "monetization": "نموذج الربح",
      "productionStyle": "أسلوب الإنتاج",
      "contentFormat": "صيغة المحتوى",
      "goal": "الهدف الأساسي"
    }
  ]
}

القواعد:
1. لا تستخدم كلمات عامة وحدها مثل تعليم أو تحليل.
2. عبّر عن كل بُعد بجملة قصيرة محددة.
3. استخرج الاختلاف الحقيقي بين الأفكار.
4. لا تخترع تفاصيل غير موجودة.
5. عند غياب بُعد، استخدم "غير محدد".
6. حافظ على itemIndex كما هو.
7. أعد جميع العناصر دون حذف.

الأفكار:

${items
  .map(
    (item) =>
      `${item.index}. ${item.title}\n${item.body}`,
  )
  .join('\n\n')}
`.trim();

    const response = await fetch(
      `${this.ollamaUrl}/api/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.1,
            num_predict: 2200,
          },
        }),
        signal:
          AbortSignal.timeout(60000),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Ollama fingerprint request failed: ${response.status}`,
      );
    }

    const payload =
      (await response.json()) as
        OllamaGenerateResponse;

    const raw =
      payload.response?.trim();

    if (!raw) {
      throw new Error(
        'Ollama returned an empty fingerprint response.',
      );
    }

    const parsed =
      this.parseJsonResponse(raw);

    const fingerprints =
      Array.isArray(parsed)
        ? parsed
        : Array.isArray(
              (
                parsed as {
                  fingerprints?: unknown;
                }
              ).fingerprints,
            )
          ? (
              parsed as {
                fingerprints:
                  unknown[];
              }
            ).fingerprints
          : [];

    return fingerprints
      .map((value) =>
        this.normalizeFingerprint(
          value,
        ),
      )
      .filter(
        (
          value,
        ): value is IdeaFingerprint =>
          value !== null,
      );
  }

  private parseJsonResponse(
    value: string,
  ): unknown {
    const cleaned = value
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const firstBrace =
        cleaned.indexOf('{');

      const lastBrace =
        cleaned.lastIndexOf('}');

      if (
        firstBrace >= 0 &&
        lastBrace > firstBrace
      ) {
        return JSON.parse(
          cleaned.slice(
            firstBrace,
            lastBrace + 1,
          ),
        );
      }

      throw new Error(
        'Invalid LLM fingerprint JSON.',
      );
    }
  }

  private normalizeFingerprint(
    value: unknown,
  ): IdeaFingerprint | null {
    if (
      !value ||
      typeof value !== 'object'
    ) {
      return null;
    }

    const record =
      value as Record<
        string,
        unknown
      >;

    const itemIndex =
      Number(record.itemIndex);

    if (
      !Number.isInteger(itemIndex) ||
      itemIndex <= 0
    ) {
      return null;
    }

    return {
      itemIndex,
      title:
        this.toText(record.title),
      domain:
        this.toText(record.domain),
      audience:
        this.toText(record.audience),
      contentMechanism:
        this.toText(
          record.contentMechanism,
        ),
      aiRole:
        this.toText(record.aiRole),
      valueProposition:
        this.toText(
          record.valueProposition,
        ),
      monetization:
        this.toText(
          record.monetization,
        ),
      productionStyle:
        this.toText(
          record.productionStyle,
        ),
      contentFormat:
        this.toText(
          record.contentFormat,
        ),
      goal:
        this.toText(record.goal),
    };
  }

  private mergeMissingFingerprints(
    items: Array<{
      index: number;
      title: string;
      body: string;
    }>,
    fingerprints: IdeaFingerprint[],
  ): IdeaFingerprint[] {
    const byIndex =
      new Map(
        fingerprints.map(
          (fingerprint) => [
            fingerprint.itemIndex,
            fingerprint,
          ],
        ),
      );

    return items.map((item) => {
      const existing =
        byIndex.get(item.index);

      if (existing) {
        return existing;
      }

      return this.createFallbackFingerprint(
        item.index,
        item.title,
        item.body,
      );
    });
  }

  private createFallbackFingerprint(
    itemIndex: number,
    title: string,
    body: string,
  ): IdeaFingerprint {
    const normalized =
      this.normalizeText(
        `${title} ${body}`,
      );

    return {
      itemIndex,
      title:
        title ||
        `Idea ${itemIndex}`,
      domain:
        this.extractPhrase(
          normalized,
          [
            /(?:مجال|حول|يركز على)\s+(.{3,50})/,
          ],
        ),
      audience:
        this.extractPhrase(
          normalized,
          [
            /(?:للجمهور|الجمهور|لطلاب|للاطفال|للشركات|للمسافرين|للمصممين|للمشاهدين)\s+(.{3,50})/,
          ],
        ),
      contentMechanism:
        this.extractPhrase(
          normalized,
          [
            /(?:يعتمد على|يستخدم|يقدم|ينشئ)\s+(.{3,80})/,
          ],
        ),
      aiRole:
        normalized.includes(
          'الذكاء الاصطناعي',
        )
          ? this.extractPhrase(
              normalized,
              [
                /الذكاء الاصطناعي\s+(?:ل|في|من اجل)?\s*(.{3,80})/,
              ],
            )
          : 'غير محدد',
      valueProposition:
        this.extractPhrase(
          normalized,
          [
            /(?:يساعد|يساهم|يمكن)\s+(.{3,80})/,
          ],
        ),
      monetization:
        this.detectMonetization(
          normalized,
        ),
      productionStyle:
        this.detectProductionStyle(
          normalized,
        ),
      contentFormat:
        this.detectContentFormat(
          normalized,
        ),
      goal:
        this.detectGoal(normalized),
    };
  }

  private extractItems(
    content: string,
  ): Array<{
    index: number;
    title: string;
    body: string;
  }> {
    const normalizedContent =
      content.replace(/\r/g, '');

    const numberedPattern =
      /(?:^|\n)\s*(\d{1,3})[\.\-\)]\s+([\s\S]*?)(?=(?:\n\s*\d{1,3}[\.\-\)]\s+)|$)/g;

    const items: Array<{
      index: number;
      title: string;
      body: string;
    }> = [];

    let match:
      RegExpExecArray | null;

    while (
      (match =
        numberedPattern.exec(
          normalizedContent,
        )) !== null
    ) {
      const index =
        Number(match[1]);

      const raw =
        (match[2] ?? '').trim();

      if (!raw) {
        continue;
      }

      const title =
        this.extractTitle(raw);

      items.push({
        index,
        title,
        body: raw,
      });
    }

    if (items.length > 0) {
      return items;
    }

    return normalizedContent
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(
        (part) =>
          part.length >= 40,
      )
      .map((part, index) => ({
        index: index + 1,
        title:
          this.extractTitle(part),
        body: part,
      }));
  }

  private extractTitle(
    raw: string,
  ): string {
    const boldTitle =
      raw.match(
        /(?:\*\*|__)(.*?)(?:\*\*|__)/,
      );

    if (boldTitle?.[1]) {
      return boldTitle[1].trim();
    }

    const colonIndex =
      raw.indexOf(':');

    if (
      colonIndex > 0 &&
      colonIndex <= 120
    ) {
      return raw
        .slice(0, colonIndex)
        .trim();
    }

    return (
      raw
        .split('\n')[0]
        ?.slice(0, 120)
        .trim() ?? ''
    );
  }

  private toText(
    value: unknown,
  ): string {
    if (
      typeof value !== 'string'
    ) {
      return 'غير محدد';
    }

    const normalized =
      value.trim();

    return normalized ||
      'غير محدد';
  }

  private normalizeText(
    value: string,
  ): string {
    return value
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractPhrase(
    value: string,
    patterns: RegExp[],
  ): string {
    for (const pattern of patterns) {
      const match =
        value.match(pattern);

      if (match?.[1]) {
        return match[1]
          .trim()
          .slice(0, 100);
      }
    }

    return 'غير محدد';
  }

  private detectMonetization(
    value: string,
  ): string {
    if (/اشتراك|عضويه/.test(value)) {
      return 'اشتراكات';
    }

    if (/رعايات|اعلانات/.test(value)) {
      return 'إعلانات ورعايات';
    }

    if (/عموله|افلييت/.test(value)) {
      return 'تسويق بالعمولة';
    }

    if (/دورات|منتجات رقميه/.test(value)) {
      return 'منتجات رقمية';
    }

    if (/ترخيص|حقوق/.test(value)) {
      return 'ترخيص المحتوى';
    }

    return 'غير محدد';
  }

  private detectProductionStyle(
    value: string,
  ): string {
    if (/سينمائي|واقعي/.test(value)) {
      return 'إنتاج سينمائي';
    }

    if (/رسوم متحركه|انيميشن|انمي/.test(value)) {
      return 'رسوم متحركة';
    }

    if (/مقدم افتراضي|شخصيه افتراضيه/.test(value)) {
      return 'مقدم افتراضي';
    }

    if (/تلقائي|اتمته/.test(value)) {
      return 'إنتاج آلي';
    }

    return 'غير محدد';
  }

  private detectContentFormat(
    value: string,
  ): string {
    if (/فيديوهات قصيره|شورتس/.test(value)) {
      return 'فيديو قصير';
    }

    if (/بث مباشر|لايف/.test(value)) {
      return 'بث مباشر';
    }

    if (/حلقات|سلسله/.test(value)) {
      return 'سلسلة حلقات';
    }

    if (/وثائقي/.test(value)) {
      return 'وثائقي';
    }

    return 'غير محدد';
  }

  private detectGoal(
    value: string,
  ): string {
    if (/تعليم|تدريب|شرح/.test(value)) {
      return 'التعليم';
    }

    if (/ترفيه|تشويق|متعه/.test(value)) {
      return 'الترفيه';
    }

    if (/بيع|مبيعات/.test(value)) {
      return 'التحويل التجاري';
    }

    if (/توعيه|معلومات|اخبار/.test(value)) {
      return 'التوعية والمعلومات';
    }

    if (/تحسين|رفع الكفاءه/.test(value)) {
      return 'تحسين الأداء';
    }

    return 'غير محدد';
  }
}
