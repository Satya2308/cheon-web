import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import axios from "axios";
import { Forehead } from "~/component";
// import PasswordInput from "~/components/ui/passwordInput";
import fieldError from "~/helpers/fieldError";
import { X } from "~/icons";
import { authApi } from "~/utils/axios";
import { validateCreateTeacher } from "~/zod/teacher";
// import { UserService } from "~/services";
// import type { ICreateUser } from "~/types/user";
// import { UserValidator } from "~/validators";

export const handle = {
  title: "New Teacher",
  backable: true,
};

export const meta: MetaFunction = () => {
  return [{ title: handle.title, backable: handle.backable }];
};

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.formData();
  const { data, error } = await validateCreateTeacher(payload);
  if (!data) return { error, user: null };
  const res = await authApi.post("/teacher", data);
  if(res.status === 201) return redirect("/admin/teachers")
  return {};
}

export default function CreateTeacher() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const error = actionData?.error
  // const isSubmitting = navigation.formAction === "/admin/teachers/new";
  // const error = actionData?.error;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box p-0 ml-3 sm:ml-0 overflow-hidden max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-end mt-4 mr-4 flex-shrink-0">
          <Link to="/admin/teachers" className="btn btn-ghost p-2">
            <X size={20} />
          </Link>
        </div>
        <main className="px-8 pb-10 overflow-y-auto flex-1">
          <div className="pt-6 flex items-center justify-center">
            <Form method="POST" className="w-full max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឈ្មោះ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឈ្មោះ"
                    name="name"
                  />
                  {error?.name && fieldError(error.name[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខកូដ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="លេខកូដ"
                    name="code"
                  />
                  {error?.code && fieldError(error.code[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខទូរស័ព្ទ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="លេខទូរស័ព្ទ"
                    name="phone"
                  />
                  {error?.phone && fieldError(error.phone[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    លេខសម្ងាត់
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="លេខសម្ងាត់"
                    name="password"
                  />
                  {error?.password && fieldError(error.password[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base font-semibold">
                    ភេទ
                  </legend>
                  <select className="select" name="gender">
                    <option value="FEMALE">ស្រី</option>
                    <option value="MALE">ប្រុស</option>
                  </select>
                  {error?.gender && fieldError(error.gender[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ថ្ងៃកំណើត
                  </legend>
                  <input type="date" className="input" name="dob" />
                  {error?.dob && fieldError(error.dob[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    មុខវិជ្ជាបង្រៀន
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="មុខវិជ្ជាបង្រៀន"
                    name="subject"
                  />
                  {error?.subject && fieldError(error.subject[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ក្របខណ្ឌ
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ក្របខណ្ឌ"
                    name="krobkan"
                  />
                  {error?.krobkan && fieldError(error.krobkan[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឯកទេសទី​ ​១
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឯកទេសទី​ ​១"
                    name="profession1"
                  />
                  {error?.profession1 && fieldError(error.profession1[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឯកទេសទី ​២
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឯកទេសទី ​២"
                    name="profession2"
                  />
                  {error?.profession2 && fieldError(error.profession2[0])}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend leading-relaxed text-base">
                    ឋានន្តរស័ក្ត
                  </legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="ឋានន្តរស័ក្ត"
                    name="rank"
                  />
                  {error?.rank && fieldError(error.rank[0])}
                </fieldset>
              </div>
              <div className="mt-10 flex gap-2">
                <button className="btn btn-primary flex-1" type="submit">
                  បង្កើត
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  ចេញ
                </button>
              </div>
            </Form>
          </div>
        </main>
      </div>
    </dialog>
  );
}
