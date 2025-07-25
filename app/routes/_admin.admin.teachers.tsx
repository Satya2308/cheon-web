import { Await } from "@remix-run/react";
import type {
  MetaFunction,
} from "@vercel/remix";
import { format } from "date-fns";
import { Suspense } from "react";
import { EmptyState, LoadingUI, Pagination } from "~/component";
import { Eye, Pen, Plus, Trash2 } from "~/icons";

export const handle = {
  title: "Teachers",
};

export const meta: MetaFunction = () => {
  return [{ title: handle.title }];
};

export default function AdminTeachers() {

  return (
    <>
      <header
        className={[
          "flex",
          "items-center",
          "justify-between",
          "border-b",
          "border-b-base-200",
          "pb-5",
        ].join(" ")}
      >
        <div />
        <a
          href="/admin/Industries/new"
          title="New Industry"
          className="btn btn-ghost btn-sm"
        >
          <Plus size={18} />
          Create New
        </a>
      </header>
      {/* <Suspense fallback={<LoadingUI />}>
        <Await resolve={res}>
          {(res) => (
            <>
              {res.data.length === 0 && (
                <EmptyState
                  actionUrl="/admin/industries/new"
                  actionLabel="Create new industry"
                />
              )}
              {res.data.length > 0 && (
                <>
                  <table className="table table-auto">
                    <thead className="bg-base-100 uppercase">
                      <tr>
                        <th className="w-20">Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.data.map((item) => (
                        <tr key={item.id} className="hover">
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>
                            {item.description
                              ? item.description.slice(0, 60)
                              : "-"}
                          </td>
                          <td>
                            {format(item.createdAt, "yyyy-MM-dd hh:mm a")}
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <a
                                href={`/admin/industries/${item.id}`}
                                className="btn btn-sm btn-square"
                              >
                                <Eye size={16} />
                              </a>
                              <a
                                href={`/admin/industries/${item.id}/edit`}
                                className="btn btn-sm btn-square"
                              >
                                <Pen size={16} />
                              </a>
                              <a
                                href={`/admin/industries/${item.id}/delete`}
                                className="btn btn-sm btn-square"
                              >
                                <Trash2 size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {res.paginate.pageCount > 1 && (
                    <div className="mt-10">
                      <Pagination pageUrl={url} {...res.paginate} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Await>
      </Suspense> */}
    </>
  );
}
