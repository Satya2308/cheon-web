// import { Form, redirect, useNavigate, useNavigation } from "@remix-run/react";
// import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
// import axios from "axios";
// import { accessTokenCookie } from "~/utils/cookies";
// import { validateLogin } from "./data";

// export async function action({ request }: ActionFunctionArgs) {
//   const baseUrl = process.env.BASE_URL;
//   const formData = await request.formData();
//   const { ok, data, error } = await validateLogin(formData);
//   if (!ok) return { ok: false, error };
//   const { phone, password } = data;
//   console.log("phone", phone);
//   console.log("password", password);
//   const res = await axios.post(
//     `${baseUrl}/auth/login`,
//     { phone, password },
//     { withCredentials: true }
//   );
//   console.log("res", res);
//   const accessToken = res.data.accessToken;
//   return redirect("/admin", {
//     headers: { "Set-Cookie": await accessTokenCookie.serialize(accessToken) },
//   });
// }

// export async function loader({ request }: LoaderFunctionArgs) {
//   return {};
// }

// export default function Login() {
//   return (
//     <div>
//       <header>
//         <h1 className="text-center text-4xl font-semibold p-4 mb-4 text-blue-900">
//           Sign in
//         </h1>
//       </header>
//       <Form method="POST">
//         <fieldset className="flex flex-col gap-4">
//           <input
//             className="input input-bordered w-full"
//             type="text"
//             placeholder="Phone number"
//             name="phone"
//             required
//           />
//           <input
//             className="input input-bordered w-full"
//             type="password"
//             placeholder="Password"
//             name="password"
//             required
//           />
//           <div className="mt-3 flex flex-col gap-2">
//             <button type="submit" className="btn bg-blue-800 text-white">
//               Login
//             </button>
//           </div>
//         </fieldset>
//       </Form>
//     </div>
//   );
// }
