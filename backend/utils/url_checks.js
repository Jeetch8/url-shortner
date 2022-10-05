const isUrlValid = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

module.exports = { isUrlValid };
