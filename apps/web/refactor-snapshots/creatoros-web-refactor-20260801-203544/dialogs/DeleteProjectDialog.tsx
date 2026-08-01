import type { EnterpriseProject } from "../enterprise-api";

import { CreatorDialog } from "../components/dialogs/CreatorDialog";

interface DeleteProjectDialogProps {
  open: boolean;
  busy: boolean;
  error?: string;
  project: EnterpriseProject | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export default function DeleteProjectDialog(
  props: DeleteProjectDialogProps,
) {
  return (
    <CreatorDialog
      open={props.open}
      busy={props.busy}
      error={props.error}
      title="حذف المشروع"
      description={
        props.project
          ? `سيتم حذف المشروع "${props.project.name}" وجميع السكربتات والمواعيد التابعة له. لا يمكن التراجع عن هذه العملية.`
          : "سيتم حذف المشروع وجميع البيانات التابعة له."
      }
      icon="!"
      danger
      confirmLabel="حذف المشروع"
      cancelLabel="إلغاء"
      onClose={props.onClose}
      onSubmit={props.onConfirm}
    />
  );
}
