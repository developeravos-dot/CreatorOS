import type {
  EnterpriseScript,
  ScriptStatus,
} from "../enterprise-api";

import { CreatorDialog } from "../components/dialogs/CreatorDialog";

export interface UpdateScriptStatusValues {
  status: ScriptStatus;
}

interface UpdateScriptStatusDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  script: EnterpriseScript | null;
  onClose: () => void;
  onSubmit: (
    values: UpdateScriptStatusValues,
  ) => void | Promise<void>;
}

export default function UpdateScriptStatusDialog(
  props: UpdateScriptStatusDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="تغيير مرحلة السكربت"
      description={
        props.script
          ? `تحديث مرحلة السكربت: ${props.script.title}`
          : "تحديث مرحلة السكربت."
      }
      icon="✎"
      confirmLabel="حفظ المرحلة"
      cancelLabel="إلغاء"
      fields={[
        {
          name: "status",
          label: "مرحلة السكربت",
          type: "select",
          required: true,
          initialValue: props.script?.status ?? "draft",
          options: [
            {
              label: "مسودة",
              value: "draft",
            },
            {
              label: "مراجعة",
              value: "review",
            },
            {
              label: "معتمد",
              value: "approved",
            },
            {
              label: "إنتاج",
              value: "production",
            },
          ],
        },
      ]}
      onClose={props.onClose}
      onSubmit={(values) =>
        props.onSubmit({
          status: values.status as ScriptStatus,
        })
      }
    />
  );
}
