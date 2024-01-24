interface Props {
  name: string;
  registerOptions: RegisterOptions;
  title: string;
  error: FieldError;
  register: any;
}

import React from "react";
import { RegisterOptions, FieldError, UseFormRegister } from "react-hook-form";

const HookFormInput = ({
  register,
  name,
  registerOptions,
  error,
  title,
  ...props
}: Props) => {
  return (
    <tr>
      <td className="w-[400px] py-6">
        <label htmlFor={name}>{title}</label>
      </td>
      <td>
        <input
          {...register(name, registerOptions)}
          className={
            "outline-blue-200 px-4 border-2 border-neutral-300 rounded-lg py-1"
          }
          type="text"
          name={name}
          id={name}
          {...props}
        />
        <p className="text-red-700 font-semibold text-sm">
          {error[name]?.message}
        </p>
      </td>
    </tr>
  );
};

export default HookFormInput;
