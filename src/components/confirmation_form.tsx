import { Link } from "gatsby";
import React from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import FormFail from "./form_fail";
import FormSuccess from "./form_success";

function ErrorMessage({
  field,
  error,
}: {
  field: FieldError | undefined;
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
  money: string;
  iban: string;
  bic: string;
  how: string;
  paypalMail: string;
  confirmDataProtection: boolean;
}

export default function DonationReceipt() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Member>({ mode: "onChange" });
  let [firstEmail, setFirstEmail] = React.useState("");
  let [payment, setPayment] = React.useState("");
  let [success, setSuccess] = React.useState(-1);
  let [recover, setRecover] = React.useState("");
  const onSubmit: SubmitHandler<Member> = (data) => {
    setSuccess(-1);
    fetch("https://api.campai.com/formSubmissions/64ee59353fb2120aad978686", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        formData: {
          gender: data.gender,
          firstName: data.firstName,
          lastName: data.lastName,
          birthday: data.birthday.toISOString().split("T")[0],
          email: data.email,
          street: data.street,
          postalCode: data.postalCode.toString(),
          city: data.city,
          state: data.state,
          country: data.country,
          how: data.how,
          iban: data.iban || "",
          bic: data.bic || "",
          paypalMail: data.paypalMail || "",
          money: data.money,
          confirmationDataProtectionContainer: {
            confirmationDataProtection: data.confirmDataProtection,
          },
        },
        confirmationMail: data.email,
      }),
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
      .catch((_) => {
        setRecover(JSON.stringify(data));
        setSuccess(1);
      });
  };
  return (
    <>
      {success == 0 && (<FormSuccess/>)}
      {success != 0 && (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
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
                        onBlur={(e) => setFirstEmail(e.target.value)}
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
                        {...register("birthday", {
                          required: true,
                          valueAsDate: true,
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
                  Spendenabwicklung
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Wie wurde die Spende getätigt.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="money"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Gespendeter Betrag
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("money", {
                          required: true,
                          pattern:
                            /^(0|[1-9][0-9]*|(0|[1-9][0-9]*),[0-9][0-9]{0,1})$/i,
                        })}
                        type="text"
                        id="money"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        field={errors.money}
                        error={
                          errors.money?.ref?.value
                            ? "Der Betrag muss einem Geldbetrag gleichen (z.B. 28,10)."
                            : "Der Spendenbetrag wird benötigt."
                        }
                      ></ErrorMessage>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor="how"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Wie wurde die Spende getätigt
                    </label>
                    <div className="mt-2">
                      <select
                        {...register("how", { required: true })}
                        id="how"
                        onChange={(e) => setPayment(e.target.value)}
                        autoComplete="honorific-prefix"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option>in bar</option>
                        <option>per Banküberweisung</option>
                        <option>per Paypal</option>
                      </select>
                    </div>
                  </div>
                  {payment == "per Banküberweisung" && (
                    <>
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="iban"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          IBAN
                        </label>
                        <div className="mt-2">
                          <input
                            {...register("iban", {
                              required: payment == "per Banküberweisung",
                              validate: {
                                ibanValidation: (v) => require("iban").isValid(v) || "IBAN ungültig."
                              }
                            })}
                            type="text"
                            id="iban"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          <ErrorMessage
                            field={errors.iban}
                            error={errors.iban?.message? errors.iban.message : "IBAN wird benötigt"}
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
                            {...register("bic", {
                              required: payment == "per Banküberweisung",
                            })}
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
                    </>
                  )}

                  {payment == "per Paypal" && (
                    <div className="col-span-full">
                      <label
                        htmlFor="paypal-mail"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        E-Mail (Paypal)
                      </label>
                      <div className="mt-2">
                        <input
                          {...register("paypalMail", {
                            required: payment == "per Paypal",
                            pattern: /^\S+@\S+$/i,
                          })}
                          defaultValue={firstEmail}
                          id="paypal-mail"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                          field={errors.paypalMail}
                          error={
                            errors.paypalMail?.ref?.value
                              ? errors.paypalMail.ref.value.toString() +
                                " ist keine gültige E-Mail"
                              : "E-Mail wird benötigt"
                          }
                        ></ErrorMessage>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Datenschutz
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Die angegebenen Daten werden unter Berücksichtigung des
                  BundesDatenschutz-Gesetzes (BDSG) erhoben und ausschließlich
                  für Zwecke der Spendenverwaltung gespeichert und genutzt. Die
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
                            Du erklärst Dich damit einverstanden, dass Deine
                            Daten zur Bearbeitung Deiner Anfrageverwendet
                            werden. Weitere Informationen und Widerrufshinweise
                            findest Du inunserer Datenschutzerklärung und in den
                            Hinweisen zur Verarbeitung Deiner Daten.
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
          {success == 1 && (<FormFail recover={recover}/>)}
        </>
      )}
    </>
  );
}
