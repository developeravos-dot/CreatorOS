# CreatorOS / AVOS Component Registry

## 1. الهدف

هذا السجل هو المرجع الرسمي لجميع المكونات البرمجية داخل CreatorOS / AVOS.

لا يجوز اعتماد أي مكوّن أو خدمة أو محرك أو وكيل
ما لم يكن مسجلًا هنا.

## 2. أنواع المكونات

القيم المسموحة:

- application
- module
- service
- engine
- agent
- library
- adapter
- gateway
- worker
- scheduler
- repository
- database
- event-handler
- api
- ui
- script

## 3. حقول كل مكوّن

كل مكوّن يجب أن يحتوي على:

- Component ID
- Component Name
- Component Type
- Domain
- Capability
- Description
- Owner
- Status
- Version
- Repository Path
- Dependencies
- Interfaces
- Events
- Data Ownership
- Security Classification
- Observability
- Test Status
- Documentation
- Human Approval Requirement

## 4. المكونات التأسيسية

### CMP-0001 — constitution-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.constitution-management

المسار:

constitution/AVOS-CONSTITUTION.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0002 — master-blueprint-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.blueprint-management

المسار:

architecture/MASTER-BLUEPRINT.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0003 — engineering-governance-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.architecture-validation

المسار:

governance/engineering/ENGINEERING-GOVERNANCE.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0004 — naming-standard-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.naming-validation

المسار:

standards/naming/NAMING-STANDARD.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0005 — domain-catalog-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.domain-catalog-management

المسار:

catalogs/domains/DOMAIN-CATALOG.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0006 — capability-catalog-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.capability-catalog-management

المسار:

catalogs/capabilities/CAPABILITY-CATALOG.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0007 — dependency-catalog-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.dependency-management

المسار:

catalogs/dependencies/DEPENDENCY-CATALOG.md

الحالة:

active

الإصدار:

1.0.0

---

### CMP-0008 — component-registry-document

النوع:

document

النطاق:

foundation

القدرة:

foundation.component-registry-management

المسار:

registry/components/COMPONENT-REGISTRY.md

الحالة:

active

الإصدار:

1.0.0

## 5. حالات المكونات

القيم المسموحة:

- proposed
- planned
- active
- paused
- deprecated
- retired
- future

## 6. قاعدة التسجيل

لا يعتبر أي مكوّن معتمدًا قبل:

1. ربطه بنطاق
2. ربطه بقدرة
3. تحديد نوعه
4. تحديد مالكه
5. تحديد إصداره
6. تسجيل تبعياته
7. توثيق واجهاته
8. تحديد حالته
9. اجتياز التحقق
