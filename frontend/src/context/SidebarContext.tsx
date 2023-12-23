import { createContext, useCallback, useContext, useState } from "react";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};
const SidebarContext = createContext<Props>({
  isModalOpen: false,
  setIsModalOpen: () => {},
  isSidebarOpen: false,
  toggleSidebar: () => {},
});

export const SidebarContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth < 768 ? false : true
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, [isSidebarOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
