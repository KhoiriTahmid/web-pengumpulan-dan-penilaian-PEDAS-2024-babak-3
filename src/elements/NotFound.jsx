import React from "react";

export function NotFound() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-white p-6 min-h-screen md:mx-auto flex flex-col justify-center items-center gap-4 ">
        <div className=" text-6xl mb-5">😨</div>
        <div className="text-center flex flex-col items-center gap-2">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            404
          </h3>
          <p className="text-gray-600 text-sm my-2">Halaman Tidak ditemukan</p>

          <a
            href={"/"}
            className=" cursor-pointer px-12 w-fit mt-5 border border-slate-900 hover:bg-gray-200   font-semibold py-3"
          >
            Kembali
          </a>
        </div>
      </div>
    </div>
  );
}
