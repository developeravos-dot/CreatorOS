import type { EnterpriseScript } from "../enterprise-api";

import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface EditScriptValues {
  title: string;
  content: string;
}

interface EditScriptDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  script: EnterpriseScript | null;
  onClose: () => void;
  onSubmit: (
    values: EditScriptValues,
  ) => void | Promise<void>;
}

export default function EditScriptDialog(
  props: EditScriptDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="تعديل السكربت"
      description={
        props.script
          ? `تحرير السكربت: ${props.script.title}`
          : "تحرير السكربت."
      }
      icon="✎"
      confirmLabel="حفظ التعديلات"
      cancelLabel="إلغاء"
      fields={[
        {
          name: "title",
          label: "عنوان السكربت",
          required: true,
          initialValue: props.script?.title ?? "",
          placeholder: "اكتب عنوان السكربت",
        },
        {
          name: "content",
          label: "محتوى السكربت",
          type: "textarea",
          rows: 10,
          initialValue: props.script?.content ?? "",
          placeholder: "اكتب محتوى السكربت...",
        },
      ]}
      onClose={props.onClose}
      onSubmit={(values) =>
        props.onSubmit({
          title: values.title.trim(),
          content: values.content ?? "",
        })
      }
    />
  );
}
