"use client";

import BackButton from "@/components/common/BackButton";
import { Input } from "@/components/ui/input";
import { register } from "@/utils/api/auth";
import Link from "next/link";

export default function Signup() {

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget)

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const name = formData.get("name")?.toString();

    if (!email || !password || !confirmPassword || !name) {
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await register(email, password, name)
    
    if (res && "detail" in res) {
      alert(res.detail);
      return;
    }
    
  }


  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <form
        onSubmit={onSubmit}
        className="card w-96 items-center justify-center"
      >
        <div className="flex justify-between items-center w-full p-2 lg:p-4">
          <BackButton href="/" />
          <h1 className="text-lg font-bold">Register</h1>
          <div className="w-6 h-6"></div>
        </div>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
        />
        <Input
          type="text"
          name="name"
          id="name"
          placeholder="name"
          required
        />
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
        />
        <p className="text-xs text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
        <button type="submit" className="button">Register</button>
      </form>
    </div>
  );
}
