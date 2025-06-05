import type { IEmployee } from "@interfaces/iemployee";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const getAllEmployeesAPI = async (limit: number, page: number) => {
  try {
    const res = await axios.get(`/api/employees?limit=${limit}&page=${page}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.data.message || error.message);
    } else {
      throw new Error('an unexpected error')
    }
  }
}

const deleteEmployeeAPI = async (empId: string) => {
  try {
    const res = await axios.delete(`/api/employees/${empId}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.data.message || error.message);
    } else {
      throw new Error('an unexpected error')
    }
  }
}

export default function useHomePage() {
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee>({} as IEmployee);
  const [openAddedModal, setOpenAddedModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10});
  const {data: employees, isLoading, isError, error} = useQuery({
    queryKey: ['employees', paginationModel.page, paginationModel.pageSize],
    queryFn: () =>  getAllEmployeesAPI(paginationModel.pageSize, paginationModel.page + 1),
    placeholderData: keepPreviousData,
    staleTime:  5 * 60 * 1000
  })
  const { mutate } = useMutation({
    mutationKey: ['deleteEmployee'],
    mutationFn: deleteEmployeeAPI
  })
  const closeAddModal = () => {
    setOpenAddedModal(false)
  }
  const openEdit = useCallback((employee: IEmployee) => {
    setSelectedEmployee(employee);
    setOpenEditModal(true)
  }, [])
  const closeEditModal = () => {
    setOpenEditModal(false)
  }
  const deleteEmployee = useCallback((empId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(empId, {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['employees'] });
          toast.success(res.data.message);
        },
        onError: (error) => {
          toast.error(error.message);
        }
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your employee has been deleted",
          icon: "success"
        });
      }
    });
  }, [mutate, queryClient])
  return { selectedEmployee, openEdit, openAddedModal, openEditModal, setPaginationModel, employees, closeAddModal, closeEditModal, isLoading, setOpenAddedModal, paginationModel, isError, error, deleteEmployee }
}
