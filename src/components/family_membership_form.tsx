import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage, calculateAge } from "./member_form";
import { Link } from "gatsby";

export type Relative = {
  gender: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  email: string;
  exists: boolean;
  deleteDonation: boolean;
  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
};

export function checkFamilyMembers(familyMembers: Relative[], birthday: Date, strict=false) {
  const isChild = birthday && calculateAge(birthday) < 18;
  const countChildren = familyMembers.filter(
    (member) => member.birthday && calculateAge(member.birthday) < 18
  ).length + (isChild ? 1 : 0);
  const countAdults = familyMembers.filter(
    (member) => member.birthday && calculateAge(member.birthday) >= 18
  ).length + (isChild ? 0 : 1);
  if (countAdults + countChildren == 0) {
    return "";
  }
  if (isChild) {
    if (countAdults > 2) {
      return "Es dürfen maximal zwei Erziehungsberechtigte pro Familie beitreten.";
    }
    if (strict && countAdults == 0) {
      return "Es muss mindestens ein/e Erziehungsberechtigte/r pro Familie beitreten.";
    }
  } else {
    if (countAdults > 2) {
      return "Es darf maximal ein/e Partner/in beitreten.";
    }
  }
  return "";
}

export default function FamilyMembershipForm({
  familyMembers,
  setValue,
  getValues,
  propagateError,
  clearPropagateError
}: {
  familyMembers: Relative[];
  setValue: Function;
  getValues: Function;
  propagateError: Function;
  clearPropagateError: Function;
}) {
  const {
    register,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<Relative>({ mode: "onChange" });

  const addFamilyMember = () => {
    trigger();
    const newFamilyMembers: Relative[] = [...familyMembers, watch()];
    const error = checkFamilyMembers(newFamilyMembers, getValues("birthday"));
    propagateError("relatives", {message: error});
    if (isValid && error == "") {
      clearPropagateError("relatives");
      setValue("relatives", newFamilyMembers);
    }
  };

  const removeFamilyMember = (index: number) => {
    const newFamilyMembers = familyMembers.filter((_, i) => i !== index);
    setValue("relatives", newFamilyMembers);
  };

  const exists = watch("exists", false);
  const firstName = watch("firstName", "");

  return (
    <>
      {getValues("birthday") && calculateAge(getValues("birthday")) < 18 && (
        <p>
          Falls du unter 18 Jahre alt, aber erziehungsberechtigt bist, melde
          dich bitte bei{" "}
          <Link className="text-indigo-500" to="/anfrage">
            uns
          </Link>
          .
        </p>
      )}
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="col-span-2">
          <label
            htmlFor="member-gender"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Anrede
          </label>
          <div className="mt-2 sm:col-span-2 col-span-full">
            <select
              {...register("gender", { required: true })}
              id="member-gender"
              autoComplete="honorific-prefix"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option value="Frau">Frau</option>
              <option value="Herr">Herr</option>
              <option value="ohne">ohne</option>
            </select>
          </div>
          <ErrorMessage field={errors.gender} error="Anrede wird benötigt" />
        </div>
        <div className="sm:col-span-2 col-span-full">
          <label
            className="font-medium text-gray-900"
            htmlFor="member-first-name"
          >
            Vorname
          </label>
          <div className="flex h-6 items-center my-2">
            <input
              id="member-first-name"
              type="text"
              placeholder={"Maxi"}
              {...register("firstName", { required: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <ErrorMessage
            field={errors.firstName}
            error="Vorname wird benötigt"
          />
        </div>
        <div className="sm:col-span-2 col-span-full">
          <label
            className="font-medium text-gray-900"
            htmlFor="member-last-name"
          >
            Nachname
          </label>
          <div className="flex h-6 items-center my-2">
            <input
              id="member-last-name"
              type="text"
              placeholder={"Mustermann"}
              {...register("lastName", { required: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <ErrorMessage
            field={errors.lastName}
            error="Nachname wird benötigt"
          />
        </div>
        <div className="sm:col-span-3 col-span-full">
          <label className="font-medium text-gray-900" htmlFor="member-email">
            E-Mail
          </label>
          <div className="flex h-6 items-center my-2">
            <input
              id="member-email"
              type="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <ErrorMessage
            field={errors.email}
            error={
              errors.email?.ref?.value
                ? errors.email.ref.value.toString() +
                  " ist keine gültige E-Mail"
                : "E-Mail wird benötigt"
            }
          />
        </div>
        <div className="sm:col-span-3 col-span-full">
          <label
            htmlFor="member-birth"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Geburtsdatum
          </label>
          <div className="my-2">
            <input
              id="member-birth"
              {...register("birthday", {
                required: true,
                valueAsDate: true,
                validate: {
                  is_seven: (v) =>
                    calculateAge(v) >= 7 ||
                    `Ein neues Mitglied muss mindestens 7 Jahre alt sein, um beizutreten.`,
                  is_too_old: (v) =>
                    calculateAge(v) <= 150 ||
                    "Ich denke nicht, dass du schon 150 Jahre alt bist.",
                },
              })}
              type="date"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <ErrorMessage
            field={errors.birthday}
            error={
              errors.birthday?.message
                ? errors.birthday?.message
                : "Bitte gib das Geburtsdatum an."
            }
          />
        </div>
        <fieldset className="col-span-full">
          <div className="mt-6 space-y-6">
            <div className="relative flex gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  {...register("exists", {})}
                  id="member-exists"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="text-sm leading-6">
                <label
                  htmlFor="member-exists"
                  className="font-medium text-gray-900"
                >
                  {firstName || "Die Person"} ist bereits ein Mitglied.
                </label>
              </div>
            </div>
          </div>
          {exists && (
            <div className="mt-6 space-y-6 col-span-full">
              <div className="relative flex gap-x-3">
                <div className="flex h-6 items-center">
                  <input
                    {...register("deleteDonation", {})}
                    id="member-donation"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
                <div className="text-sm leading-6">
                  <label
                    htmlFor="member-donation"
                    className="font-medium text-gray-900"
                  >
                    Die ggf. angegebene freiwillige Spende für{" "}
                    {firstName || "die existierende Person"} soll widerrufen
                    werden.
                  </label>
                </div>
              </div>
            </div>
          )}
        </fieldset>
        {!exists && (
          <>
            <div className="col-span-full">
              <label
                htmlFor="member-street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Straße + Nr. (ggf. Adresszusatz)
              </label>
              <div className="mt-2">
                <input
                  {...register("street", { required: !exists })}
                  type="text"
                  id="member-street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  field={errors.street}
                  error="Adresse wird benötigt"
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-full">
              <label
                htmlFor="member-postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Postleitzahl / ZIP
              </label>
              <div className="mt-2">
                <input
                  {...register("postalCode", { required: !exists })}
                  type="text"
                  id="member-postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  field={errors.postalCode}
                  error="Postleitzahl / ZIP wird benötigt"
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-full">
              <label
                htmlFor="member-city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ort
              </label>
              <div className="mt-2">
                <input
                  {...register("city", { required: !exists })}
                  type="text"
                  id="member-city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage field={errors.city} error="Ort wird benötigt" />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-full">
              <label
                htmlFor="member-region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Bundesland / Kanton
              </label>
              <div className="mt-2">
                <input
                  {...register("state", { required: !exists })}
                  type="text"
                  id="member-region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  field={errors.state}
                  error="Bundesland / Kanton wird benötigt"
                />
              </div>
            </div>

            <div className="sm:col-span-3 col-span-full">
              <label
                htmlFor="member-country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Land
              </label>
              <div className="mt-2">
                <select
                  {...register("country", { required: !exists })}
                  id="member-country"
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
                />
              </div>
            </div>
          </>
        )}
        <button
          type="button"
          className="bg-transparent hover:bg-indigo-500 text-indigo-700 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded col-span-full mb-2"
          onClick={addFamilyMember}
        >
          Hinzufügen
        </button>
        {familyMembers.map((familyMember, index) => (
          <div
            key={index}
            className="col-span-2 flex items-center justify-center w-full"
          >
            <div className="bg-white shadow-xl rounded-lg py-3 h-full">
              <div className="w-full flex items-center container">
                {familyMember.gender == "Frau" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-gender-female text-primary mx-auto"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5z"
                    />
                  </svg>
                )}
                {familyMember.gender == "Herr" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-gender-male text-primary mx-auto"
                    viewBox="0 0 16 16"
                    width="32"
                    height="32"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2H9.5zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
                    />
                  </svg>
                )}
                {familyMember.gender == "ohne" && (
                  <svg
                    fill="currentColor"
                    className="bi bi-gender-trans text-primary mx-auto"
                    viewBox="0 0 16 16"
                    width="32"
                    height="32"
                  >
                    <path
                      fillRule="evenodd"
                      d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1.707L3.5 2.793l.646-.647a.5.5 0 1 1 .708.708l-.647.646.822.822A3.99 3.99 0 0 1 8 3c1.18 0 2.239.51 2.971 1.322L14.293 1H11.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-3.45 3.45A4 4 0 0 1 8.5 10.97V13H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V14H6a.5.5 0 0 1 0-1h1.5v-2.03a4 4 0 0 1-3.05-5.814l-.95-.949-.646.647a.5.5 0 1 1-.708-.708l.647-.646L1 1.707V3.5a.5.5 0 0 1-1 0v-3zm5.49 4.856a3 3 0 1 0 5.02 3.288 3 3 0 0 0-5.02-3.288z"
                    />
                  </svg>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
                  {familyMember.firstName} {familyMember.lastName}
                </h3>
                <div className="text-center text-gray-400 text-xs font-semibold">
                  <p>
                    {calculateAge(familyMember.birthday) <= 18 ? "Kind" : "Erwachsene/r"}
                  </p>
                </div>
                <table className="text-xs my-3">
                  <tbody>
                    <tr>
                      <td className="px-2 py-2 text-gray-500 font-semibold">
                        Adresse
                      </td>
                      <td className="px-2 py-2">
                        {familyMember.exists
                          ? "Wird übernommen"
                          : `${familyMember.street}, ${familyMember.postalCode} ${familyMember.city}, ${familyMember.state} - ${familyMember.country}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-gray-500 font-semibold">
                        Geburtstag
                      </td>
                      <td className="px-2 py-2">
                        {familyMember.birthday.toLocaleDateString("de", {
                          timeZone: "CET",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-gray-500 font-semibold">
                        E-Mail
                      </td>
                      <td className="px-2 py-2">{familyMember.email}</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-gray-500 font-semibold">
                        Status
                      </td>
                      <td className="px-2 py-2">
                        {familyMember.exists
                          ? `${familyMember.firstName} ist bereits Mitglied.`
                          : `${familyMember.firstName} wird als neues Mitglied angelegt.`}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 text-gray-500 font-semibold">
                        Spende
                      </td>
                      {familyMember.exists ? (
                        <td className="px-2 py-2">
                          {familyMember.deleteDonation
                            ? "Die freiwillige Spende wird widerrufen"
                            : "Die freiwillige Spende bleibt bestehen."}
                        </td>
                      ) : (
                        <td className="px-2 py-2">
                          Nicht relevant für neue Mitglieder.
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
                <div className="w-full flex items-center container">
                  <button
                    type="button"
                    className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mr-0 ml-auto"
                    onClick={() => removeFamilyMember(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
