export const truncate = (str, len) => {
  let truncLen = len || 15;
  if (str.length > truncLen && window.innerWidth <= 600) {
    return str.slice(0, truncLen) + "...";
  }

  return str;
};
