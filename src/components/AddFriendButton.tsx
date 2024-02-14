"use client"

import { Button } from "@/components/ui/button"
import {z} from 'zod'
import { toFormikValidationSchema } from "zod-formik-adapter";
import {useFormik} from 'formik'
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useState } from "react";

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

export default function AddFriendButton(){
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState(null);
      const router = useRouter();
    const userSchema = z.object({
    email: z
        .string({
          required_error: "Required",
          invalid_type_error: "Email must be a string",
        })
        .email("Enter a valid email"),
  })

    const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      const send = {
        email: values.email,
        token: storedToken
      };
      console.log(send)

      try {
        const response = await axios.post("http://localhost:3000/api/v1/users/sendFriendRequest", send, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log(response.data);
        setShowSuccessState(true)
        const timeoutId = setTimeout(() => {
          setShowSuccessState(false);
        }, 2000);
        
        // router.push("/dashboard");
      } catch (error) {
        
        if(axios.isAxiosError(error)){
          const response = error.response;
          if(response){
            const errorMessage = (response.data).message|| "An unknown error occured"
            toast.error(`Error: ${errorMessage}`);
            if(response.data.status=="fail"){

                  const timeoutId = setTimeout(() => {
                void router.push("/");
              }, 2000);
              setErrorTimeout(timeoutId)
            }
            
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

    return(
        <form className='max-w-sm' onSubmit={handleSubmit}>
             <Toaster richColors closeButton position="top-right" theme="light" />
      <label
        htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'>
        Add friend by E-Mail
      </label>

      <div className='mt-2 flex gap-4'>
        <input
          type="email" 
            // placeholder="Email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur} 
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${touched.email && errors.email ? "" : ""}`}
          placeholder='you@example.com'
        />
        <Button>Add</Button>
      </div>
        <div className="mx-auto w-[80%] lg:w-[98%]">
                      <span className="text-xs text-red-500 md:text-sm">
                        {errors.email}
                      </span>
                    </div>
      
      {showSuccessState ? (

          <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>

        
      ) : null} 
    </form>
    )
}