export default function Loading() {
  return (
    <div className="mx-auto mt-4 max-w-5xl md:px-4">
      <div className="flex flex-row justify-between px-4 md:px-0">
        <h1 className="text-3xl font-bold md:text-4xl">Spela spel</h1>
      </div>
      {[...Array(7)].map((_, ix) => (
        <section
          key={ix}
          className="mt-8 border-y border-primary shadow-md md:mt-6 md:border"
        >
          <button className="inline-flex h-16 w-full px-4 py-4 hover:bg-zinc-200 dark:hover:bg-zinc-500">
            <span className="flex flex-1 text-left">
              <div className="h-10 w-40 animate-pulse"></div>
            </span>
          </button>
          <div className="md:p-8">
            <div className="bg-gray dark:bg-zinc-800 md:p-4">
              <div className="flex flex-row items-center justify-between border-b-2 border-green p-4">
                <h3 className="text-xl md:text-2xl">Lunchpang</h3>
              </div>
            </div>
            <div className="bg-gray dark:bg-zinc-800 md:p-4">
              <div className="flex flex-row items-center justify-between p-4">
                <h3 className="text-xl md:text-2xl">Kvällspang</h3>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
