import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <main className="w-full max-w-md mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
