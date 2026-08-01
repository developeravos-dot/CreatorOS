import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface CreatePromptValues {
  name: string;
  purpose: string;
  prompt: string;
}

interface CreatePromptDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (
    values: CreatePromptValues,
  ) => void | Promise<void>;
}

export default function CreatePromptDialog(
  props: CreatePromptDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="إضافة قالب ذكي"
      description="احفظ قالبًا قابلًا لإعادة الاستخدام داخل CreatorOS."
      icon="✦"
      confirmLabel="حفظ القالب"
      cancelLabel="إلغاء"
      fields={[
        {
          name: "name",
          label: "اسم القالب",
          required: true,
          placeholder: "مثال: كاتب سكربت تعليمي",
        },
        {
          name: "purpose",
          label: "الغرض من القالب",
          placeholder: "اشرح متى يُستخدم هذا القالب",
        },
        {
          name: "prompt",
          label: "نص القالب",
          type: "textarea",
          rows: 8,
          required: true,
          placeholder: "اكتب تعليمات الذكاء الاصطناعي...",
        },
      ]}
      onClose={props.onClose}
      onSubmit={(values) =>
        props.onSubmit({
          name: values.name.trim(),
          purpose: values.purpose?.trim() ?? "",
          prompt: values.prompt.trim(),
        })
      }
    />
  );
}
