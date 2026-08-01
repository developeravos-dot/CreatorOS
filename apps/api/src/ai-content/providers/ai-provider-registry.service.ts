import { Injectable } from '@nestjs/common';
import { AiTextProvider } from './ai-provider.contracts';
import { OllamaTextProvider } from './ollama-text.provider';
import { OpenAiTextProvider } from './openai-text.provider';

@Injectable()
export class AiProviderRegistryService {
  private readonly providers = new Map<string, AiTextProvider>();

  constructor(
    openAiProvider: OpenAiTextProvider,
    ollamaProvider: OllamaTextProvider,
  ) {
    this.register(openAiProvider);
    this.register(ollamaProvider);
  }

  register(provider: AiTextProvider): void {
    this.providers.set(provider.id.toLowerCase(), provider);
  }

  get(providerId: string): AiTextProvider | undefined {
    return this.providers.get(providerId.trim().toLowerCase());
  }

  list(): AiTextProvider[] {
    return [...this.providers.values()];
  }
}