
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 py-20 gap-16 sm:py-20 sm:items-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start brightness-50 border-y-indigo-800 outline-dotted">
        <div>
          <h1 className="font-bold text-4xl m-4 text-blue-600">
            🎵 Sing-MuzaK!
          </h1>
        </div>
      </main>
        <h4>More update to come...</h4>
      <footer className="mb-4 pb-8 sm:pb-20">
        <div className="flex flex-col items-center justify-center">
          <div className="pb-10">
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            <h4>
              ...get a sweet experience of an <b>e-choir</b> at your reach.
            </h4>
          </div>
          <div>
            <a href="/auth/login" className=" m-8 bg-emerald-500 text-white py-3 rounded hover:bg-emerald-600">
              <button
                className="w-40 "
                >
                Login
              </button>
            </a>
          </div>
          <div>
            <p className="m-4 pb-8">
              Register an account? <a href="/auth/register" className="text-blue-500 hover:text-blue-800 hover:underline hover:font-bold">Register Here!</a>
            </p>
          </div>
        </div>
        <span className="text-lime-700 text-sm bg-slate-100 rounded p-1 mb-4">
          @Muzak 2024
        </span>
      </footer>
    </div>
  );
}
