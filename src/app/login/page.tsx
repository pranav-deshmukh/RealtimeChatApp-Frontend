"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {z} from 'zod'
import { toFormikValidationSchema } from "zod-formik-adapter";
import {useFormik} from 'formik'
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const userSchema = z.object({
    email: z
        .string({
          required_error: "Required",
          invalid_type_error: "Email must be a string",
        })
        .email("Enter a valid email"),
    password: z
        .string({
          required_error: "Required",
          invalid_type_error: "Password must be a string",
        })
        .regex(
          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character",
        ),
  })


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      const send = {
        email: values.email,
        password: values.password,
      };

      try {
        const response = await axios.post("http://localhost:3000/api/v1/users/login",send);
        console.log(response.data);
        localStorage.setItem('jwt', response.data.token);
        router.push("/dashboard");
      } catch (error) {
        if(axios.isAxiosError(error)){
          const response = error.response;
          if(response){
            const errorMessage = (response.data).message|| "An unknown error occured"
            toast.error(`Error: ${errorMessage}`);
          }else{
            toast.error("Network error or other issue occurred.");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.error("Registration failed:", error);
      }
      console.log(send);
    },
  });
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;
  

  return (
    <div className="flex justify-center items-center flex-col h-screen">
    <Toaster richColors closeButton position="top-right" theme="light" />
      <h1 className="mb-4 text-2xl font-bold">Create an Account</h1>
      
      <div className="w-[30%]">
        <form action="" onSubmit={handleSubmit}>
      
            <Input 
            type="email" 
            placeholder="Email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur} 
            className={`mb-2 ${touched.email && errors.email ? "" : ""}`} />
            <div className="mx-auto w-[80%] lg:w-[98%]">
                      <span className="text-xs text-red-500 md:text-sm">
                        {errors.email}
                      </span>
                    </div>
                
            <Input 
            type="password"
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Password" 
            className={`${touched.password && errors.password ? "" : ""}`}
            />
            <div className="mx-auto w-[80%] lg:w-[98%]">
                      <span className="text-xs text-red-500 md:text-sm">
                        {errors.password}
                      </span>
                    </div>
            <Button type="submit" variant="default" className="mt-3">Submit</Button>
        </form>
      </div>

    </div>
  )
}
