import React, { useRef, useState, ChangeEvent } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';

interface EditableInputProps {
  defaultValue: string;
}

const EditableInput: React.FC<EditableInputProps> = ({ defaultValue }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [text, setText] = useState(defaultValue);
  const inputRef = useRef<HTMLParagraphElement>(null);

  const toggleInputVisiblity = (value?: boolean) => {
    if (value === true) {
      setIsInputVisible(true);
      inputRef.current?.focus();
    } else if (value === false) {
      setIsInputVisible(false);
    } else {
      setIsInputVisible((prev) => {
        if (prev === false) {
          inputRef.current?.focus();
          return true;
        } else {
          return false;
        }
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLParagraphElement>) => {
    setText(e.target.textContent || '');
  };

  return (
    <div className="flex items-baseline gap-x-2">
      <p
        style={{
          border: '1px solid',
          borderColor: isInputVisible ? 'black' : 'transparent',
        }}
        className="py-2 px-4 mr-2 outline-none rounded-md"
        contentEditable={isInputVisible}
        onInput={handleChange}
        ref={inputRef}
      >
        {text}
      </p>
      <button
        className="bg-stone-200 rounded-md px-1 py-1"
        onClick={() => toggleInputVisiblity()}
      >
        {isInputVisible ? <RxCross2 /> : <FiEdit2 />}
      </button>
    </div>
  );
};

export default EditableInput;
