interface TableRowRecordProps {
  randomId: string | null;
  createdAt: number;
  updatedAt: number | null;
  isEditing?: boolean | null;
}
interface CustomField extends TableRowRecordProps {
  label: string | null;
  field: string | null;
  type: string | null;
  value: string | null;
  defaultValue: string | null;
  required: boolean | null;
}
interface FormState {
  tags: { value: string }[];
  fields: CustomField[];
}
