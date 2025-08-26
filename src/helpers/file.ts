import axios from "axios";

export function extractExtensionFrom(filename: string): string | null {
  if (!filename) {
    return null;
  }
  const regex = /(?:\.([^.]+))?$/;
  const res = regex.exec(filename);
  return Array.isArray(res) && (res.length > 1) ? res[1] : null;
}

export const uploadToServer = async (uri: string, params: Record<string, string | Blob>) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    console.log(`${key}: ${value}`);
    formData.append(key, value);
  }

  return axios.put(uri, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAvararServer = async (uri: string): Promise<void> => {
  await axios.delete(uri);
};
