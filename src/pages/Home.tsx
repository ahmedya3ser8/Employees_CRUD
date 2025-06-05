import AddEmployee from "@components/add-employee/AddEmployee";
import EditEmployee from "@components/edit-employee/EditEmployee";
import useHomePage from "@hooks/useHomePage";
import Paper from '@mui/material/Paper';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import toast from "react-hot-toast";
import { FaMinus, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import { LuLoaderCircle } from "react-icons/lu";

const Home = () => {
  const { selectedEmployee, openEdit, openAddedModal, openEditModal, setPaginationModel, employees, closeAddModal, closeEditModal, isLoading, setOpenAddedModal, paginationModel, isError, error, deleteEmployee } = useHomePage();
  const columns: GridColDef[] = [
    { field: 'empName', headerName: 'Name', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'empEmail', headerName: 'Email', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'empAddress', headerName: 'Address', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'empPhone', headerName: 'Phone', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'Actions', headerName: 'Actions', flex: 1, align: 'center', headerAlign: 'center', renderCell: (params) => (
        <div className="flex items-center justify-center gap-3 w-full h-full">
          <button
            onClick={() => openEdit(params.row)}
            className="text-blue-600 text-lg hover:text-blue-800"
            aria-label="Edit"
          >
            <FaPen />
          </button>
          <button
            onClick={() => deleteEmployee(params.row._id)}
            className="text-red-600 text-lg hover:text-red-800"
            aria-label="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <LuLoaderCircle className="animate-spin size-10" />
    </div>
  }
  if (isError) {
    return toast.error(error!.message)
  }
  return (
    <>
      <section className="py-6">
        <div className="container bg-white">
          <div className="employee_head bg-[#435d7d] text-white flex justify-between items-center p-5 rounded-sm">
            <h2 className="text-3xl font-bold"> <span className="font-medium">Manage</span> Employees</h2>
            <button className="employee_head_btn bg-[#dc3545] py-2 px-4 flex items-center gap-[6px] rounded-md ml-auto">
              <span className="size-5 bg-white rounded-full flex items-center justify-center">
                <FaMinus className="fa-solid fa-minus text-[#dc3545] text-sm" />
              </span>
              Delete
            </button>
            <button onClick={() => setOpenAddedModal((prev) => !prev)} className="employee_head_btn bg-[#218838] py-2 px-4 flex items-center gap-[6px] rounded-md border-4 border-[#45886f] ml-2">
              <span className="size-5 bg-white rounded-full flex items-center justify-center">
                <FaPlus className="fa-solid fa-plus text-[#218838] text-sm" />
              </span>
              Add New Employee
            </button>
          </div>
          <div className="overflow-x-auto p-4">
            <Paper sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={employees.data.employees ?? []}
                rowCount={employees.total ?? 0}
                getRowId= {(row) => row._id}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10]}
                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                checkboxSelection
                sx={{ border: 0}}
              />
            </Paper>
          </div>
        </div>
        {openAddedModal && <AddEmployee closeAddModal={closeAddModal} />}
        {openEditModal && <EditEmployee closeEditModal={closeEditModal} employee={selectedEmployee} />}
      </section>
    </>
  )
}

export default Home;
