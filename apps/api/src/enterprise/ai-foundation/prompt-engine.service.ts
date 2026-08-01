import { Injectable } from '@nestjs/common';
import { AiTaskType } from './dto/execute-ai-task.dto';

interface PromptTemplate {
  taskType: AiTaskType;
  systemPrompt: string;
  instruction: string;
}

@Injectable()
export class PromptEngineService {
  private readonly templates: Record<
    AiTaskType,
    PromptTemplate
  > = {
    idea: {
      taskType: 'idea',
      systemPrompt:
        'You are the CreatorOS Idea Intelligence Agent. Generate original, commercially useful and executable ideas. Avoid generic repetition.',
      instruction:
        'Generate and evaluate strong ideas for the following request:',
    },
    research: {
      taskType: 'research',
      systemPrompt:
        'You are the CreatorOS Research Agent. Organize findings, assumptions, uncertainties, evidence needs and practical conclusions.',
      instruction:
        'Research and analyze the following subject:',
    },
    writing: {
      taskType: 'writing',
      systemPrompt:
        'You are the CreatorOS Professional Writing Agent. Produce clear, structured and audience-appropriate writing.',
      instruction:
        'Write high-quality content based on the following request:',
    },
    script: {
      taskType: 'script',
      systemPrompt:
        'You are the CreatorOS Scriptwriting Agent. Create engaging scripts with a hook, structured progression, retention devices and a strong ending.',
      instruction:
        'Create a production-ready script for:',
    },
    code: {
      taskType: 'code',
      systemPrompt:
        'You are the CreatorOS Software Engineering Agent. Produce safe, maintainable and testable code. Explain important assumptions inside code comments.',
      instruction:
        'Solve the following software engineering task:',
    },
    analysis: {
      taskType: 'analysis',
      systemPrompt:
        'You are the CreatorOS Analysis Agent. Examine the subject systematically, identify risks, opportunities, tradeoffs and recommendations.',
      instruction:
        'Analyze the following input:',
    },
    translation: {
      taskType: 'translation',
      systemPrompt:
        'You are the CreatorOS Translation Agent. Preserve meaning, tone, terminology and formatting.',
      instruction:
        'Translate the following content:',
    },
    vision: {
      taskType: 'vision',
      systemPrompt:
        'You are the CreatorOS Visual Intelligence Agent. Analyze visual material accurately and describe relevant production, design and content insights.',
      instruction:
        'Analyze the supplied visual task:',
    },
    general: {
      taskType: 'general',
      systemPrompt:
        'You are CreatorOS Intelligence. Provide accurate, useful and structured responses.',
      instruction:
        'Complete the following task:',
    },
  };

  buildPrompt(input: {
    taskType: AiTaskType;
    userInput: string;
    language?: string;
    customSystemPrompt?: string;
    variables?: Record<string, unknown>;
  }) {
    const template =
      this.templates[input.taskType] ??
      this.templates.general;

    const variables =
      input.variables &&
      Object.keys(input.variables).length > 0
        ? `\n\nContext variables:\n${JSON.stringify(
            input.variables,
            null,
            2,
          )}`
        : '';

    const language =
      input.language?.trim()
        ? `\n\nRequired output language: ${input.language.trim()}`
        : '';

    return {
      systemPrompt:
        input.customSystemPrompt?.trim() ||
        template.systemPrompt,
      prompt:
        `${template.instruction}\n\n${input.userInput.trim()}` +
        variables +
        language,
      template: template.taskType,
    };
  }

  listTemplates() {
    return Object.values(this.templates).map(
      (template) => ({
        taskType: template.taskType,
        systemPrompt: template.systemPrompt,
        instruction: template.instruction,
      }),
    );
  }

  getStatus() {
    return {
      success: true,
      templates: Object.keys(this.templates).length,
      taskTypes: Object.keys(this.templates),
    };
  }
}
