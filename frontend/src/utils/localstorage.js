export const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    if (user !== undefined || user || user !== "undefined") {
      return JSON.parse(user);
    } else return false;
  } catch (error) {
    console.log(error, "get");
    return false;
  }
};

export const setUserInLocalStorage = (data) => {
  try {
    const stringified = JSON.stringify({ ...data });
    if (!stringified) return false;
    localStorage.setItem("user", stringified);
    return true;
  } catch (error) {
    console.log(error, "set");
    return false;
  }
};
