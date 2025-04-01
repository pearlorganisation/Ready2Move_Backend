export const safeParse = (value) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    return value;
  }
};
