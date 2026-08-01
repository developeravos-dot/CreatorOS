import type {
  EnterprisePlatform,
  EnterpriseProject,
} from "../enterprise-api";

import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface ScheduleContentValues {
  projectId: string;
  title: string;
  scheduledAt: string;
  platform: EnterprisePlatform;
}

interface ScheduleContentDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  projects: EnterpriseProject[];
  onClose: () => void;
  onSubmit: (
    values: ScheduleContentValues,
  ) => void | Promise<void>;
}

function defaultScheduleDate() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
}

export default function ScheduleContentDialog(
  props: ScheduleContentDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="جدولة محتوى"
      description="حدد المشروع والمنصة وموعد النشر."
      icon="▣"
      confirmLabel="حفظ الموعد"
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
          label: "عنوان المحتوى",
          required: true,
          placeholder: "اكتب عنوان المحتوى المجدول",
        },
        {
          name: "scheduledAt",
          label: "موعد النشر",
          type: "datetime-local",
          required: true,
          initialValue: defaultScheduleDate(),
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
          projectId: values.projectId ?? "",
          title: (values.title ?? "").trim(),
          scheduledAt: values.scheduledAt ?? "",
          platform: values.platform as EnterprisePlatform,
        })
      }
    />
  );
}
