export const urlToBlobConverter = (d) => {
  var reader = new FileReader();
  reader.readAsDataURL(d);
  return new Promise((res, rej) => {
    reader.onload = (e) => {
      res(e.target.result);
    };
  });
};
