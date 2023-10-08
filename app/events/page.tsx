export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mb-8 mt-32">
      <h2 className="mb-16 text-3xl font-bold text-center">
          Unsere{" "}
          <u className="text-primary dark:text-primary-400">Veranstaltungen</u>
        </h2>
      <div className="border-l-2 border-gray-500 pl-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0 w-5/12">
            <h3 className="text-xl font-bold mb-2">Schneeball</h3>
            <p className="text-gray-600 text-sm">Datum: 11. November 2023</p>
            <p className="text-gray-600 text-sm">Kirchgasse 23, 90442 Wallersdorf</p>
          </div>
          <p className="text-gray-700">Der Schneeball geht in die dritte Runde. Euch erwarten gutes Essen am Buffet und die perfekte Musik für Paartänze. TODO: ICAL export</p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between mt-8">
          <div className="mb-4 md:mb-0 w-5/12">
            <h3 className="text-xl font-bold mb-2">Adventsfilme</h3>
            <p className="text-gray-600 text-sm">Datum: 01. Dezember 2023</p>
          </div>
          <p className="text-gray-700">Der Schneeball geht in die dritte Runde. Euch erwarten gutes Essen am Buffet und die perfekte Musik für Paartänze. TODO: ICAL export</p>
        </div>
      </div>
    </div>
  );
}
