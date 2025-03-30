"use client";
import BackButton from "@/components/common/BackButton";
import { Input } from "@/components/ui/input";
import { login } from "@/utils/api/auth";
import Link from "next/link";
import ButtonImage from "@/components/common/ButtonImage";

export default function Login() {
  

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return;
    }

    const res = await login(email, password)

    if (res && "detail" in res) {
      alert("Your credentials are incorrect. Please try again.");
      return;
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <form className="card w-96 items-center justify-center" onSubmit={handleLogin}>
        <div className="flex justify-between items-center w-full p-2 lg:p-4">
          <BackButton href="/" />
          <h1 className="text-lg font-bold">Login</h1>
          <div className="w-6 h-6"></div>
        </div>
        <Input name="email" type="email" placeholder="Email" className="input" required />
        <Input name="password" type="password" placeholder="Password" className="input" required />
        <p className="text-xs text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
        <ButtonImage alt="button"  type="submit" >
          Login
        </ButtonImage>
        
        
      </form>
      
      
    </div>
  );
}