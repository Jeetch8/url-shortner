export const getTitleOfUrl = async (url) => {
  return await fetch(`https://crossorigin.me/${url}`)
    .then((response) => response.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const title = doc.querySelectorAll("title")[0];
      return title.innerText;
    });
};
