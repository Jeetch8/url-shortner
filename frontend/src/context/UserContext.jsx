import { useContext, createContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { dataRef, doFetch } = useFetch({
    url: base_url + "/user/me",
    authorized: true,
    method: "GET",
    onSuccess: (data) => {
      setUser(data.user);
    },
  });

  useEffect(() => {
    doFetch();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
