import { Injectable } from '@nestjs/common';
import type {
  DraftPatentClaim,
  InventiveMechanism,
} from '../models/novelty-v3.models';

@Injectable()
export class DraftPatentClaimGeneratorEngine {
  generate(
    mechanisms: InventiveMechanism[],
    maximumClaims: number,
    includeSystemClaims: boolean,
    includeMethodClaims: boolean,
  ): DraftPatentClaim[] {
    const claims: DraftPatentClaim[] = [];
    let claimNumber = 1;

    const primary = mechanisms[0];

    if (primary && includeSystemClaims) {
      claims.push({
        claimNumber,
        type: 'independent-system',
        text:
          `نظام حاسوبي لتكوين وتنفيذ مجموعة شراء ديناميكية، يشتمل على: ` +
          `واجهة تستقبل طلبات شراء فردية تتضمن قيودًا متعددة؛ ` +
          `محرك توحيد يحول الطلبات إلى تمثيل معياري؛ ` +
          `محرك توافق يحسب توافق الطلبات وفق الكمية والسعر والوقت والموقع؛ ` +
          `محرك تكوين ينشئ مجموعة شراء تحقق شرط مورد محدد؛ ` +
          `ومحرك تخصيص يحدد حصة والتزام كل عضو، ` +
          `بحيث ينتج النظام مجموعة قابلة للتنفيذ من طلبات لا يحقق أي منها منفردًا شرط المورد.`,
        supportElements: [
          ...primary.inputs,
          ...primary.processingSteps,
          primary.technicalEffect,
        ],
      });

      claimNumber += 1;
    }

    if (primary && includeMethodClaims) {
      claims.push({
        claimNumber,
        type: 'independent-method',
        text:
          `طريقة منفذة بواسطة حاسوب لتكوين مجموعة شراء، تشمل: ` +
          `استقبال مجموعة طلبات فردية؛ ` +
          `استخراج قيود من كل طلب؛ ` +
          `حساب درجات توافق بين الطلبات؛ ` +
          `توليد مجموعات مرشحة؛ ` +
          `تقييم قابلية تنفيذ كل مجموعة بالنسبة إلى شرط مورد؛ ` +
          `اختيار مجموعة مرشحة؛ ` +
          `وتخصيص كمية والتزام لكل عضو قبل إرسال طلب مجمع إلى المورد.`,
        supportElements: [
          ...primary.processingSteps,
          ...primary.outputs,
        ],
      });

      claimNumber += 1;
    }

    for (const mechanism of mechanisms) {
      if (claims.length >= maximumClaims) {
        break;
      }

      const parentClaim = claims[0]?.claimNumber ?? 1;

      claims.push({
        claimNumber,
        type: 'dependent',
        dependsOn: parentClaim,
        text:
          `النظام وفقًا للمطالبة ${parentClaim}، حيث يكون محرك المعالجة مهيأً لتنفيذ ${mechanism.mechanism}، بما يحقق ${mechanism.technicalEffect}`,
        supportElements: [
          mechanism.name,
          ...mechanism.defensibility,
        ],
      });

      claimNumber += 1;

      for (const step of mechanism.processingSteps.slice(0, 2)) {
        if (claims.length >= maximumClaims) {
          break;
        }

        claims.push({
          claimNumber,
          type: 'dependent',
          dependsOn: parentClaim,
          text:
            `النظام وفقًا للمطالبة ${parentClaim}، حيث يشتمل التنفيذ على خطوة ${step}.`,
          supportElements: [
            mechanism.name,
            step,
          ],
        });

        claimNumber += 1;
      }
    }

    return claims.slice(
      0,
      Math.max(1, Math.min(maximumClaims, 20)),
    );
  }
}
