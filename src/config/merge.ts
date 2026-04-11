import { createDefu } from "defu";

export const merge = createDefu((obj, key, value) => {
  // 只针对 increments 做覆盖
  if (key === "increments" && Array.isArray(obj[key]) && Array.isArray(value)) {
    obj[key] = value; // 直接覆盖
    return true;
  }
});
