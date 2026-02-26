export const getSizeName = (size: string) => {
  switch (size.toLowerCase()) {
    case "12oz":
      return "S";
    default:
      return "L";
  }
};
