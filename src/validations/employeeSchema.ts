import { z } from "zod"

const employeeSchema  = z.object({
  empName: z.string().min(1, {message: 'Name is required'}),
  empEmail: z.string().min(1, {message: 'Email is required'}).email(),
  empAddress: z.string().min(1, {message: 'Address is required'}),
  empPhone: z.string().min(1, {message: 'Phone is required'}).regex(/^01[0125][0-9]{8}$/, {message: 'Mobile is required and should be 11 number only and should begin with 011 , 012 or 010.'})
})

type TEmployee = z.infer<typeof employeeSchema>

export {employeeSchema, type TEmployee}
