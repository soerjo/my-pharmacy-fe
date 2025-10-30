export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Navbar /> */}
      <section className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-screen">
        {children}
      </section>
    </>
  );
}
