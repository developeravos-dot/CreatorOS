# CreatorOS / AVOS Naming Standard

## 1. الهدف

توحيد أسماء الملفات والمجلدات والخدمات والقدرات والأحداث
وواجهات البرمجة والمتغيرات داخل CreatorOS / AVOS.

## 2. الملفات والمجلدات

تستخدم صيغة:

lowercase-kebab-case

أمثلة:

- knowledge-engine
- agent-registry
- production-workflow.service.ts
- audience-intelligence.module.ts

## 3. TypeScript

- Classes: PascalCase
- Interfaces: PascalCase
- Types: PascalCase
- Functions: camelCase
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: lowercase-kebab-case

أمثلة:

- KnowledgeEngine
- AgentRegistryService
- ProductionWorkflow
- createContentProject
- MAX_RETRY_COUNT

## 4. النطاقات

صيغة اسم النطاق:

domain-name

أمثلة:

- core-platform
- enterprise-knowledge
- digital-organization
- intelligence
- production
- ipos

## 5. القدرات

صيغة معرف القدرة:

domain.capability-name

أمثلة:

- knowledge.semantic-search
- intelligence.trend-analysis
- production.video-generation
- ipos.licensing-management

## 6. الخدمات

صيغة اسم الخدمة:

domain-capability-service

أمثلة:

- knowledge-semantic-search-service
- intelligence-trend-analysis-service
- production-video-generation-service

## 7. الوكلاء

صيغة معرف الوكيل:

domain.agent-name

أمثلة:

- research.trend-researcher
- production.script-writer
- quality.content-reviewer

## 8. الأحداث

صيغة الحدث:

domain.entity.action.v1

أمثلة:

- production.video.created.v1
- production.video.approved.v1
- knowledge.document.indexed.v1
- agent.task.completed.v1

## 9. واجهات البرمجة

صيغة المسار:

/api/v1/{domain}/{resource}

أمثلة:

- /api/v1/knowledge/documents
- /api/v1/production/projects
- /api/v1/agents/tasks

## 10. متغيرات البيئة

صيغة متغير البيئة:

CREATOROS_{DOMAIN}_{SETTING}

أمثلة:

- CREATOROS_DATABASE_URL
- CREATOROS_EVENTS_BROKER_URL
- CREATOROS_LOG_LEVEL
- CREATOROS_STORAGE_PATH

## 11. الإصدارات

- APIs: v1
- Events: v1
- Schemas: 1.0.0
- Platform: MAJOR.MINOR.PATCH

## 12. الممنوعات

يمنع استخدام:

- المسافات في أسماء الملفات
- أسماء غير واضحة مثل temp أو test2 أو final-new
- اختصارات غير موثقة
- خلط PascalCase وsnake_case في الملفات
- أسماء عامة مثل service أو manager دون نطاق واضح
