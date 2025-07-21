export default function fieldError(msg: string) {
  return (
    <div className="label">
      <span className="label-text-alt text-error">{msg}</span>
    </div>
  );
}
