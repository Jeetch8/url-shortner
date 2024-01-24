import { useCallback, useState } from "react";

const oldSchoolCopy = (text: string) => {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
};

const useCopyToClipboard = () => {
  const [value, setValue] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    const copyText = async () => {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator?.clipboard?.writeText(text);
          setValue(text);
        } else {
          throw new Error("Write text not supported");
        }
      } catch (error) {
        setValue(text);
        oldSchoolCopy(text);
      }
    };
    await copyText();
  }, []);

  return { value, copyToClipboard };
};

export default useCopyToClipboard;
