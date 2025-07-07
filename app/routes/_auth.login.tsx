import {
    Form,
    useLoaderData,
    useNavigate,
    useNavigation
  } from "@remix-run/react"
  import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix"
  
  export async function action({ request }: ActionFunctionArgs) {
    return {}
  }
  
  export async function loader({ request }: LoaderFunctionArgs) {
    return {}
  }
  
  export default function Login() {
    const navigation = useNavigation()
    const navigate = useNavigate()
    const isSubmitting = navigation.formAction === "/login"
  
    return (
      <div>
        <header>
          <h1 className="text-center text-4xl font-semibold p-4 mb-4">Sign in</h1>
        </header>
        <Form method="POST">
          <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
            <input
              className="input input-bordered"
              type="email"
              placeholder="Email address"
              name="email"
              required
            />
            <input
              className="input input-bordered"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex gap-2 items-center">
                    <span className="loading loading-spinner"></span>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </fieldset>
        </Form>
      </div>
    )
  }
  