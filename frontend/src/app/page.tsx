
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start brightness-50 border-y-indigo-800 outline-dotted">
        <div>
          <h1 className="font-bold text-4xl m-4 text-blue-600">
            Sing-MuzaK!
          </h1>
        </div>
      </main>
        <h4>More update to come...</h4>
        <p className="text- mt-4">
            Register an account? <a href="/auth/register" className="text-blue-600">Register Here!</a>
        </p>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
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
          <a href="/auth/login" className=" m-8 bg-emerald-500 text-white py-3 rounded">
            <button
              className="w-40 bg-emerald-500"
              >
              Login
            </button>
          </a>
      </footer>
    </div>
  );
}
