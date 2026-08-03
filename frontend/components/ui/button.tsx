export function Button({ children }: { children: React.ReactNode }) {
  return <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">{children}</button>;
}
