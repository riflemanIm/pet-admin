export default function convert(name: string, value: string): any {
  switch (name) {
    case "sortOrder":
    case "medicalnetActionsId":
      return value ? Number(value) : null;
    default:
      return value;
  }
}
