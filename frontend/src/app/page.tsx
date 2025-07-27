
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[10px_1fr_30px] items-center justify-items-center min-h-screen max-h-screen p-4 py-20 gap-16 sm:pb-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <main className="flex flex-col gap-[60px] row-start-2 items-center sm:items-start brightness-50">
        <div className=" border-y-indigo-800 outline-dotted">
          <h1 className="font-bold text-4xl m-4 text-blue-600">
            🎵 Sing-MuzaK!
          </h1>
        </div>
          <div className="">
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
      </main>
        <h4 className="text-center sm:text-left">More update to come...</h4>
       <footer className="w-full flex flex-col items-center row-start-3 text-center sm:text-left">
        <div>
          <a
            href="/auth/login"
            className="m-4 bg-emerald-500 text-white py-3 px-6 rounded hover:bg-emerald-600 inline-block"
          >
            Login
          </a>
        </div>
        <div className="text-sm">
          <p className="pb-10">
            Register an account?{" "}
            <a
              href="/auth/register"
              className="text-blue-500 text-lg hover:text-blue-800 hover:underline hover:font-bold"
            >
              Register Here!
            </a>
          </p>
        </div>
          <span className="text-lime-700 text-sm bg-slate-100 rounded">
            @Muzak 2024
          </span>
      </footer>
    </div>
  );
}
