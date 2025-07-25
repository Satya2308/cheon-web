import { X } from "~/icons";

interface Props {
  title: string;
  backref: string;
}

export default function Forehead({ title, backref }: Props) {
  return (
    <>
      <div
        className={[
          "flex",
          "justify-between",
          "items-center",
          "border-b",
          "border-b-base-200",
          "pb-4",
          "mb-4",
        ].join(" ")}
      >
        <h2 className="font-bold text-lg text-black">{title}</h2>
        <a
          href={backref}
          title="Back"
          className="btn btn-sm btn-square btn-ghost"
        >
          <X size={20} color="black" />
        </a>
      </div>
    </>
  );
}
