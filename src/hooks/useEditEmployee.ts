import { zodResolver } from "@hookform/resolvers/zod";
import type { IEmployee } from "@interfaces/iemployee";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeSchema, type TEmployee } from "@validations/employeeSchema";
import axios, { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

const editEmployeeAPI = async (empId: string, formData: TEmployee) => {
  try {
    const res = await axios.patch(`/api/employees/${empId}`, formData);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.data.message || error.message);
    } else {
      throw new Error('an unexpected error')
    }
  }
}

type EmployeeProps = {
  closeEditModal: () => void,
  employee: IEmployee
}

export default function useEditEmployee({closeEditModal, employee}: EmployeeProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: {errors}, reset } = useForm<TEmployee>({
    mode: 'onTouched',
    resolver: zodResolver(employeeSchema)
  })
  useEffect(() => {
    reset({
      empName: employee.empName,
      empEmail: employee.empEmail,
      empAddress: employee.empAddress,
      empPhone: employee.empPhone
    })
  }, [employee, reset])
  const { mutateAsync } = useMutation({
    mutationKey: ['editEmployee'],
    mutationFn: (data: TEmployee) => editEmployeeAPI(employee._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['employees']})
      toast.success('employee updated successfully');
      reset();
      closeEditModal();
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
