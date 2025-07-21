import { createRoot } from "react-dom/client";

interface Options {
  mode?: "info" | "success" | "warning" | "danger";
  ms?: number;
}

export const toast = (message: string, options?: Options) => {
  const { mode = "info", ms = 3000 } = options || {};
  const containerDiv = document.createElement("div");
  document.body.appendChild(containerDiv);
  const root = createRoot(containerDiv);
  const destroy = () => {
    root.unmount();
    document.body.removeChild(containerDiv);
  };
  root.render(
    <div className="toast toast-top toast-center z-999">
      <div className={`alert alert-${mode} shadow-md`}>
        <span>{message}</span>
      </div>
    </div>
  );
  const timeoutId = setTimeout(destroy, ms);
  return () => {
    clearTimeout(timeoutId);
    destroy();
  };
};
