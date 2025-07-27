
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start brightness-50 border-y-indigo-800 outline-dotted">
        <div>
          <h1 className="font-bold text-4xl m-4 text-blue-600">
            🎵 Sing-MuzaK!
          </h1>
        </div>
      </main>
        <h4>More update to come...</h4>
            <footer className="items-center justify-center">
        <div className="flex flex-col items-center">
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
      </footer>
    </div>
  );
}
