import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

// Define a base type with common member fields (excluding relatives)
type BaseMember = {
  // Persönliche Informationen
  gender: string;
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  // Adresse
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  // Bankdetails
  iban: string;
  bic: string;
  confirmSEPA: boolean;
  // Mitgliedschaft
  join: string;
  donation: number;
  // Kontaktaufnahme
  contactEmail: boolean;
  contactPost: boolean;
  // Bestätigungen
  // Spendenbescheinigung – now moved to the Mitgliedschaft section
  confirmDonationDocument: boolean;
  // Datenschutz
  confirmDataProtection: boolean;
};

// The main member type includes an array of relatives
type Member = BaseMember & {
  relatives: BaseMember[];
};

const MemberForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Member>({
    defaultValues: {
      // Hauptmitglied – alle Felder initialisieren
      gender: "",
      firstName: "",
      lastName: "",
      birthday: "",
      email: "",
      street: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
      iban: "",
      bic: "",
      confirmSEPA: false,
      join: "",
      donation: 24,
      contactEmail: false,
      contactPost: false,
      confirmDonationDocument: false,
      confirmDataProtection: false,
      relatives: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatives",
  });

  const onSubmit = (data: Member) => {
    console.log("Formulardaten:", data);
    // Daten hier per API verarbeiten
  };

  // When adding a relative, copy current main member values
  const addRelative = () => {
    const values = getValues();
    append({
      gender: values.gender,
      firstName: values.firstName,
      lastName: values.lastName,
      birthday: values.birthday,
      email: values.email,
      street: values.street,
      postalCode: values.postalCode,
      city: values.city,
      state: values.state,
      country: values.country,
      iban: values.iban,
      bic: values.bic,
      confirmSEPA: values.confirmSEPA,
      join: values.join,
      donation: values.donation,
      contactEmail: values.contactEmail,
      contactPost: values.contactPost,
      confirmDonationDocument: values.confirmDonationDocument,
      confirmDataProtection: values.confirmDataProtection,
    });
  };

  // Reusable section header with a thin underline in the specified bright orange.
  const sectionHeader = (title: string) => (
    <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-[#FFA500] pb-2 mb-4">
      {title}
    </h2>
  );

  // Input style with focus ring in the specified orange.
  const inputClasses =
    "mt-1 w-full rounded border border-gray-300 focus:ring-2 focus:ring-[#FFA500] p-2";

  // Checkbox style
  const checkboxClasses = "h-5 w-5 text-[#FFA500] border border-gray-300 rounded";

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Mitgliedsantrag</h1>
          <p className="text-gray-600 mt-2">
            Bitte fülle alle Felder sorgfältig aus. Der Antrag muss mit einer gültigen E-Mail-Adresse bestätigt werden.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Main Member Form */}
          <div className="space-y-8">
            {/* Persönliche Informationen */}
            <section>
              {sectionHeader("Persönliche Informationen")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Anrede */}
                <div>
                  <label className="block text-sm text-gray-600">Anrede</label>
                  <select
                    {...register("gender", { required: "Anrede ist erforderlich" })}
                    className={inputClasses}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="male">Herr</option>
                    <option value="female">Frau</option>
                    <option value="other">ohne</option>
                  </select>
                  {errors.gender && <p className="text-orange-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>
                {/* Vorname */}
                <div>
                  <label className="block text-sm text-gray-600">Vorname</label>
                  <input
                    {...register("firstName", { required: "Vorname ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.firstName && <p className="text-orange-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                {/* Nachname */}
                <div>
                  <label className="block text-sm text-gray-600">Nachname</label>
                  <input
                    {...register("lastName", { required: "Nachname ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.lastName && <p className="text-orange-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                {/* Geburtsdatum */}
                <div>
                  <label className="block text-sm text-gray-600">Geburtsdatum</label>
                  <input
                    {...register("birthday", { required: "Geburtsdatum ist erforderlich" })}
                    type="date"
                    className={inputClasses}
                  />
                  {errors.birthday && <p className="text-orange-500 text-xs mt-1">{errors.birthday.message}</p>}
                </div>
                {/* E-Mail */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600">E-Mail</label>
                  <input
                    {...register("email", {
                      required: "E-Mail ist erforderlich",
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Ungültige E-Mail-Adresse",
                      },
                    })}
                    type="email"
                    className={inputClasses}
                  />
                  {errors.email && <p className="text-orange-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
            </section>

            {/* Adresse */}
            <section>
              {sectionHeader("Adresse")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Straße + Nr. */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600">
                    Straße + Nr. (ggf. Adresszusatz)
                  </label>
                  <input
                    {...register("street", { required: "Straße ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.street && <p className="text-orange-500 text-xs mt-1">{errors.street.message}</p>}
                </div>
                {/* PLZ */}
                <div>
                  <label className="block text-sm text-gray-600">Postleitzahl / ZIP</label>
                  <input
                    {...register("postalCode", { required: "PLZ ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.postalCode && <p className="text-orange-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
                {/* Ort */}
                <div>
                  <label className="block text-sm text-gray-600">Ort</label>
                  <input
                    {...register("city", { required: "Ort ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.city && <p className="text-orange-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                {/* Bundesland / Kanton */}
                <div>
                  <label className="block text-sm text-gray-600">Bundesland / Kanton</label>
                  <input
                    {...register("state", { required: "Bundesland ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.state && <p className="text-orange-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
                {/* Land */}
                <div>
                  <label className="block text-sm text-gray-600">Land</label>
                  <input
                    {...register("country", { required: "Land ist erforderlich" })}
                    type="text"
                    placeholder="Deutschland, Österreich, Schweiz"
                    className={inputClasses}
                  />
                  {errors.country && <p className="text-orange-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>
            </section>

            {/* Bankdetails */}
            <section>
              {sectionHeader("Bankdetails")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IBAN */}
                <div>
                  <label className="block text-sm text-gray-600">IBAN</label>
                  <input
                    {...register("iban", { required: "IBAN ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.iban && <p className="text-orange-500 text-xs mt-1">{errors.iban.message}</p>}
                </div>
                {/* BIC */}
                <div>
                  <label className="block text-sm text-gray-600">BIC</label>
                  <input
                    {...register("bic", { required: "BIC ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.bic && <p className="text-orange-500 text-xs mt-1">{errors.bic.message}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-start">
                  <input
                    {...register("confirmSEPA", { required: "Bitte erteile die Einzugsermächtigung" })}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Ich ermächtige den Kinderlicht Wallersdorf e.V., die von mir zu entrichtenden Zahlungen mittels Lastschrift einzuziehen.
                    (Hinweis: Innerhalb von acht Wochen kann der belastende Betrag rückerstattet werden.)
                  </span>
                </label>
                {errors.confirmSEPA && <p className="text-orange-500 text-xs mt-1">{errors.confirmSEPA.message}</p>}
              </div>
            </section>

            {/* Mitgliedschaft */}
            <section>
              {sectionHeader("Mitgliedschaft")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Eintrittsdatum */}
                <div>
                  <label className="block text-sm text-gray-600">Eintrittsdatum</label>
                  <input
                    {...register("join", { required: "Eintrittsdatum ist erforderlich" })}
                    type="date"
                    className={inputClasses}
                  />
                  {errors.join && <p className="text-orange-500 text-xs mt-1">{errors.join.message}</p>}
                </div>
                {/* Freiwillige Spende */}
                <div>
                  <label className="block text-sm text-gray-600">Freiwillige Spende (jährlich)</label>
                  <input
                    {...register("donation", { required: "Spendenbetrag ist erforderlich", valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className={inputClasses}
                  />
                  {errors.donation && <p className="text-orange-500 text-xs mt-1">{errors.donation.message}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-start">
                  <input
                    {...register("confirmDonationDocument", { required: "Bitte bestätige die Spendenbescheinigung" })}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-600">Spendenbescheinigung bestätigen</span>
                </label>
                {errors.confirmDonationDocument && (
                  <p className="text-orange-500 text-xs mt-1">{errors.confirmDonationDocument.message}</p>
                )}
              </div>
            </section>

            {/* Kontaktaufnahme */}
            <section>
              {sectionHeader("Kontaktaufnahme")}
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    {...register("contactEmail")}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-700">Wichtige Nachrichten per E-Mail</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    {...register("contactPost")}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-700">Wichtige Nachrichten per Post</span>
                </label>
              </div>
            </section>

            {/* Datenschutz */}
            <section>
              {sectionHeader("Datenschutz")}
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>
                    Die angegebenen Daten werden unter Berücksichtigung des BundesDatenschutz-Gesetzes (BDSG) erhoben und ausschließlich für Zwecke der Spendenverwaltung genutzt. Alle Inhalte werden an unsere Vereinsverwaltungssoftware Campai übermittelt.
                  </p>
                  <p className="mt-1">
                    Ich habe die Datenschutzbestimmungen gelesen, verstanden und akzeptiert. Weitere Informationen sowie Widerrufshinweise findest du in unserer Datenschutzerklärung.
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      {...register("confirmDataProtection", { required: "Datenschutz muss bestätigt werden" })}
                      type="checkbox"
                      className={checkboxClasses}
                    />
                    <span className="ml-2 text-sm text-gray-700">Datenschutz bestätigen</span>
                  </label>
                  {errors.confirmDataProtection && (
                    <p className="text-orange-500 text-xs mt-1">{errors.confirmDataProtection.message}</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Relatives – exakte Kopie aller Felder */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-[#FFA500] pb-2">
                Familien- und Partnermitgliedschaften
              </h2>
              <button
                type="button"
                onClick={addRelative}
                className="px-4 py-2 bg-[#FFA500] hover:bg-[#e69500] text-white rounded shadow text-sm"
              >
                Weitere hinzufügen
              </button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-300 rounded-lg p-4 mb-6 relative bg-white">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-[#FFA500] hover:text-[#e69500] text-2xl"
                >
                  &times;
                </button>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Angehöriger {index + 1}
                </h3>
                <div className="space-y-6">
                  {/* Persönliche Informationen */}
                  <section>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Persönliche Informationen</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">Anrede</label>
                        <select
                          {...register(`relatives.${index}.gender` as const, { required: "Anrede ist erforderlich" })}
                          className={inputClasses}
                        >
                          <option value="">Bitte wählen</option>
                          <option value="male">Herr</option>
                          <option value="female">Frau</option>
                          <option value="other">ohne</option>
                        </select>
                        {errors.relatives?.[index]?.gender && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].gender?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Vorname</label>
                        <input
                          {...register(`relatives.${index}.firstName` as const, { required: "Vorname ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.firstName && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].firstName?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Nachname</label>
                        <input
                          {...register(`relatives.${index}.lastName` as const, { required: "Nachname ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.lastName && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].lastName?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Geburtsdatum</label>
                        <input
                          {...register(`relatives.${index}.birthday` as const, { required: "Geburtsdatum ist erforderlich" })}
                          type="date"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.birthday && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].birthday?.message}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500">E-Mail</label>
                        <input
                          {...register(`relatives.${index}.email` as const, {
                            required: "E-Mail ist erforderlich",
                            pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Ungültige E-Mail-Adresse" },
                          })}
                          type="email"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.email && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].email?.message}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-500 text-sm">Die Person ist bereits ein Mitglied.</p>
                  </section>

                  {/* Adresse */}
                  <section>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Adresse</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500">Straße + Nr. (ggf. Adresszusatz)</label>
                        <input
                          {...register(`relatives.${index}.street` as const, { required: "Straße ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.street && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].street?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Postleitzahl / ZIP</label>
                        <input
                          {...register(`relatives.${index}.postalCode` as const, { required: "PLZ ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.postalCode && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].postalCode?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Ort</label>
                        <input
                          {...register(`relatives.${index}.city` as const, { required: "Ort ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.city && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].city?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Bundesland / Kanton</label>
                        <input
                          {...register(`relatives.${index}.state` as const, { required: "Bundesland ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.state && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].state?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Land</label>
                        <input
                          {...register(`relatives.${index}.country` as const, { required: "Land ist erforderlich" })}
                          type="text"
                          placeholder="Deutschland, Österreich, Schweiz"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.country && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].country?.message}</p>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Bankdetails */}
                  <section>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Bankdetails</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">IBAN</label>
                        <input
                          {...register(`relatives.${index}.iban` as const, { required: "IBAN ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.iban && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].iban?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">BIC</label>
                        <input
                          {...register(`relatives.${index}.bic` as const, { required: "BIC ist erforderlich" })}
                          type="text"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.bic && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].bic?.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-start">
                        <input
                          {...register(`relatives.${index}.confirmSEPA` as const, { required: "Bitte erteile die Einzugsermächtigung" })}
                          type="checkbox"
                          className={checkboxClasses}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Ich ermächtige den Kinderlicht Wallersdorf e.V., die von mir zu entrichtenden Zahlungen mittels Lastschrift einzuziehen.
                          (Hinweis: Innerhalb von acht Wochen kann der belastende Betrag rückerstattet werden.)
                        </span>
                      </label>
                      {errors.relatives?.[index]?.confirmSEPA && (
                        <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].confirmSEPA?.message}</p>
                      )}
                    </div>
                  </section>

                  {/* Mitgliedschaft */}
                  <section>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Mitgliedschaft</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500">Eintrittsdatum</label>
                        <input
                          {...register(`relatives.${index}.join` as const, { required: "Eintrittsdatum ist erforderlich" })}
                          type="date"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.join && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].join?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500">Freiwillige Spende (jährlich)</label>
                        <input
                          {...register(`relatives.${index}.donation` as const, { required: "Spendenbetrag ist erforderlich", valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          className={inputClasses}
                        />
                        {errors.relatives?.[index]?.donation && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].donation?.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="flex items-start">
                        <input
                          {...register(`relatives.${index}.confirmDonationDocument` as const, { required: "Bitte bestätige die Spendenbescheinigung" })}
                          type="checkbox"
                          className={checkboxClasses}
                        />
                        <span className="ml-2 text-sm text-gray-600">Spendenbescheinigung bestätigen</span>
                      </label>
                      {errors.relatives?.[index]?.confirmDonationDocument && (
                        <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].confirmDonationDocument?.message}</p>
                      )}
                    </div>
                  </section>

                  {/* Kontaktaufnahme */}
                  <section>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Kontaktaufnahme</h4>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          {...register(`relatives.${index}.contactEmail` as const)}
                          type="checkbox"
                          className={checkboxClasses}
                        />
                        <span className="ml-2 text-sm text-gray-700">E-Mail</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          {...register(`relatives.${index}.contactPost` as const)}
                          type="checkbox"
                          className={checkboxClasses}
                        />
                        <span className="ml-2 text-sm text-gray-700">Post</span>
                      </label>
                    </div>
                  </section>

                  {/* Datenschutz */}
                  <section>
                    <h4 className="text-lg font-medium text-gray-600 mb-2">Datenschutz</h4>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p>
                          Die angegebenen Daten werden unter Berücksichtigung des BundesDatenschutz-Gesetzes (BDSG) erhoben und ausschließlich für Zwecke der Spendenverwaltung genutzt. Alle Inhalte werden an unsere Vereinsverwaltungssoftware Campai übermittelt.
                        </p>
                        <p className="mt-1">
                          Ich habe die Datenschutzbestimmungen gelesen, verstanden und akzeptiert. Weitere Informationen sowie Widerrufshinweise findest du in unserer Datenschutzerklärung.
                        </p>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            {...register(`relatives.${index}.confirmDataProtection` as const, { required: "Datenschutz muss bestätigt werden" })}
                            type="checkbox"
                            className={checkboxClasses}
                          />
                          <span className="ml-2 text-sm text-gray-700">Datenschutz bestätigen</span>
                        </label>
                        {errors.relatives?.[index]?.confirmDataProtection && (
                          <p className="text-orange-500 text-xs mt-1">{errors.relatives[index].confirmDataProtection?.message}</p>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            ))}
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-10 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded shadow-md text-lg font-semibold"
            >
              Senden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
