"use client";
import { Input } from "@/components/ui/input";
import { login } from "@/utils/api/auth";

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
      alert(res.detail);
      return;
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <form className="card w-96 items-center justify-center" onSubmit={handleLogin}>
        <h1 className="text-2xl font-bold">Login</h1>
        <Input name="email" type="email" placeholder="Email" className="input" required />
        <Input name="password" type="password" placeholder="Password" className="input" required />
        <button type="submit" className="button">Login</button>
        <p className="text-sm">Don't have an account? <a href="/register" className="link">Register</a></p>
      </form>
      
      
    </div>
  );
}
