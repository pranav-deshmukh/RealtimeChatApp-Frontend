"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  const userSchema = z
    .object({
      name: z.string({
        required_error: "Required",
        invalid_type_error: "Name must be a string",
      }),
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
          "Password should contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character"
        ),
      confirmPassword: z.string({
        required_error: "Required",
        invalid_type_error: "Confirm password must be a string",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(userSchema),
    validateOnChange: true,
    onSubmit: async (values) => {
      const send = {
        name: values.name,
        email: values.email,
        password: values.password,
        passwordConfirm: values.confirmPassword,
      };
      console.log(send);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/users/signup",
          send
        );
        console.log(response.data);
        localStorage.setItem("jwt", response.data.token);
        Cookies.set("jwt", response.data.token, { expires: 7 });
        router.push("/dashboard");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const response = error.response;
          if (response) {
            const errorMessage =
              response.data.message || "An unknown error occured";
            toast.error(`Error: ${errorMessage}`);
          } else {
            toast.error("Network error or other issue occurred.");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.log(error);
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
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mb-2 ${touched.name && errors.name ? "" : ""}`}
          />
          <div className="mx-auto w-[80%] lg:w-[98%]">
            <span className="text-xs text-red-500 md:text-sm">
              {touched.name && errors.name}
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
            className={`mb-2 ${touched.password && errors.password ? "" : ""}`}
          />
          <div className="mx-auto w-[80%] lg:w-[98%]">
            <span className="text-xs text-red-500 md:text-sm">
              {touched.password && errors.password}
            </span>
          </div>
          <Input
            type="password"
            placeholder="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mb-2 ${
              touched.confirmPassword && errors.confirmPassword ? "" : ""
            }`}
          />
          <div className="mx-auto w-[80%] lg:w-[98%]">
            <span className="text-xs text-red-500 md:text-sm">
              {touched.confirmPassword && errors.confirmPassword}
            </span>
          </div>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${touched.email && errors.email ? "" : ""}`}
          />
          <div className="mx-auto w-[80%] lg:w-[98%]">
            <span className="text-xs text-red-500 md:text-sm">
              {touched.email && errors.email}
            </span>
          </div>
          <div className="flex justify-center items-baseline">

          <Button type="submit" variant="default" className="mt-3">
            Submit
          </Button>
          <Link href={'/login'} className="ml-2 font-semibold font-sans text-xs text-blue-950 cursor-pointer"><u>Already Registered? click to login...</u></Link>
          </div>
        </form>
      </div>
    </div>
  );
}
