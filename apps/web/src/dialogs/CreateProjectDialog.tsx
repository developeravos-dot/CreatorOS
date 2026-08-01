import type { EnterprisePlatform } from "../enterprise-api";
import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface CreateProjectValues {
  name: string;
  description: string;
  platform: EnterprisePlatform;
}

interface CreateProjectDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  onClose: () => void;
  onSubmit: (
    values: CreateProjectValues,
  ) => void | Promise<void>;
}

export default function CreateProjectDialog(
  props: CreateProjectDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="إنشاء مشروع جديد"
      description="أدخل معلومات المشروع والمنصة المستهدفة."
      icon="▦"
      confirmLabel="إنشاء المشروع"
      cancelLabel="إلغاء"
      fields={[
        {
          name: "name",
          label: "اسم المشروع",
          required: true,
          placeholder: "مثال: قناة التقنية المستقبلية",
        },
        {
          name: "description",
          label: "وصف المشروع",
          type: "textarea",
          rows: 4,
          placeholder: "اكتب وصفًا مختصرًا للمشروع...",
        },
        {
          name: "platform",
          label: "المنصة",
          type: "select",
          required: true,
          initialValue: "Both",
          options: [
            { label: "YouTube", value: "YouTube" },
            { label: "TikTok", value: "TikTok" },
            {
              label: "YouTube + TikTok",
              value: "Both",
            },
          ],
        },
      ]}
      onClose={props.onClose}
      onSubmit={(values) =>
        props.onSubmit({
          name: (values.name ?? "").trim(),
          description: values.description?.trim() ?? "",
          platform: values.platform as EnterprisePlatform,
        })
      }
    />
  );
}
