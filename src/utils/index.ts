export const parseId = (id: number | string): ID => {
  if (typeof id === "string") {
    return parseInt(id, 10) as any;
  }
  return id as any;
};
