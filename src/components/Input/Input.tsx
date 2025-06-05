import type { FieldValues, Path, UseFormRegister } from "react-hook-form"

type TInputProps<TFieldValue extends FieldValues> = {
  label: string
  type?: string
  name: Path<TFieldValue>
  register: UseFormRegister<TFieldValue>
  error: string
}

const Input = <TFieldValue extends FieldValues>({ label, type = 'text', name, register, error }: TInputProps<TFieldValue>) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold mb-1">{label}</label>
      <input type={type} id={name} {...register(name)} className="w-full p-2 outline-none border border-gray-300 rounded-md" />
      <p className='text-red-500 mt-1 lowercase' > {error} </p>
    </div>
  )
}

export default Input;
