import React from "react";
import { NavLink } from "react-router-dom";

export function Dummy({ context, deadline = "" }) {
  if (context == "loading") {
    return (
      <div
        className="h-screen w-screen flex justify-center items-center"
        role="status"
      >
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-300 animate-spin  fill-slate-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
  if (context.endsWith("deadline")) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-white p-6 min-h-screen md:mx-auto flex flex-col justify-center items-center gap-4 ">
          <svg
            viewBox="0 0 24 24"
            className="text-green-600 w-16 h-16 mx-auto my-6"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
              {context == "sebelum deadline"
                ? "Sesi penilaian belum dimulai"
                : "Sesi pengumpulan telah berakhir"}
            </h3>
            <p className="text-gray-600 my-2">
              {context == "sebelum deadline"
                ? `Sesi penilaian dapat dilakukan mulai pukul ${deadline}`
                : "telat"}
            </p>
            <p> Terimakasih </p>
            <div className="py-10 text-center">
              <a
                href={"/"}
                className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
              >
                Okay
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white p-6 min-h-screen md:mx-auto flex flex-col justify-center items-center gap-4 ">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            {context == "submit"
              ? "Pengumpulan Berhasil"
              : "Penilaian Disimpan"}
          </h3>
          <p className="text-gray-600 my-2">
            {context == "submit"
              ? "Silahkan Login kemabali dan lakukan penilaian pada pukul 20.00"
              : "Silahkan menunggu hasil penilaian"}
          </p>
          <p> Terimakasih </p>
          <div className="py-10 text-center">
            <a
              href={"/"}
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              Okay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
