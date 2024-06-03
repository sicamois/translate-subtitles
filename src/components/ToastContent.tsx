export default function ToastContent(title: string, message: string) {
  return (
    <article>
      <h3 className="mb-2 rounded font-bold underline">{title}</h3>
      <p className="text-red-500">{message}</p>
    </article>
  );
}
