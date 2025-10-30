'use client';

import React from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Image } from '@heroui/image';
import { Input } from '@heroui/input';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { EyeFilledIcon, EyeSlashFilledIcon } from '@/shared/components/icon/eyePassword';
import { useAuthLogin } from '@/shared/hooks/authentication';
export interface ILoginData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
}).required();

export default function ExamplePage() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginData>({
    resolver: yupResolver(schema)
  });

  const { mutate: authLogin, isPending } = useAuthLogin();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = (data: ILoginData) => {
    console.log('Form data:', data)
    // e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const data = Object.fromEntries(formData) as { email: string; password: string };
    console.log({
              GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!

    })

    // authLogin({ email: data.email, password: data.password });
  };

  return (
    <Card className="max-w-[400px] w-[380px] p-2">
      <CardHeader className="flex gap-3">
        <Link href="/">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
        </Link>
        <div className="flex flex-col">
          <p className="text-md">Login to Bash App</p>
          <p className="text-small text-default-500">by budimind.com</p>
        </div>
      </CardHeader>
      <CardBody>
        <Form className="flex flex-col gap-4 mb-8" validationBehavior="aria" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register('email')}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <Input
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            {...register('password')}
            // id="password"
            // label="Password"
            // labelPlacement="outside"
            // name="password"
            // placeholder="Enter your password"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Button fullWidth color="primary" isDisabled={isPending} type="submit">
            Submit
          </Button>
        </Form>
        {/* {JSON.stringify(errors)} */}
      </CardBody>
      <CardFooter className="flex flex-col gap-2 justify-center items-center">
        <p>
          {"Don't have an account?"} <Link href="/register">Register here</Link>
        </p>
        <Link href="/forgot">forgot password?</Link>

        {/* <SignInButton /> */}
        <Button onClick={() => window.location.href = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/auth/google'}>Google Oauth</Button>
      </CardFooter>
    </Card>
  );
}
