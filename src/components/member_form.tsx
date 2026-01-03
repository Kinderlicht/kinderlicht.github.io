import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import FormSuccess from "./form_success";
import FormFail from "./form_fail";

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
  confirmDonationDocument: boolean;
  // Datenschutz
  confirmDataProtection: boolean;
};

// New type for existing family members (now including birthday)
type ExistingFamilyMember = {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  relation:
    | "Erziehungsberechtigte*r"
    | "Kind"
    | "Geschwister"
    | "Verwandte*r ersten Grades"
    | "Partner*in";
};

// The main member type now includes an array of relatives and existing family members
type Member = BaseMember & {
  relatives: BaseMember[];
  existingFamilyMembers: ExistingFamilyMember[];
};

export function calculateAge(birthDate: Date | string) {
  if (!birthDate) return 18;
  if (typeof birthDate === "string") {
    birthDate = new Date(birthDate);
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getAgeLimit(maxAge: number) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const maxAgeYearsAgo = new Date();
  maxAgeYearsAgo.setFullYear(currentYear - maxAge);
  maxAgeYearsAgo.setDate(maxAgeYearsAgo.getDate());
  return maxAgeYearsAgo;
}

const MemberForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Member>({
    mode: "onChange",
    defaultValues: {
      gender: "",
      firstName: "",
      lastName: "",
      birthday: getAgeLimit(18).toISOString().split("T")[0],
      email: "",
      street: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
      iban: "",
      bic: "",
      confirmSEPA: false,
      join: new Date().toISOString().split("T")[0],
      donation: 0,
      contactEmail: false,
      contactPost: false,
      confirmDonationDocument: false,
      confirmDataProtection: false,
      relatives: [],
      existingFamilyMembers: [],
    },
  });

  // Field array for new relatives
  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatives",
  });

  // Field array for existing family members
  const {
    fields: existingFields,
    append: appendExisting,
    remove: removeExisting,
  } = useFieldArray({
    control,
    name: "existingFamilyMembers",
  });

  // Calculate if discount applies (if at least one additional Angehörige is added)
  const hasDiscount = fields.length + existingFields.length > 0;
  const discount = hasDiscount ? 3 : 0;

  // Helper function to compute the fee for a member based on birthday
  // Adult: 24€, Child (<18): 12€
  const computePrice = (birthday?: string) => {
    if (birthday) {
      const age = calculateAge(new Date(birthday));
      return (age >= 18 ? 24 : 12) - discount;
    }
    return 24 - discount;
  };

  const computeRequest = (data: Member) => {
    return {
      formData: {
        // allData: JSON.stringify({
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday.split("T")[0],
        street: data.street,
        postalCode: data.postalCode,
        city: data.city,
        state: data.state,
        country: data.country,
        email: data.email,
        contactContainer: [
          data.contactEmail ? "Email" : "keine Emails",
          data.contactPost ? "Post" : "keine Post",
        ],
        join: data.join.split("T")[0],
        relatives:
          "{existing: " +
          JSON.stringify(data.existingFamilyMembers) +
          ", new: " +
          JSON.stringify(data.relatives) +
          "}",
        donation: data.donation,
        confirmDonationDocumentContainer: [
          data.confirmDonationDocument.toString(),
        ],
        iban: data.iban,
        bic: data.bic,
        confirmPaymentContainer: [data.confirmSEPA.toString()],
        confirmDataProtectionContainer: [data.confirmDataProtection.toString()],
      },
      confirmationMail: data.email,
    };
  };

  // Success state for form submission
  const [success, setSuccess] = React.useState<number>(-1);

  const onSubmit = (data: Member) => {
    const { relatives, existingFamilyMembers, ...baseMember } = data;

    const relativeMembers = data.relatives.map((relative) => ({
      ...relative,
      relatives: [baseMember, ...data.relatives.filter((r) => r !== relative)],
      existingFamilyMembers: [],
    }));

    const members = [data, ...relativeMembers];
    members.forEach((element) => {
      const request = computeRequest(element);
      fetch("https://api.campai.com/formSubmissions/64edd24425030d7d29ddfecc", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(request),
      })
        .then((res) => {
          if (res.status > 499) {
            setSuccess(500);
            throw new Error("Campai response was not ok");
          } else if (res.status > 399) {
            setSuccess(400);
            throw new Error("Campai response was not ok");
          } else if (!res.ok) {
            setSuccess(500);
            throw new Error("Campai response was not ok");
          }
          setSuccess(0);
          return res.json();
        })
        .catch((_) => {});
    });
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
      confirmSEPA: false,
      join: values.join,
      donation: values.donation,
      contactEmail: values.contactEmail,
      contactPost: values.contactPost,
      confirmDonationDocument: false,
      confirmDataProtection: false,
    });
  };

  // When adding an existing family member, start with empty fields
  const addExistingFamilyMember = () => {
    appendExisting({
      firstName: "",
      lastName: "",
      email: "",
      birthday: "",
      relation: "Verwandte*r ersten Grades",
    });
  };

  // Reusable section header with icon and gradient underline
  const sectionHeader = (title: string, emoji?: string) => (
    <div className="flex items-center gap-3 mb-6">
      {emoji && <span className="text-2xl">{emoji}</span>}
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        {title}
      </h2>
    </div>
  );

  // Common styling for inputs and checkboxes - more rounded and friendly
  const inputClasses =
    "mt-1 w-full rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 p-3 transition-all duration-200 bg-gray-50 hover:bg-white outline-none";
  const checkboxClasses =
    "h-5 w-5 text-orange-500 border-2 border-gray-300 rounded-md cursor-pointer accent-orange-500";

  // Main member's dynamic price calculation using watched birthday
  const mainBirthday = watch("birthday");
  const mainMemberPrice = computePrice(mainBirthday);

  // Styled badge for price display - more prominent and friendly
  const PriceBadge = ({ price, title }: { price: number; title: string }) => (
    <div className="mt-4 flex justify-end">
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
        <span className="text-lg">✨</span>
        <span>{title}: {price} €</span>
      </div>
    </div>
  );

  return success === 0 ? (
    <FormSuccess />
  ) : success === 500 ? (
    <FormFail recover={JSON.stringify(getValues())} />
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Friendly Header Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-orange-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mb-4 shadow-lg">
              <span className="text-4xl">🌟</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Willkommen bei Kinderlicht!</h1>
            <p className="text-gray-600 text-lg mb-4">
              Werde Teil unserer Gemeinschaft und hilf uns, Kinderaugen zum Leuchten zu bringen.
            </p>
            <div className="bg-orange-50 rounded-2xl p-4 text-left max-w-2xl mx-auto">
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-semibold text-orange-600">💡 Gut zu wissen:</span> Der Basisbeitrag beträgt <span className="font-bold">24€</span> für Erwachsene und <span className="font-bold">12€</span> für Kinder.
                Bei Familienmitgliedschaften gibt es <span className="font-bold text-green-600">3€ Rabatt</span> pro Person!
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Member Form */}
          <div className="space-y-8">
            <section className="bg-gray-50 rounded-2xl p-6">
              {sectionHeader("Persönliche Informationen", "👤")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Anrede */}
                <div>
                  <label className="block text-sm text-gray-600">Anrede</label>
                  <select
                    {...register("gender", {
                      required: "Anrede ist erforderlich",
                    })}
                    className={inputClasses}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                    <option value="ohne">ohne</option>
                  </select>
                  {errors.gender && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
                {/* Vorname */}
                <div>
                  <label className="block text-sm text-gray-600">Vorname</label>
                  <input
                    {...register("firstName", {
                      required: "Vorname ist erforderlich",
                    })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.firstName && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                {/* Nachname */}
                <div>
                  <label className="block text-sm text-gray-600">
                    Nachname
                  </label>
                  <input
                    {...register("lastName", {
                      required: "Nachname ist erforderlich",
                    })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.lastName && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                {/* Geburtsdatum */}
                <div>
                  <label className="block text-sm text-gray-600">
                    Geburtsdatum
                  </label>
                  <input
                    {...register("birthday", {
                      required: "Geburtsdatum ist erforderlich",
                      validate: {
                        is_seven: (v) =>
                          calculateAge(v) >= 7 ||
                          "Du musst mindestens 7 Jahre alt sein.",
                        is_too_old: (v) =>
                          calculateAge(v) <= 150 ||
                          "Ich denke nicht, dass du schon 150 Jahre alt bist.",
                      },
                    })}
                    type="date"
                    className={inputClasses}
                  />
                  {errors.birthday && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.birthday.message}
                    </p>
                  )}
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
                  {errors.email && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Adresse */}
            <section className="bg-gray-50 rounded-2xl p-6">
              {sectionHeader("Adresse", "🏠")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600">
                    Straße + Nr. (ggf. Adresszusatz)
                  </label>
                  <input
                    {...register("street", {
                      required: "Straße ist erforderlich",
                    })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.street && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Postleitzahl / ZIP
                  </label>
                  <input
                    {...register("postalCode", {
                      required: "PLZ ist erforderlich",
                    })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.postalCode && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Ort</label>
                  <input
                    {...register("city", { required: "Ort ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.city && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Bundesland / Kanton
                  </label>
                  <input
                    {...register("state", {
                      required: "Bundesland ist erforderlich",
                    })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.state && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Land</label>
                  <input
                    {...register("country", {
                      required: "Land ist erforderlich",
                    })}
                    type="text"
                    placeholder="Deutschland, Österreich, Schweiz"
                    className={inputClasses}
                  />
                  {errors.country && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Bankdetails */}
            <section className="bg-gray-50 rounded-2xl p-6">
              {sectionHeader("Bankdetails", "🏦")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">IBAN</label>
                  <input
                    {...register("iban", { required: "IBAN ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.iban && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.iban.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">BIC</label>
                  <input
                    {...register("bic", { required: "BIC ist erforderlich" })}
                    type="text"
                    className={inputClasses}
                  />
                  {errors.bic && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.bic.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-start">
                  <input
                    {...register("confirmSEPA", {
                      required: "Bitte erteile die Einzugsermächtigung",
                    })}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Ich ermächtige den Kinderlicht Wallersdorf e.V., die von mir
                    zu entrichtenden Zahlungen mittels Lastschrift einzuziehen.
                    (Hinweis: Innerhalb von acht Wochen kann der belastende
                    Betrag rückerstattet werden.)
                  </span>
                </label>
                {errors.confirmSEPA && (
                  <p className="text-orange-500 text-xs mt-1">
                    {errors.confirmSEPA.message}
                  </p>
                )}
              </div>
            </section>

            {/* Mitgliedschaft */}
            <section className="bg-gray-50 rounded-2xl p-6">
              {sectionHeader("Mitgliedschaft", "🤝")}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">
                    Eintrittsdatum
                  </label>
                  <input
                    {...register("join", {
                      required: "Eintrittsdatum ist erforderlich",
                    })}
                    type="date"
                    className={inputClasses}
                  />
                  {errors.join && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.join.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Freiwillige Spende (jährlich)
                  </label>
                  <input
                    {...register("donation", {
                      required: "Spendenbetrag ist erforderlich",
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="1"
                    min="0"
                    className={inputClasses}
                  />
                  {errors.donation && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.donation.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-start">
                  <input
                    {...register("confirmDonationDocument", {})}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Ich möchte zum Ende des Geschäftsjahres eine
                    Spendenbescheinigung in Höhe{" "}
                    {mainMemberPrice + watch("donation")} € von erhalten.
                  </span>
                </label>
                {errors.confirmDonationDocument && (
                  <p className="text-orange-500 text-xs mt-1">
                    {errors.confirmDonationDocument.message}
                  </p>
                )}
              </div>

              <PriceBadge
                price={mainMemberPrice + watch("donation")}
                title="Jährlicher Beitrag"
              />
            </section>

            {/* Kontaktaufnahme */}
            <section className="bg-gray-50 rounded-2xl p-6">
              {sectionHeader("Kontaktaufnahme", "📬")}
              <div className="text-sm text-gray-600 mb-4 bg-blue-50 rounded-xl p-4">
                <p>
                  💌 Lasse dich über unsere bevorstehenden Aktionen informieren.
                  Falls du nichts auswählst, kontaktieren wir dich
                  ausschließlich per Post und nur dann, wenn es von Amtes wegen
                  erforderlich ist.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
                <label className="inline-flex items-center">
                  <input
                    {...register("contactEmail")}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Wichtige Nachrichten per E-Mail
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    {...register("contactPost")}
                    type="checkbox"
                    className={checkboxClasses}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Wichtige Nachrichten per Post
                  </span>
                </label>
              </div>
            </section>

            {/* Datenschutz */}
            <section className="bg-gray-50 rounded-2xl p-6">
              {sectionHeader("Datenschutz", "🔒")}
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>
                    Die angegebenen Daten werden unter Berücksichtigung des
                    BundesDatenschutz-Gesetzes (BDSG) erhoben und ausschließlich
                    für Zwecke der Spendenverwaltung genutzt. Alle Inhalte
                    werden an unsere Vereinsverwaltungssoftware Campai
                    übermittelt. Das bedeuet auch, dass die IP-Adresse des
                    Nutzers an Campai übermittelt wird. Die
                    Datenschutzbestimmungen von Campai findest du{" "}
                    <a
                      className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      href="https://www.campai.com/datenschutz/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      hier
                    </a>
                    .
                  </p>
                  <p className="mt-1">
                    Ich habe die Datenschutzbestimmungen gelesen, verstanden und
                    akzeptiert. Weitere Informationen sowie Widerrufshinweise
                    findest du in unserer{" "}
                    <a
                      className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                      href="/rechtliches"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Datenschutzerklärung
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      {...register("confirmDataProtection", {
                        required: "Datenschutz muss bestätigt werden",
                      })}
                      type="checkbox"
                      className={checkboxClasses}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Datenschutz bestätigen
                    </span>
                  </label>
                  {errors.confirmDataProtection && (
                    <p className="text-orange-500 text-xs mt-1">
                      {errors.confirmDataProtection.message}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Relatives Section */}

          {/* Hinweis Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Familienmitgliedschaft</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Falls Angehörige bereits Mitglied sind oder hier mit angelegt werden,
                  erhalten <span className="font-semibold text-green-600">alle Parteien 3€ Rabatt</span> auf den jährlichen Beitrag.
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  Als Angehörige gelten: Eltern, Kinder, Geschwister und gesetzlich anerkannte Partner*innen.
                </p>
                <p className="text-gray-500 text-xs italic">
                  Ein Nachweis über das Verhältnis kann auf Anfrage erforderlich sein.
                </p>
              </div>
            </div>
          </div>
          <section className="bg-white rounded-2xl border-2 border-dashed border-orange-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">➕</span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Neue Angehörige anlegen
                </h2>
              </div>
              <button
                type="button"
                onClick={addRelative}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <span>👤</span> Angehörige*n hinzufügen
              </button>
            </div>
            {fields.map((field, index) => {
              const relativeBirthday = watch(`relatives.${index}.birthday`);
              const relativePrice = computePrice(relativeBirthday);
              return (
                <div
                  key={field.id}
                  className="border-2 border-orange-200 rounded-2xl p-6 mb-6 relative bg-gradient-to-br from-orange-50 to-amber-50 shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 rounded-full transition-colors text-lg font-bold"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Angehörige*r {index + 1}
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {/* Persönliche Informationen */}
                    <section>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Persönliche Informationen
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-500">
                            Anrede
                          </label>
                          <select
                            {...register(`relatives.${index}.gender` as const, {
                              required: "Anrede ist erforderlich",
                            })}
                            className={inputClasses}
                          >
                            <option value="">Bitte wählen</option>
                            <option value="Herr">Herr</option>
                            <option value="Frau">Frau</option>
                            <option value="ohne">ohne</option>
                          </select>
                          {errors.relatives?.[index]?.gender && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].gender?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Vorname
                          </label>
                          <input
                            {...register(
                              `relatives.${index}.firstName` as const,
                              { required: "Vorname ist erforderlich" }
                            )}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.firstName && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].firstName?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Nachname
                          </label>
                          <input
                            {...register(
                              `relatives.${index}.lastName` as const,
                              { required: "Nachname ist erforderlich" }
                            )}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.lastName && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].lastName?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Geburtsdatum
                          </label>
                          <input
                            {...register(
                              `relatives.${index}.birthday` as const,
                              {
                                required: "Geburtsdatum ist erforderlich",
                                validate: {
                                  is_seven: (v) =>
                                    calculateAge(v) >= 7 ||
                                    "Mindestens 7 Jahre alt sein.",
                                  is_too_old: (v) =>
                                    calculateAge(v) <= 150 ||
                                    "Nicht älter als 150 Jahre.",
                                },
                              }
                            )}
                            type="date"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.birthday && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].birthday?.message}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-500">
                            E-Mail
                          </label>
                          <input
                            {...register(`relatives.${index}.email` as const, {
                              required: "E-Mail ist erforderlich",
                              pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Ungültige E-Mail-Adresse",
                              },
                            })}
                            type="email"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.email && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].email?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* Adresse */}
                    <section>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Adresse
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-500">
                            Straße + Nr. (ggf. Adresszusatz)
                          </label>
                          <input
                            {...register(`relatives.${index}.street` as const, {
                              required: "Straße ist erforderlich",
                            })}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.street && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].street?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Postleitzahl / ZIP
                          </label>
                          <input
                            {...register(
                              `relatives.${index}.postalCode` as const,
                              { required: "PLZ ist erforderlich" }
                            )}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.postalCode && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].postalCode?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Ort
                          </label>
                          <input
                            {...register(`relatives.${index}.city` as const, {
                              required: "Ort ist erforderlich",
                            })}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.city && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].city?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Bundesland / Kanton
                          </label>
                          <input
                            {...register(`relatives.${index}.state` as const, {
                              required: "Bundesland ist erforderlich",
                            })}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.state && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].state?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            Land
                          </label>
                          <input
                            {...register(
                              `relatives.${index}.country` as const,
                              { required: "Land ist erforderlich" }
                            )}
                            type="text"
                            placeholder="Deutschland, Österreich, Schweiz"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.country && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].country?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* Bankdetails */}
                    <section>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Bankdetails
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-500">
                            IBAN
                          </label>
                          <input
                            {...register(`relatives.${index}.iban` as const, {
                              required: "IBAN ist erforderlich",
                            })}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.iban && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].iban?.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500">
                            BIC
                          </label>
                          <input
                            {...register(`relatives.${index}.bic` as const, {
                              required: "BIC ist erforderlich",
                            })}
                            type="text"
                            className={inputClasses}
                          />
                          {errors.relatives?.[index]?.bic && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.relatives[index].bic?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="flex items-start">
                          <input
                            {...register(
                              `relatives.${index}.confirmSEPA` as const,
                              {
                                required:
                                  "Bitte erteile die Einzugsermächtigung",
                              }
                            )}
                            type="checkbox"
                            className={checkboxClasses}
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Ich ermächtige den Kinderlicht Wallersdorf e.V., die
                            Zahlungen mittels Lastschrift einzuziehen.
                          </span>
                        </label>
                        {errors.relatives?.[index]?.confirmSEPA && (
                          <p className="text-orange-500 text-xs mt-1">
                            {errors.relatives[index].confirmSEPA?.message}
                          </p>
                        )}
                      </div>
                    </section>

                    {/* Mitgliedschaft */}
                    <section>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Mitgliedschaft
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600">
                            Eintrittsdatum
                          </label>
                          <input
                            {...register(`relatives.${index}.join`, {
                              required: "Eintrittsdatum ist erforderlich",
                            })}
                            type="date"
                            className={inputClasses}
                          />
                          {errors.join && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.join.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">
                            Freiwillige Spende (jährlich)
                          </label>
                          <input
                            {...register(`relatives.${index}.donation`, {
                              required: "Spendenbetrag ist erforderlich",
                              valueAsNumber: true,
                            })}
                            type="number"
                            step="1"
                            min={0}
                            className={inputClasses}
                          />
                          {errors.donation && (
                            <p className="text-orange-500 text-xs mt-1">
                              {errors.donation.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="flex items-start">
                          <input
                            {...register(
                              `relatives.${index}.confirmDonationDocument`,
                              {}
                            )}
                            type="checkbox"
                            className={checkboxClasses}
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Ich möchte zum Ende des Geschäftsjahres eine
                            Spendenbescheinigung in Höhe von{" "}
                            {relativePrice +
                              watch(`relatives.${index}.donation`)}{" "}
                            € erhalten.
                          </span>
                        </label>
                        {errors.confirmDonationDocument && (
                          <p className="text-orange-500 text-xs mt-1">
                            {errors.confirmDonationDocument.message}
                          </p>
                        )}
                      </div>
                    </section>

                    <PriceBadge
                      price={
                        relativePrice + watch(`relatives.${index}.donation`)
                      }
                      title="Jährlicher Beitrag"
                    />

                    {/* Kontaktaufnahme */}
                    <section>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Kontaktaufnahme
                      </h4>
                      <div className="text-sm text-gray-600 mb-2">
                        <p>
                          Lasse dich über unsere bevorstehenden Aktionen
                          informieren. Falls du nichts auswählst, kontaktieren
                          wir dich ausschließlich per Post.
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            {...register(
                              `relatives.${index}.contactEmail` as const
                            )}
                            type="checkbox"
                            className={checkboxClasses}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            E-Mail
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            {...register(
                              `relatives.${index}.contactPost` as const
                            )}
                            type="checkbox"
                            className={checkboxClasses}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Post
                          </span>
                        </label>
                      </div>
                    </section>

                    {/* Datenschutz */}
                    <section>
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Datenschutz
                      </h4>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          <p>
                            Die angegebenen Daten werden unter Berücksichtigung
                            des BundesDatenschutz-Gesetzes (BDSG) erhoben und
                            ausschließlich für Zwecke der Spendenverwaltung
                            genutzt. Alle Inhalte werden an unsere
                            Vereinsverwaltungssoftware Campai übermittelt. Das
                            bedeuet auch, dass die IP-Adresse des Nutzers an
                            Campai übermittelt wird. Die Datenschutzbestimmungen
                            von Campai findest du{" "}
                            <a
                              className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                              href="https://www.campai.com/datenschutz/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              hier
                            </a>
                            .
                          </p>
                          <p className="mt-1">
                            Ich habe die Datenschutzbestimmungen gelesen,
                            verstanden und akzeptiert. Weitere Informationen
                            sowie Widerrufshinweise findest du in unserer{" "}
                            <a
                              className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                              href="/rechtliches"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Datenschutzerklärung
                            </a>
                            .
                          </p>
                        </div>
                        <div>
                          <label className="inline-flex items-center">
                            <input
                              {...register(
                                `relatives.${index}.confirmDataProtection` as const,
                                {
                                  required: "Datenschutz muss bestätigt werden",
                                }
                              )}
                              type="checkbox"
                              className={checkboxClasses}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Datenschutz bestätigen
                            </span>
                          </label>
                          {errors.relatives?.[index]?.confirmDataProtection && (
                            <p className="text-orange-500 text-xs mt-1">
                              {
                                errors.relatives[index].confirmDataProtection
                                  ?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Existing Family Members Section */}
          <section className="bg-white rounded-2xl border-2 border-dashed border-green-200 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Bestehendes Mitglied verknüpfen
                </h2>
              </div>
              <button
                type="button"
                onClick={addExistingFamilyMember}
                className="px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <span>🔍</span> Mitglied suchen
              </button>
            </div>

            {existingFields.map((field, index) => {
              const existingBirthday = watch(
                `existingFamilyMembers.${index}.birthday`
              );
              const existingPrice = computePrice(existingBirthday);
              return (
                <div
                  key={field.id}
                  className="border-2 border-green-200 rounded-2xl p-6 mb-6 relative bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => removeExisting(index)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 rounded-full transition-colors text-lg font-bold"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500">
                        Vorname
                      </label>
                      <input
                        {...register(
                          `existingFamilyMembers.${index}.firstName` as const,
                          { required: "Vorname ist erforderlich" }
                        )}
                        type="text"
                        className={inputClasses}
                      />
                      {errors.existingFamilyMembers?.[index]?.firstName && (
                        <p className="text-orange-500 text-xs mt-1">
                          {
                            errors.existingFamilyMembers[index].firstName
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">
                        Nachname
                      </label>
                      <input
                        {...register(
                          `existingFamilyMembers.${index}.lastName` as const,
                          { required: "Nachname ist erforderlich" }
                        )}
                        type="text"
                        className={inputClasses}
                      />
                      {errors.existingFamilyMembers?.[index]?.lastName && (
                        <p className="text-orange-500 text-xs mt-1">
                          {
                            errors.existingFamilyMembers[index].lastName
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">
                        E-Mail
                      </label>
                      <input
                        {...register(
                          `existingFamilyMembers.${index}.email` as const,
                          {
                            required: "E-Mail ist erforderlich",
                            pattern: {
                              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                              message: "Ungültige E-Mail-Adresse",
                            },
                          }
                        )}
                        type="email"
                        className={inputClasses}
                      />
                      {errors.existingFamilyMembers?.[index]?.email && (
                        <p className="text-orange-500 text-xs mt-1">
                          {errors.existingFamilyMembers[index].email?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">
                        Geburtsdatum
                      </label>
                      <input
                        {...register(
                          `existingFamilyMembers.${index}.birthday` as const,
                          {
                            required: "Geburtsdatum ist erforderlich",
                            valueAsDate: true,
                            validate: {
                              is_seven: (v) =>
                                calculateAge(v) >= 7 ||
                                "Mindestens 7 Jahre alt sein.",
                              is_too_old: (v) =>
                                calculateAge(v) <= 150 ||
                                "Nicht älter als 150 Jahre.",
                            },
                          }
                        )}
                        type="date"
                        className={inputClasses}
                      />
                      {errors.existingFamilyMembers?.[index]?.birthday && (
                        <p className="text-orange-500 text-xs mt-1">
                          {
                            errors.existingFamilyMembers[index].birthday
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500">
                        Beziehung
                      </label>
                      <select
                        {...register(
                          `existingFamilyMembers.${index}.relation` as const,
                          { required: "Beziehung ist erforderlich" }
                        )}
                        className={inputClasses}
                      >
                        <option value="">Bitte wählen</option>
                        <option value="Erziehungsberechtigte*r">
                          Erziehungsberechtigte*r
                        </option>
                        <option value="Kind">Kind</option>
                        <option value="Geschwister">Geschwister</option>
                        <option value="Verwandte*r ersten Grades">
                          Verwandte*r ersten Grades
                        </option>
                        <option value="Partner*in">
                          Partner*in
                        </option>
                      </select>
                      {errors.existingFamilyMembers?.[index]?.relation && (
                        <p className="text-orange-500 text-xs mt-1">
                          {
                            errors.existingFamilyMembers[index].relation
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <PriceBadge
                    price={existingPrice}
                    title="Neuer Sockelbetrag"
                  />
                </div>
              );
            })}
          </section>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="px-12 py-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-bold flex items-center gap-3 mx-auto"
            >
              <span>📨</span> Antrag absenden
            </button>
          </div>
        </form>
        {success === 400 && (
          <div
            className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 mt-6 flex items-start gap-4"
            role="alert"
          >
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="font-bold text-orange-800 text-lg">Ups, da stimmt etwas nicht...</p>
              <p className="text-orange-700 mt-1">
                Campai konnte deinen Antrag nicht verarbeiten. Bitte überprüfe deine
                E-Mail-Adresse, IBAN, BIC und das Geburtsdatum.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
