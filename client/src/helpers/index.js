export const truncate = (str) => {
  if (str.length > 15 && window.innerWidth <= 600) {
    return str.slice(0, 15) + "...";
  }

  return str;
};
