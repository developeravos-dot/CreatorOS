import type {
  EnterpriseProject,
  ProjectStatus,
} from "../enterprise-api";

import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface UpdateProjectStatusValues {
  status: ProjectStatus;
}

interface UpdateProjectStatusDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  project: EnterpriseProject | null;
  onClose: () => void;
  onSubmit: (
    values: UpdateProjectStatusValues,
  ) => void | Promise<void>;
}

export default function UpdateProjectStatusDialog(
  props: UpdateProjectStatusDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="تغيير حالة المشروع"
      description={
        props.project
          ? `تحديث حالة المشروع: ${props.project.name}`
          : "تحديث حالة المشروع."
      }
      icon="◈"
      confirmLabel="حفظ الحالة"
      cancelLabel="إلغاء"
      fields={[
        {
          name: "status",
          label: "حالة المشروع",
          type: "select",
          required: true,
          initialValue: props.project?.status ?? "planning",
          options: [
            {
              label: "تخطيط",
              value: "planning",
            },
            {
              label: "نشط",
              value: "active",
            },
            {
              label: "متوقف مؤقتًا",
              value: "paused",
            },
            {
              label: "مكتمل",
              value: "completed",
            },
          ],
        },
      ]}
      onClose={props.onClose}
      onSubmit={(values) =>
        props.onSubmit({
          status: values.status as ProjectStatus,
        })
      }
    />
  );
}
