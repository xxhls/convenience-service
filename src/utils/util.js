export const isImage = (type) => {
  const imageTypes = ["jpg", "png", "jpeg"];
  const value = type.toLocaleLowerCase();
  return imageTypes.includes(value);
};
