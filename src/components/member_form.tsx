import React from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import FormFail from "./form_fail";
import FormSuccess from "./form_success";
import FamilyMembershipForm, { Relative } from "./family_membership_form";

export function ErrorMessage({
  field,
  error,
}: {
  field: FieldError | undefined | boolean;
  error: string;
}) {
  return <>{field && <div className="text-sm text-red-500">{error}</div>}</>;
}

interface Member {
  gender: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  iban: string;
  bic: string;
  join: Date;
  relatives: Relative[];
  donation: number;
  confirmDonationDocument: boolean;
  confirmPayment: boolean;
  contactEmail: boolean;
  contactPost: boolean;
  confirmDataProtection: boolean;
}

export function calculateAge(birthDate: Date) {
  if (birthDate === undefined) {
    return 18;
  }
  const today = new Date();
  let age_now = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
}

function getAgeLimit(maxAge: number) {
  const today = new Date();
  const currentYear = today.getFullYear();

  const maxAgeYearsAgo = new Date();
  maxAgeYearsAgo.setFullYear(currentYear - maxAge);
  maxAgeYearsAgo.setDate(maxAgeYearsAgo.getDate() - 1); // include today
  return maxAgeYearsAgo;
}

function baseFee(member: Member): number {
  if (member.birthday === undefined) {
    return 24;
  }
  const isChild = calculateAge(member.birthday) < 18;
  if (member.relatives === undefined || member.relatives.length == 0) {
    return isChild ? 12 : 24;
  }
  const numChildren =
    member.relatives.filter(
      (member) => member.birthday && calculateAge(member.birthday) < 18
    ).length + (isChild ? 1 : 0);
  const numAdults =
    member.relatives.filter(
      (member) => member.birthday && calculateAge(member.birthday) >= 18
    ).length + (isChild ? 0 : 1);
  if (numChildren === 1 && numAdults === 0) {
    // Only a child
    return 12;
  }
  if (numAdults === 1) {
    if (numChildren === 0) {
      // Normal full aged
      return 24;
    }
    // Family with 1 adult
    return 33 + (numChildren - 1) * 9;
  }
  if (numChildren === 0) {
    // partnership
    return 42;
  }
  // family with 2 adults
  return 54 + (numChildren - 1) * 9;
}

function calculateFee(member: Member): number {
  return baseFee(member) + parseInt((member.donation || "0").toString());
}

export default function MemberForm() {
  // -1: not submitted, 1: error, 0: success
  let [success, setSuccess] = React.useState(-1);
  let [recover, setRecover] = React.useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useForm<Member>({ mode: "onChange" });
  const familyMembers = watch("relatives", []);

  const onSubmit: SubmitHandler<Member> = (data) => {
    const request = {
      formData: {
        // allData: JSON.stringify({
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: data.birthday.toISOString().split("T")[0],
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
        join: data.join.toISOString().split("T")[0],
        relatives: JSON.stringify(data.relatives),
        donation: data.donation,
        confirmDonationDocumentContainer: [
          data.confirmDonationDocument.toString(),
        ],
        iban: data.iban,
        bic: data.bic,
        confirmPaymentContainer: [data.confirmPayment.toString()],
        confirmDataProtectionContainer: [data.confirmDataProtection.toString()],
        //}),
        //email: data.email
      },
      confirmationMail: data.email,
    };
    fetch("https://api.campai.com/formSubmissions/64edd24425030d7d29ddfecc", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Status not ok.");
        }
        return res.json();
      })
      .then((_) => {
        setSuccess(0);
      })
      .catch((e) => {
        setRecover(JSON.stringify(request));
        setSuccess(1);
      });
  };
  const eighteenYearsAgo = getAgeLimit(18);

  return (
    <>
      {success == 0 && <FormSuccess />}
      {success != 0 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Mitgliedsantrag
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Der Mitgliedsantrag muss bestätigt werden, gib also bitte eine
                gültige E-Mail Adresse an.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-2">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Anrede
                  </label>
                  <div className="mt-2">
                    <select
                      {...register("gender", { required: true })}
                      id="gender"
                      autoComplete="honorific-prefix"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>Frau</option>
                      <option>Herr</option>
                      <option>ohne</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Vorname
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("firstName", { required: true })}
                      type="text"
                      id="first-name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.firstName}
                      error="Vorname wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Nachname
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("lastName", { required: true })}
                      type="text"
                      id="last-name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.lastName}
                      error="Nachname wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    E-Mail
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("email", {
                        required: true,
                        pattern: /^\S+@\S+$/i,
                      })}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.email}
                      error={
                        errors.email?.ref?.value
                          ? errors.email.ref.value.toString() +
                            " ist keine gültige E-Mail"
                          : "E-Mail wird benötigt"
                      }
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="birth"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Geburtsdatum
                  </label>
                  <div className="mt-2">
                    <input
                      id="birth"
                      type="date"
                      defaultValue={
                        eighteenYearsAgo.toISOString().split("T")[0]
                      }
                      {...register("birthday", {
                        required: true,
                        valueAsDate: true,
                        validate: {
                          is_seventeen: (v) =>
                            calculateAge(v) >= 7 ||
                            "Du musst mindestens 7 Jahre alt sein, um uns beizutreten.",
                          is_too_old: (v) =>
                            calculateAge(v) <= 150 ||
                            "Ich denke nicht, dass du schon 150 Jahre alt bist.",
                        },
                      })}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.birthday}
                      error={
                        errors.birthday?.message
                          ? errors.birthday?.message
                          : "Bitte gib dein Geburtsdatum an."
                      }
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Straße + Nr. (ggf. Adresszusatz)
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("street", { required: true })}
                      type="text"
                      id="street-address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.street}
                      error="Adresse wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Postleitzahl / ZIP
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("postalCode", { required: true })}
                      type="text"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.postalCode}
                      error="Postleitzahl / ZIP wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Ort
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("city", { required: true })}
                      type="text"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.city}
                      error="Ort wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="sm:col-span-3 col-span-3">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Bundesland / Kanton
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("state", { required: true })}
                      type="text"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.state}
                      error="Bundesland / Kanton wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="sm:col-span-3 col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Land
                  </label>
                  <div className="mt-2">
                    <select
                      {...register("country", { required: true })}
                      id="country"
                      autoComplete="country-name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      <option>Deutschland</option>
                      <option>Österreich</option>
                      <option>Schweiz</option>
                    </select>
                    <ErrorMessage
                      field={errors.country}
                      error="Land wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Bankdetails
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Wir ziehen deinen Mitgliedsbeitrag über ein
                SEPA-Lastschriftmandat ein. Du kannst die Ermächtigung jederzeit
                widerufen.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="iban"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    IBAN
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("iban", { required: true })}
                      type="text"
                      id="iban"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.iban}
                      error="IBAN wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="bic"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    BIC
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("bic", { required: true })}
                      type="text"
                      id="bic"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.bic}
                      error="BIC wird benötigt"
                    ></ErrorMessage>
                  </div>
                </div>

                <fieldset className="col-span-full">
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Einzugsermächtigung
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          {...register("confirmPayment", { required: true })}
                          id="bank-yes"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="bank-yes"
                          className="font-medium text-gray-900"
                        >
                          Ermächtigung erteilen.
                          <ErrorMessage
                            field={errors.confirmPayment}
                            error="Die Einzugsermächtigung muss erteilt werden."
                          ></ErrorMessage>
                        </label>
                        <p className="text-gray-500">
                          Ich ermächtige hiermit den Kinderlicht Wallerdrof
                          e.V., die von mir zu entrichtenden Zahlungen bei
                          Fälligkeit von meinem Konto mittels Lastschrift
                          einzuziehen. Ich weise mein Kreditinstitut an, die von
                          Kinderlicht Wallersdorf e.V. auf mein Konto gezogenen
                          Lastschriften einzulösen. Hinweis: Ich kann innerhalb
                          von acht Wochen, beginnend mit dem Belastungsdatum,
                          die Erstattung des belastenden Beitrags verlangen. Es
                          gelten dabei die mit meinem Kreditinstitut
                          vereinbarten Bedingungen.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Mitgliedschaft
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Spenden, Mitgliedsbeiträge und sonstige Zuwendungen an den
                Verein. Familien- und Partnermitgliedschaften sind vergünstigt.
                Der Endbetrag wird automatisch berechnet. Alle Mitgliedschaften
                sind jederzeit kündbar. Du hast angegeben, dass du inklusive
                Mitgliedsbeitrag jährlich {calculateFee(watch())} € spenden
                möchtest.
              </p>
              {
                /*ToDo: Download Link*/ calculateAge(watch("birthday")) <
                  18 && (
                  <p className="text-primary text-sm leading-6">
                    Da du noch unter 18 Jahre alt bist, erhältst du von uns
                    separat eine zweite E-Mail mit einem Dokument, dass deine
                    Erziehungsberechtigten postalisch und unterzeichnet an uns
                    zurückschicken müssen.
                  </p>
                )
              }

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="join"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Eintrittsdatum
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("join", {
                        required: true,
                        valueAsDate: true,
                        validate: {
                          is_past: (v) =>
                            // yesterday
                            v >=
                              new Date(
                                new Date().valueOf() - 1000 * 60 * 60 * 24
                              ) ||
                            "Das Datum kann nicht in der Vergangenheit liegen.",
                        },
                      })}
                      id="join"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      field={errors.join}
                      error={
                        errors.join?.message
                          ? errors.join.message
                          : "Das Eintrittdatum muss angegeben sein."
                      }
                    ></ErrorMessage>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="donation"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Freiwillige Spende
                  </label>
                  <div className="mt-2">
                    <input
                      {...register("donation", {
                        required: false,
                        min: 0,
                        max: 1000000,
                      })}
                      id="donation"
                      type="number"
                      defaultValue={0}
                      min={0}
                      max={10000000}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <fieldset className="col-span-full">
                  <div className="space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          {...register("confirmDonationDocument", {
                            required: false,
                          })}
                          id="confirmation-yes"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="confirmation-yes"
                          className="font-medium text-gray-900"
                        >
                          Ich möchte eine Spendenbescheinigung über{" "}
                          {calculateFee(watch())} € zum Endes des
                          Geschäftsjahres erhalten.
                        </label>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="col-span-full text-2xl mt-2 text-center font-semibold">
                Jährlicher Betrag:{" "}
                <span className="text-primary">{calculateFee(watch())} €</span>
              </div>

              <details className="text-base leading-7 text-gray-900 mt-8">
                <summary className="font-semibold">
                  Familien- und Partnermitgliedschaften
                </summary>
                <FamilyMembershipForm
                  setValue={setValue}
                  familyMembers={familyMembers}
                  getValues={getValues}
                  propagateError={setError}
                  clearPropagateError={clearErrors}
                />
              </details>
              <p className="col-span-full text-red-500">
                {errors.relatives?.message}
              </p>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Kontaktaufnahme
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Lasse dich über unsere bevorstehenden Aktionen informieren.
                Falls du nichts auswählst, kontaktieren wir dich ausschließlich
                per Post und nur dann, wenn es von Amtes wegen erforderlich ist.
              </p>
              <div className="mt-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Wir dürfen wir dir neue Informationen zukommen lassen?
                  </legend>
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          {...register("contactEmail", { required: false })}
                          id="contact-email"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="contact-email"
                          className="font-medium text-gray-900"
                        >
                          E-Mail
                        </label>
                        <p className="text-gray-500">
                          Wir schicken dir wichtige Nachrichten per E-Mail.
                        </p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          {...register("contactPost", { required: false })}
                          id="contact-post"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="contact-post"
                          className="font-medium text-gray-900"
                        >
                          Post
                        </label>
                        <p className="text-gray-500">
                          Wir schicken dir wichtige Nachrichten per Post.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Datenschutz
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Die angegebenen Daten werden unter Berücksichtigung des
                BundesDatenschutz-Gesetzes (BDSG) erhoben und ausschließlich für
                Zwecke der Mitgliederverwaltung gespeichert und genutzt. Die
                Bestimmungen findest du{" "}
                <a
                  className="text-indigo-600"
                  href="/rechtliches"
                  target="_blank"
                >
                  hier
                </a>
                .
              </p>

              <div className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                <fieldset className="col-span-full">
                  <div className="mt-6 space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          {...register("confirmDataProtection", {
                            required: true,
                          })}
                          id="data-yes"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="data-yes"
                          className="font-medium text-gray-900"
                        >
                          Ich habe die Datenschutzbestimmungen gelesen,
                          verstanden und akzeptiert.
                        </label>
                        <ErrorMessage
                          field={errors.confirmDataProtection}
                          error="Du musst den Datenschutzbestimmungen zustimmen."
                        ></ErrorMessage>
                        <p className="text-gray-500">
                          Du erklärst Dich damit einverstanden, dass Deine Daten
                          zur Bearbeitung Deiner Anfrageverwendet werden.
                          Weitere Informationen und Widerrufshinweise findest Du
                          inunserer Datenschutzerklärung und in den Hinweisen
                          zur Verarbeitung Deiner Daten.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Senden
            </button>
          </div>
        </form>
      )}
      {success == 1 && <FormFail recover={recover} />}
    </>
  );
}
