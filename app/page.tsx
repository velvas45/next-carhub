"use client";

import { Hero, CustomFilter, SearchBar, CarCard, ShowMore } from "@/components";
import { fuels, yearsOfProduction } from "@/constants/index";
import { fetchCars } from "@/utils/index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { CarProps } from "@/types/index";

// CLIENT SIDE RENDER
export default function Home() {
  const [allCars, setAllCars] = useState<CarProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // search stats
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  // filter stats
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("2023");

  // pagination stats
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    setIsLoading(true);
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: +year || 2022,
        fuel: fuel || "",
        limit: limit || 10,
        model: model || "",
      });

      console.log(result);

      setAllCars(result);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCars();
  }, [fuel, year, limit, manufacturer, model]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="mt-16 w-full flex-center">
            <Player
              autoplay
              loop
              className="w-[400px] h-[400px]"
              src="https://lottie.host/7596b38f-c789-4d9f-a97b-3a801ab2a317/EMKJN2OHAv.json"
              // src="https://lottie.host/6f85b830-388b-4841-92e6-1f5ef281e836/tLsTT2Ugss.json"
            />
          </div>
        ) : (
          <>
            {allCars.length > 0 ? (
              <section>
                <div className="home__cars-wrapper">
                  {allCars?.map((car, idx) => (
                    <CarCard car={car} key={idx} />
                  ))}
                </div>
                <ShowMore
                  pageNumber={limit / 10}
                  isNext={limit > allCars.length}
                  setLimit={setLimit}
                />
              </section>
            ) : (
              <div className="home__error-container">
                <h2 className="text-black text-xl font-bold">
                  Oops, no results
                </h2>
                {/* <p>{allCars?.messages}</p> */}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// SERVER SIDE RENDER
// export default async function Home({ searchParams }) {
//   const allCars = await fetchCars({
//     manufacturer: searchParams.manufacturer || "",
//     year: searchParams.year || 2022,
//     fuel: searchParams.fuel || "",
//     limit: searchParams.limit || 10,
//     model: searchParams.model || "",
//   });

//   const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
//   return (
//     <main className="overflow-hidden">
//       <Hero />

//       <div className="mt-12 padding-x padding-y max-width" id="discover">
//         <div className="home__text-container">
//           <h1 className="text-4xl font-extrabold">Car Catalogue</h1>
//           <p>Explore the cars you might like</p>
//         </div>

//         <div className="home__filters">
//           <SearchBar />

//           <div className="home__filter-container">
//             <CustomFilter title="fuel" options={fuels} />
//             <CustomFilter title="year" options={yearsOfProduction} />
//           </div>
//         </div>

//         {!isDataEmpty ? (
//           <section>
//             <div className="home__cars-wrapper">
//               {allCars?.map((car) => (
//                 <CarCard car={car} />
//               ))}
//             </div>
//             <ShowMore
//               pageNumber={(searchParams.limit || 10) / 10}
//               isNext={(searchParams.limit || 10) > allCars.length}
//             />
//           </section>
//         ) : (
//           <div className="home__error-container">
//             <h2 className="text-black text-xl font-bold">Oops, no results</h2>
//             <p>{allCars?.messages}</p>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
