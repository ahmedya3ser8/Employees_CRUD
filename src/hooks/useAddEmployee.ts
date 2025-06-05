import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeSchema, type TEmployee } from "@validations/employeeSchema";
import axios, { isAxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

const addEmployeeAPI = async (formData: TEmployee) => {
  try {
    const res = await axios.post(`/api/employees`, formData);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.data.message || error.message);
    } else {
      throw new Error('an unexpected error')
    }
  }
}

export default function useAddEmployee({closeAddModal}: {closeAddModal: () => void}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: {errors}, reset } = useForm<TEmployee>({
    mode: 'onTouched',
    resolver: zodResolver(employeeSchema)
  })
  const { mutateAsync } = useMutation({
    mutationKey: ['addEmployee'],
    mutationFn: addEmployeeAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['employees']})
      toast.success('employee added successfully');
      reset();
      closeAddModal();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
  const submitForm: SubmitHandler<TEmployee> = async (data) => {
    await mutateAsync(data);
  }
  return { register, handleSubmit, errors, submitForm }
}
