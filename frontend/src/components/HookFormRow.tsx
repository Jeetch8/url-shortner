interface Props {
  name: string;
  registerOptions: RegisterOptions;
  title: string;
  error: FieldError;
  register: any;
}

import { RegisterOptions, FieldError } from "react-hook-form";

const HookFormRow = ({
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
        <p className="text-red-700 font-semibold text-sm">{error?.message}</p>
      </td>
    </tr>
  );
};

export default HookFormRow;
