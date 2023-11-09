export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};
export const getBase64 = (file) => {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    await reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
export function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
export const renderOptions = (arr) => {
  let result = [];
  if (arr) {
    result = arr?.map((opt) => {
      return {
        value: opt,
        label: opt,
      };
    });
  }
  result.push({
    label: "Thêm loại",
    value: "add-type",
  });
  return result;
};
export const convertPrice = (price) => {
  try {
    const result = price?.toLocaleString().replace(",", ".");
    return `${result} VND`;
  } catch (err) {
    return null;
  }
};
