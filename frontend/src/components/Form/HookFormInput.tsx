type InputProps = {
  fieldName: string;
  register: any;
  fieldRules?: RegisterOptions;
  errors: FieldError | undefined;
  inputClassName?: string;
  placeholder?: string;
};

import { FieldError, Path, RegisterOptions } from "react-hook-form";
import ErrorDisplayComp from "./ErrorDisplayComp";
import { twMerge } from "tailwind-merge";

const HookFormInput = ({
  register,
  fieldName,
  fieldRules,
  errors,
  inputClassName,
  placeholder,
}: InputProps) => {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        {...register(fieldName, fieldRules)}
        className={twMerge(
          "rounded-md outline-none text-black w-[300px] px-2 py-1 border-2 mt-1",
          inputClassName
        )}
        id={fieldName}
        name={fieldName}
      />
      <ErrorDisplayComp error={errors} />
    </>
  );
};

export default HookFormInput;
