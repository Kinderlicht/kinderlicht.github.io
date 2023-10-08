// Initialization for ES Users

export default function Home() {
  return (
    <div className="container my-24 mx-auto md:px-6">
      <section className="mb-32 text-center">
        <h2 className="mb-32 text-3xl font-bold">
          Unsere{" "}
          <u className="text-primary dark:text-primary-400">Vorstandschaft</u>
        </h2>

        <div className="grid gap-y-8 md:grid-rows-2 lg:gap-y-32">
          <div className="grid gap-x-6 md:grid-cols-3 lg:gap-x-12">
            <div className="mb-24 md:mb-0">
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="flex justify-center">
                  <div className="flex justify-center -mt-[75px]">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/new/avatars/6.jpg"
                      className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h5 className="mb-4 text-lg font-bold">Enrico Koch</h5>
                  <p className="mb-6">Erster Vorstand</p>
                  <ul className="mx-auto flex list-inside justify-center">
                    <a
                      href="mailto:enrico.koch@kinderlicht-wallersdorf.de"
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="h-4 w-4 text-primary dark:text-primary-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                      </svg>
                    </a>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-24 md:mb-0">
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="flex justify-center">
                  <div className="flex justify-center -mt-[75px]">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/new/avatars/8.jpg"
                      className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h5 className="mb-4 text-lg font-bold">Christina Weig</h5>
                  <p className="mb-6">Zweite Vorständin</p>
                  <ul className="mx-auto flex list-inside justify-center">
                    <a
                      href="mailto:christina.weig@kinderlicht-wallersdorf.de"
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="h-4 w-4 text-primary dark:text-primary-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                      </svg>
                    </a>
                  </ul>
                </div>
              </div>
            </div>

            <div className="">
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="flex justify-center">
                  <div className="flex justify-center -mt-[75px]">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/new/avatars/15.jpg"
                      className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h5 className="mb-4 text-lg font-bold">Julian Dietlmeier</h5>
                  <p className="mb-6">Kassier</p>
                  <ul className="mx-auto flex list-inside justify-center">
                    <a
                      href="mailto:julian.dietlmeier@kinderlicht-wallersdorf.de"
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="h-4 w-4 text-primary dark:text-primary-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                      </svg>
                    </a>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-x-6 md:grid-cols-3 lg:gap-x-12">
            <div className="mb-24 md:mb-0">
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="flex justify-center">
                  <div className="flex justify-center -mt-[75px]">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/new/avatars/6.jpg"
                      className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h5 className="mb-4 text-lg font-bold">Matthias Kettl</h5>
                  <p className="mb-6">Schriftführer</p>
                  <ul className="mx-auto flex list-inside justify-center">
                    <a
                      href="mailto:matthias.kettl@kinderlicht-wallersdorf.de"
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="h-4 w-4 text-primary dark:text-primary-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                      </svg>
                    </a>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-24 md:mb-0">
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="flex justify-center">
                  <div className="flex justify-center -mt-[75px]">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/new/avatars/8.jpg"
                      className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h5 className="mb-4 text-lg font-bold">
                    Anna-Lena Jungbauer
                  </h5>
                  <p className="mb-6">Erste Beisitzerin</p>
                  <ul className="mx-auto flex list-inside justify-center">
                    <a
                      href="mailto:anna-lena.jungbauer@kinderlicht-wallersdorf.de"
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="h-4 w-4 text-primary dark:text-primary-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                      </svg>
                    </a>
                  </ul>
                </div>
              </div>
            </div>

            <div className="">
              <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="flex justify-center">
                  <div className="flex justify-center -mt-[75px]">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/new/avatars/15.jpg"
                      className="mx-auto rounded-full shadow-lg dark:shadow-black/20 w-[150px]"
                      alt="Avatar"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h5 className="mb-4 text-lg font-bold">
                    Ramona Trautmannsberger
                  </h5>
                  <p className="mb-6">Zweite Beisitzerin</p>
                  <ul className="mx-auto flex list-inside justify-center">
                    <a
                      href="mailto:ramona.trautmannsberger@kinderlicht-wallersdorf.de"
                      className="px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="h-4 w-4 text-primary dark:text-primary-400"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
                        <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
                      </svg>
                    </a>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-24 mx-auto md:px-6">
        <h2 className="mb-2 text-3xl font-bold text-center">
          Unsere{" "}
          <u className="text-primary dark:text-primary-400">Unterstützer</u>
        </h2>
        <p className="mb-16 text-center">Die Sortierung der Unterstützer erfolgte rein zufällig.</p>

        <div className="grid gap-6 lg:grid-cols-3">
          <a href="https://www.digitaldruck-fabrik.de" className="mb-6 lg:mb-0">
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="h-30 flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.digitaldruck-fabrik.de/images/main/logo.png"
                      alt="Digitaldruck Fabrik"
                      className="mb-6 dark:brightness-150 lg:mb-0 h-fit w-auto"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Digitaldruck Fabrik</h5>
                    aus 84109 Wörth a.d. Isar{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a href="https://www.partymat.de/TRIXX" className="mb-6 lg:mb-0">
            <div className="h-30 block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="h-30 flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://i.ytimg.com/vi/TNYGhFMvlJ8/mqdefault.jpg"
                      alt="Band TRIXX"
                      className="mb-6 dark:brightness-150 lg:mb-0 h-fit w-auto"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Band TRIXX</h5>
                    aus 94034 Passau{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a href="https://www.lebensmittel-leeb.de/" className="mb-6 lg:mb-0">
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.lebensmittel-leeb.de/images/logo.png"
                      alt="Edeka Leeb"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Edeka Leeb</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.baeckerei-dischinger.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://media.cylex.de/companies/7348/716/logo/logo.jpg"
                      alt="Bäckerei Dischinger"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Bäckerei Dischinger</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.facebook.com/MetzgereiDonhauser/?locale=de_DE"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/295073543_584717056387620_23634260024951184_n.png?stp=dst-png_s960x960&_nc_cat=110&ccb=1-7&_nc_sid=52f669&_nc_ohc=3cVeF-DTOLYAX_sfePv&_nc_ht=scontent-muc2-1.xx&oh=00_AfA87TXlAgYAVxFr279Ifczd68SKwp7wmWUQY5PDI6uNqA&oe=6527D80D"
                      alt="Metzgerei Donhauser"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Metzgerei Donhauser</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a href="https://www.metzgerei-frisch.de/" className="mb-6 lg:mb-0">
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.metzgerei-frisch.de/wp-content/uploads/frisch-001.png"
                      alt="Metzgerei Frisch"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Metzgerei Frisch</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.mein-bauernhof.de/verkaufstelle/asters-holunderhof-705559/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="/supporter/aster.jpg"
                      alt="Asters Holunderhof"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Aster's Holunderhof</h5>
                    aus 94522 Ettling{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.music-station.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.music-station.de/media/7d/g0/00/1625557432/music-station-logo.png"
                      alt="Music Station"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Music Station</h5>
                    aus 94330 Aiterhofen{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://develey.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://develey.de/Marken/Brand/Kanaele/brand/logo/develey-logo-brand-marke-markenname.png"
                      alt="Develey Senf"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Develey</h5>
                    aus 84130 Dingolfing{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="http://www.weig-online.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.weig-online.de/s/misc/logo.jpg?t=1691560016"
                      alt="Peter Weig"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Ingenieurbüro Peter Weig</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://eventbar-woibadinga.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://eventbar-woibadinga.de/wp-content/uploads/2021/05/Logo.png"
                      alt="Eventbar Woibadinga"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Eventbar Woibadinga</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.ziegler-isolierungen.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://image.jimcdn.com/app/cms/image/transf/dimension=216x10000:format=png/path/s4e5bb772c21e79fb/image/i53150231242c47b9/version/1576410612/image.png"
                      alt="Ziegler Isolierung"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Ziegler Isolierung</h5>
                    aus 94428 Eichendorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.wallersdorfer-backhaus.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="/supporter/weinzierl.jpg"
                      alt="Bäckerei Weinzierl"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Bäckerei Weinzierl</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.weiss-grunert.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.weiss-grunert.de/wp-content/themes/weissgrunert/img/logo-black.png"
                      alt="Rechtsanwälte Weiss & Grunert"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Rechtsanwälte Weiss & Grunert</h5>
                    aus 84028 Landshut{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://ortmaier-druck.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://ortmaier-druck.de/wp-content/uploads/2014/07/ortmaier_header_logo.png"
                      alt="Ortmaier Druck"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Ortmaier Druck</h5>
                    aus 84160 Frontenhausen{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.teba-kreditbank.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.teba-kreditbank.de/fileadmin/templates/img/TEBA_Logo_2018.svg"
                      alt="TEBA Kreditbank"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">TEBA Kreditbank</h5>
                    aus 94405 Landau a. d. Isar{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.csu.de/verbaende/ov/wallersdorf/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.csu.de/assets/img/logos/csu-logo-tw.gif"
                      alt="CSU & Frauen Union"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">CSU & Frauen Union</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://fahrschule-eder.net/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://fahrschule-eder.net/images/page/Eder-FS-logo.png"
                      alt="Fahrschule Eder"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Fahrschule Eder</h5>
                    aus 94431 Pilsting{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://wallersdorf.dahoam-in-niederbayern.de/vereine/verein/theatergruppe-st-johannes-991/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://layout.verwaltungsportal.de/1580/img/logo.png"
                      alt="Theatergruppe St. Johannes"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Theatergr. St. Johannes</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://sp-ast.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://sp-ast.de/wp-content/themes/servicepartner/images/logos/sp-ast.jpg"
                      alt="Spedition Ast"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Spedition Ast</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.markt-wallersdorf.de/verzeichnis/mandat.php?mandat=34059&kategorie=128"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://layout.verwaltungsportal.de/1580/img/logo.png"
                      alt="Boxclub Wallersdorf"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Boxclub Wallersdorf</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.andrea-herzig.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://le-cdn.website-editor.net/s/3b38257c5abf4d51a57e2b0dd0fa8f6e/dms3rep/multi/opt/LOGOHPA-216w.png?Expires=1698627149&Signature=ag5uf5kY3yLbZ-ntUXNHOLO6rPKOxFUPoeK8Ja6WDGWbqjITdRV2Uqyfc45V7BvTP7DZt3iKP-pWEiM4kGd-4d80iiDkX6zGhgUFKEpm7pnD~Mjc7spc8LRIdlIAtRxyr4F20yRauJ7Wy14GfJSkCT4IXu5Z569Eltn66wUb0N9kyomiaxoDSPhZXau6y7p8N~De4bb0Yt7K6OBIJidpAtVRr~Q2Dxe2lGh~FEzX4SzNEdwbdSVs2wLonRpVG5GLr4n6crByLyW4Z6Y309RVyRdEOVJLQ1JLWXFTe6ZOvpERJ3HqblgDPNa3bU3fKbwBvW7g8ShCZ~x-oeyqbya4Pg__&Key-Pair-Id=K2NXBXLF010TJW"
                      alt="Andrea Herzig"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Andrea Herzig</h5>
                    aus 93444 Bad Kötzting{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100039793366614"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/293155048_740134597322979_4071837228414404162_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=2LOzisTJJkoAX8BSx_n&_nc_ht=scontent-muc2-1.xx&oh=00_AfCaCbgOnGx5jtvGN8_MxOueXZtJvK20iVfrc2UAZ9s7Wg&oe=6527F00F"
                      alt="TeacherMen's Friends"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">TeacherMen's Friends</h5>
                    aus 94405 Landau a. d. Isar{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.musikschule-temel.de/cms/cms/front_content.php?idcat=3"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.musikschule-temel.de/cms/cms/upload/logos/Logo_MusikstudiofrHomepage.jpg"
                      alt="Musikschule Temel"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Musikschule Temel</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.voices-music.com/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.voices-music.com/s/img/emotionheader.png?1513805912.940px.120px"
                      alt="Voices"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Voices</h5>
                    aus 84160 Frontenhausen{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.picantos.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="/supporter/picantos.png"
                      alt="Picantos"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Picantos</h5>
                    aus 94121 Straßkirchen{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.veranstaltungsmanagementreflex.com/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/281231493_5309948829062540_830823864974889683_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=5mcrZDru5N4AX8zLUF5&_nc_ht=scontent-muc2-1.xx&oh=00_AfCC2X6WIn36PPFURdroFShIrOH3UL-BEo_zXc_K46g96Q&oe=652777A6"
                      alt="DJ Reflec"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">DJ Reflex</h5>
                    aus 92421 Schwandorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.sixty-up.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://www.sixty-up.de/images/headers/BANDLOGO_2012_small.png"
                      alt="SIXTY UP"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">SIXTY-UP</h5>
                    aus 94431 Pilsting{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://www.vswallersdorf.de/"
            className="mb-6 lg:mb-0"
          >
            <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 hover:bg-gray-100">
              <div className="p-6">
                <div className="flex flex-wrap items-center">
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-5/12">
                    <img
                      src="https://layout.verwaltungsportal.de/1580/img/logo.png"
                      alt="Bischof-Riccabona Mittelschule"
                      className="mb-6 dark:brightness-150 lg:mb-0"
                    />
                  </div>
                  <div className="flex-basis w-full shrink-0 grow-0 px-3 lg:w-7/12">
                    <h5 className="mb-4 font-bold">Bischof-Riccabona Mittelschule</h5>
                    aus 94522 Wallersdorf{" "}
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
