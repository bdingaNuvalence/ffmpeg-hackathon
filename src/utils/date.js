export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  let m = (date.getMonth() + 1).toString();
  let d = date.getDate().toString();
  const y = date.getFullYear();

  if (m.length < 2) {
    m = `0${m}`;
  }
  if (d.length < 2) {
    d = `0${d}`;
  }

  return [y, m, d].join('-');
};
