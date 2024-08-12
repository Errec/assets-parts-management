export const toggleFolder = (id: string, setOpenFolders: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  