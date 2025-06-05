import Input from "@components/Input/Input";
import useEditEmployee from "@hooks/useEditEmployee";
import type { IEmployee } from "@interfaces/iemployee";

type EmployeeProps = {
  closeEditModal: () => void,
  employee: IEmployee
}

const EditEmployee = ({closeEditModal, employee}: EmployeeProps) => {
  const { register, handleSubmit, errors, submitForm } = useEditEmployee({ closeEditModal, employee })
  return (
    <div className="add-employee-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="modal_header flex justify-between items-center mb-4 border-b border-gray-300 p-5">
          <h2 className="text-xl font-semibold">Edit Employee</h2>
          <button onClick={() => closeEditModal()} className="text-gray-500 text-3xl hover:text-gray-700">
            &times;
          </button>
        </div>
        <form className="modal_body p-5" onSubmit={handleSubmit(submitForm)} >
          <Input label="Name" error={errors.empName?.message as string} name="empName" register={register} />
          <Input label="Email" type="email" error={errors.empEmail?.message as string} name="empEmail" register={register} />
          <div className="mb-4">
            <label htmlFor="address" className="block font-semibold mb-1">Address</label>
            <textarea id="address" {...register("empAddress")}  className="w-full p-2 outline-none border border-gray-300 rounded-md"></textarea>
            <p className='text-red-500 mt-1 lowercase' > {errors.empAddress?.message} </p>
          </div>
          <Input label="Phone" type="tel" error={errors.empPhone?.message as string} name="empPhone" register={register} />
          <div className="modal_footer p-5 flex gap-4 justify-end bg-gray-200">
            <button onClick={() => closeEditModal()} type="button" >Cancel</button>
            <button type="submit" className="py-2 px-4 bg-[#218838] text-white rounded-md">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEmployee;
