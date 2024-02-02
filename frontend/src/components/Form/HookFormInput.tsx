type InputProps<TFormValues> = {
  name: Path<TFormValues>;
  register: any;
  rules?: RegisterOptions;
  errors?: FieldError;
  className?: string;
  placeholder?: string;
};

import { FieldError, Path, RegisterOptions } from "react-hook-form";
import ErrorDisplayComp from "./ErrorDisplayComp";
import { twMerge } from "tailwind-merge";

const HookFormInput = <TFormValues extends Record<string, unknown>>({
  register,
  name,
  rules,
  errors,
  className,
  placeholder,
}: InputProps<TFormValues>) => {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        {...register(name, rules)}
        className={twMerge(
          "rounded-md outline-none text-black w-[300px] px-2 py-1 border-2 mt-1",
          className
        )}
      />
      <ErrorDisplayComp error={errors} />
    </>
  );
};

export default HookFormInput;
