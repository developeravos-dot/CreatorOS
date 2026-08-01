import type { EnterpriseProject } from "../enterprise-api";
import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface CreateScriptValues {
  projectId: string;
  title: string;
  content: string;
}

interface CreateScriptDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  projects: EnterpriseProject[];
  onClose: () => void;
  onSubmit: (
    values: CreateScriptValues,
  ) => void | Promise<void>;
}

export default function CreateScriptDialog(
  props: CreateScriptDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="إنشاء سكربت جديد"
      description="اختر المشروع ثم أضف عنوان السكربت ومحتواه الأولي."
      icon="✎"
      confirmLabel="إنشاء السكربت"
      cancelLabel="إلغاء"
      fields={[
        {
          name: "projectId",
          label: "المشروع",
          type: "select",
          required: true,
          initialValue: props.projects[0]?.id ?? "",
          options: props.projects.map((project) => ({
            label: project.name,
            value: project.id,
          })),
        },
        {
          name: "title",
          label: "عنوان السكربت",
          required: true,
          placeholder: "اكتب عنوان السكربت",
        },
        {
          name: "content",
          label: "المحتوى الأولي",
          type: "textarea",
          rows: 7,
          placeholder: "اكتب محتوى السكربت هنا...",
        },
      ]}
      onClose={props.onClose}
      onSubmit={(values) =>
        props.onSubmit({
          projectId: values.projectId ?? "",
          title: (values.title ?? "").trim(),
          content: values.content ?? "",
        })
      }
    />
  );
}
