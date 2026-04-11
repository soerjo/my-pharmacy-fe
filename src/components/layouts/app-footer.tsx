export function AppFooter() {
  return (
    <footer className="flex items-center justify-center px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500">
      &copy; {new Date().getFullYear()} My App
    </footer>
  );
}
