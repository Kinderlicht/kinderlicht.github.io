import { Link } from "gatsby";
import React from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import FormFail from "./form_fail";
import FormSuccess from "./form_success";

function ErrorMessage({
  id,
  field,
  error,
}: {
  id: string;
  field: FieldError | undefined;
  error: string;
}) {
  return (
    <>
      {field && (
        <div
          id={id}
          className="text-red-700 text-xs mt-1.5 flex items-center gap-1"
          role="alert"
        >
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}
    </>
  );
}

interface Member {
  gender: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  date: Date;
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
  text: string;
  confirmDataProtection: boolean;
}

// Reusable section header with icon and gradient underline
const SectionHeader = ({ title, emoji }: { title: string; emoji?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    {emoji && (
      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
        <span aria-hidden="true" className="text-xl">
          {emoji}
        </span>
      </div>
    )}
    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
      {title}
    </h2>
  </div>
);

// Common styling classes
const inputClasses =
  "mt-1 w-full rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 p-3 transition-all duration-300 bg-white hover:border-gray-300 hover:shadow-sm focus:shadow-md outline-none text-gray-700 placeholder-gray-600";

const selectClasses =
  "mt-1 w-full rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 p-3 transition-all duration-300 bg-white hover:border-gray-300 hover:shadow-sm focus:shadow-md outline-none text-gray-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%239ca3af%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.5em] bg-[right_0.75rem_center] bg-no-repeat pr-10";

const labelClasses = "block text-sm font-medium text-gray-600 mb-1";

const checkboxClasses =
  "h-5 w-5 rounded-lg border-2 border-gray-300 cursor-pointer accent-orange-700 transition-all duration-200 hover:border-orange-400";

export default function DonationReceipt() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Member>({ mode: "onChange" });
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
          lastName: data.lastName || "keine Angabe",
          birthday: data.birthday.toISOString().split("T")[0],
          date: data.date.toISOString().split("T")[0],
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
          text: data.text,
          confirmationDataProtectionContainer: data.confirmDataProtection,
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
      {success == 0 && <FormSuccess />}
      {success != 0 && (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-8 px-4 relative overflow-hidden">
          {/* Decorative background elements */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"
          ></div>
          <div
            aria-hidden="true"
            className="absolute top-1/3 right-0 w-80 h-80 bg-amber-200 rounded-full filter blur-3xl opacity-30 translate-x-1/2"
          ></div>
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl opacity-20"
          ></div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-full mb-6 shadow-xl ring-4 ring-orange-100">
                  <span aria-hidden="true" className="text-5xl">
                    🧾
                  </span>
                </div>
                <h1 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
                  Spendenquittung anfordern
                </h1>
                <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
                  Vielen Dank für deine Spende! Hier kannst du deine
                  Spendenquittung für die Steuererklärung anfordern.
                </p>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 text-left max-w-2xl mx-auto border border-orange-100 shadow-inner">
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="text-2xl">
                      💡
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        Gut zu wissen:
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Spenden bis 300€ können auch ohne Quittung mit einem
                        einfachen Nachweis (z.B. Kontoauszug) steuerlich geltend
                        gemacht werden.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border border-white/50">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Persönliche Informationen */}
                <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SectionHeader title="Persönliche Informationen" emoji="👤" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="gender" className={labelClasses}>
                        Anrede
                      </label>
                      <select
                        {...register("gender", { required: true })}
                        id="gender"
                        autoComplete="honorific-prefix"
                        required
                        aria-invalid={Boolean(errors.gender)}
                        aria-describedby={
                          errors.gender ? "gender-error" : undefined
                        }
                        className={selectClasses}
                      >
                        <option value="">Bitte wählen</option>
                        <option>Frau</option>
                        <option>Herr</option>
                        <option>ohne</option>
                        <option>Firma</option>
                      </select>
                      <ErrorMessage
                        id="gender-error"
                        field={errors.gender}
                        error="Bitte wähle eine Anrede."
                      />
                    </div>

                    <div>
                      <label htmlFor="first-name" className={labelClasses}>
                        {watch().gender === "Firma" ? "Firmenname" : "Vorname"}
                      </label>
                      <input
                        {...register("firstName", { required: true })}
                        type="text"
                        id="first-name"
                        placeholder={
                          watch().gender === "Firma" ? "Muster GmbH" : "Max"
                        }
                        autoComplete="given-name"
                        required
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={
                          errors.firstName ? "first-name-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="first-name-error"
                        field={errors.firstName}
                        error={
                          watch().gender === "Firma"
                            ? "Firmenname wird benötigt"
                            : "Vorname wird benötigt"
                        }
                      />
                    </div>

                    <div>
                      <label htmlFor="last-name" className={labelClasses}>
                        {watch().gender === "Firma" ? "Zusatz" : "Nachname"}
                      </label>
                      <input
                        {...register("lastName", {
                          required: watch().gender !== "Firma",
                        })}
                        type="text"
                        id="last-name"
                        placeholder={
                          watch().gender === "Firma"
                            ? "(optional)"
                            : "Mustermann"
                        }
                        autoComplete="family-name"
                        required={watch().gender !== "Firma"}
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={
                          errors.lastName ? "last-name-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="last-name-error"
                        field={errors.lastName}
                        error={
                          watch().gender === "Firma"
                            ? "Zusatz wird benötigt"
                            : "Nachname wird benötigt"
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="email" className={labelClasses}>
                        E-Mail
                      </label>
                      <input
                        {...register("email", {
                          required: true,
                          pattern: /^\S+@\S+$/i,
                        })}
                        id="email"
                        type="email"
                        placeholder="max@beispiel.de"
                        autoComplete="email"
                        required
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="email-error"
                        field={errors.email}
                        error={
                          errors.email?.ref?.value
                            ? errors.email.ref.value.toString() +
                              " ist keine gültige E-Mail"
                            : "E-Mail wird benötigt"
                        }
                      />
                    </div>

                    <div>
                      <label htmlFor="birth" className={labelClasses}>
                        Geburtsdatum
                      </label>
                      <input
                        id="birth"
                        type="date"
                        {...register("birthday", {
                          required: true,
                          valueAsDate: true,
                        })}
                        required
                        aria-invalid={Boolean(errors.birthday)}
                        aria-describedby={
                          errors.birthday ? "birthday-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="birthday-error"
                        field={errors.birthday}
                        error={
                          errors.birthday?.message ||
                          "Bitte gib dein Geburtsdatum an."
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* Adresse */}
                <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SectionHeader title="Adresse" emoji="🏠" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label htmlFor="street-address" className={labelClasses}>
                        Straße + Nr. (ggf. Adresszusatz)
                      </label>
                      <input
                        {...register("street", { required: true })}
                        type="text"
                        id="street-address"
                        placeholder="Musterstraße 123"
                        autoComplete="street-address"
                        required
                        aria-invalid={Boolean(errors.street)}
                        aria-describedby={
                          errors.street ? "street-address-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="street-address-error"
                        field={errors.street}
                        error="Adresse wird benötigt"
                      />
                    </div>

                    <div>
                      <label htmlFor="postal-code" className={labelClasses}>
                        Postleitzahl
                      </label>
                      <input
                        {...register("postalCode", { required: true })}
                        type="text"
                        id="postal-code"
                        placeholder="12345"
                        autoComplete="postal-code"
                        required
                        aria-invalid={Boolean(errors.postalCode)}
                        aria-describedby={
                          errors.postalCode ? "postal-code-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="postal-code-error"
                        field={errors.postalCode}
                        error="Postleitzahl wird benötigt"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className={labelClasses}>
                        Ort
                      </label>
                      <input
                        {...register("city", { required: true })}
                        type="text"
                        id="city"
                        placeholder="Musterstadt"
                        autoComplete="address-level2"
                        required
                        aria-invalid={Boolean(errors.city)}
                        aria-describedby={
                          errors.city ? "city-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="city-error"
                        field={errors.city}
                        error="Ort wird benötigt"
                      />
                    </div>

                    <div>
                      <label htmlFor="region" className={labelClasses}>
                        Bundesland / Kanton
                      </label>
                      <input
                        {...register("state", { required: true })}
                        type="text"
                        id="region"
                        placeholder="Bayern"
                        autoComplete="address-level1"
                        required
                        aria-invalid={Boolean(errors.state)}
                        aria-describedby={
                          errors.state ? "region-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="region-error"
                        field={errors.state}
                        error="Bundesland wird benötigt"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className={labelClasses}>
                        Land
                      </label>
                      <select
                        {...register("country", { required: true })}
                        id="country"
                        autoComplete="country-name"
                        required
                        aria-invalid={Boolean(errors.country)}
                        aria-describedby={
                          errors.country ? "country-error" : undefined
                        }
                        className={selectClasses}
                      >
                        <option>Deutschland</option>
                        <option>Österreich</option>
                        <option>Schweiz</option>
                      </select>
                      <ErrorMessage
                        id="country-error"
                        field={errors.country}
                        error="Land wird benötigt"
                      />
                    </div>
                  </div>
                </section>

                {/* Spendenabwicklung */}
                <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SectionHeader title="Spendenabwicklung" emoji="💰" />
                  <p className="text-gray-500 text-sm mb-5 -mt-2">
                    Wie wurde die Spende getätigt?
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="money" className={labelClasses}>
                        Gespendeter Betrag (€)
                      </label>
                      <input
                        {...register("money", {
                          required: true,
                          pattern:
                            /^(0|[1-9][0-9]*|(0|[1-9][0-9]*),[0-9][0-9]{0,1})$/i,
                        })}
                        type="text"
                        id="money"
                        placeholder="50,00"
                        inputMode="decimal"
                        required
                        aria-invalid={Boolean(errors.money)}
                        aria-describedby={
                          errors.money ? "money-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="money-error"
                        field={errors.money}
                        error={
                          errors.money?.ref?.value
                            ? "Der Betrag muss einem Geldbetrag gleichen (z.B. 28,10)."
                            : "Der Spendenbetrag wird benötigt."
                        }
                      />
                    </div>

                    <div>
                      <label htmlFor="how" className={labelClasses}>
                        Zahlungsart
                      </label>
                      <select
                        {...register("how", { required: true })}
                        id="how"
                        onChange={(e) => setPayment(e.target.value)}
                        required
                        className={selectClasses}
                      >
                        <option>in bar</option>
                        <option>per Banküberweisung</option>
                        <option>per Paypal</option>
                      </select>
                    </div>

                    {payment == "per Banküberweisung" && (
                      <>
                        <div>
                          <label htmlFor="iban" className={labelClasses}>
                            IBAN
                          </label>
                          <input
                            {...register("iban", {
                              required: payment == "per Banküberweisung",
                              validate: {
                                ibanValidation: (v) =>
                                  require("iban").isValid(v) ||
                                  "IBAN ungültig.",
                              },
                            })}
                            type="text"
                            id="iban"
                            placeholder="DE89 3704 0044 0532 0130 00"
                            autoComplete="off"
                            required
                            aria-invalid={Boolean(errors.iban)}
                            aria-describedby={
                              errors.iban ? "iban-error" : undefined
                            }
                            className={inputClasses}
                          />
                          <ErrorMessage
                            id="iban-error"
                            field={errors.iban}
                            error={errors.iban?.message || "IBAN wird benötigt"}
                          />
                        </div>

                        <div>
                          <label htmlFor="bic" className={labelClasses}>
                            BIC
                          </label>
                          <input
                            {...register("bic", {
                              required: payment == "per Banküberweisung",
                            })}
                            type="text"
                            id="bic"
                            placeholder="COBADEFFXXX"
                            autoComplete="off"
                            required
                            aria-invalid={Boolean(errors.bic)}
                            aria-describedby={
                              errors.bic ? "bic-error" : undefined
                            }
                            className={inputClasses}
                          />
                          <ErrorMessage
                            id="bic-error"
                            field={errors.bic}
                            error="BIC wird benötigt"
                          />
                        </div>
                      </>
                    )}

                    {payment == "per Paypal" && (
                      <div className="md:col-span-2">
                        <label htmlFor="paypal-mail" className={labelClasses}>
                          PayPal E-Mail
                        </label>
                        <input
                          {...register("paypalMail", {
                            required: payment == "per Paypal",
                            pattern: /^\S+@\S+$/i,
                          })}
                          defaultValue={watch().email || ""}
                          id="paypal-mail"
                          type="email"
                          placeholder="paypal@beispiel.de"
                          autoComplete="email"
                          required
                          aria-invalid={Boolean(errors.paypalMail)}
                          aria-describedby={
                            errors.paypalMail ? "paypal-mail-error" : undefined
                          }
                          className={inputClasses}
                        />
                        <ErrorMessage
                          id="paypal-mail-error"
                          field={errors.paypalMail}
                          error={
                            errors.paypalMail?.ref?.value
                              ? errors.paypalMail.ref.value.toString() +
                                " ist keine gültige E-Mail"
                              : "PayPal E-Mail wird benötigt"
                          }
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="date" className={labelClasses}>
                        Datum der Spende
                      </label>
                      <input
                        id="date"
                        type="date"
                        {...register("date", {
                          required: true,
                          valueAsDate: true,
                        })}
                        required
                        aria-invalid={Boolean(errors.date)}
                        aria-describedby={
                          errors.date ? "date-error" : undefined
                        }
                        className={inputClasses}
                      />
                      <ErrorMessage
                        id="date-error"
                        field={errors.date}
                        error={
                          errors.date?.message ||
                          "Bitte gib an, wann du gespendet hast."
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="text" className={labelClasses}>
                        Sonstige Anmerkungen (optional)
                      </label>
                      <input
                        {...register("text")}
                        type="text"
                        id="text"
                        placeholder="Zusätzliche Informationen..."
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </section>

                {/* Datenschutz */}
                <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SectionHeader title="Datenschutz" emoji="🔒" />
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100 mb-5 overflow-hidden">
                    <p className="text-sm text-gray-600 leading-relaxed break-words">
                      Die angegebenen Daten werden unter Berücksichtigung des
                      BundesDatenschutz-Gesetzes (BDSG) erhoben und
                      ausschließlich für Zwecke der Spendenverwaltung
                      gespeichert und genutzt. Mehr dazu steht in unserer{" "}
                      <a
                        className="font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800"
                        href="/rechtliches"
                      >
                        Datenschutzerklärung
                      </a>
                      . Du erklärst dich damit einverstanden, dass alle Inhalte
                      im Formular an unsere Vereinsverwaltungssoftware Campai
                      übermittelt werden. Informationen dazu findest du in der{" "}
                      <a
                        className="font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800"
                        href="https://www.campai.com/datenschutz"
                      >
                        Datenschutzerklärung von Campai
                      </a>
                      .
                    </p>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 border border-gray-200 overflow-hidden">
                    <input
                      {...register("confirmDataProtection", { required: true })}
                      id="data-yes"
                      type="checkbox"
                      required
                      aria-invalid={Boolean(errors.confirmDataProtection)}
                      aria-describedby={
                        errors.confirmDataProtection ? "data-error" : undefined
                      }
                      className={`${checkboxClasses} flex-shrink-0`}
                    />

                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor="data-yes"
                        className="font-medium text-gray-800 cursor-pointer break-words"
                      >
                        Ich habe die Datenschutzbestimmungen gelesen, verstanden
                        und akzeptiert.
                      </label>
                      <ErrorMessage
                        id="data-error"
                        field={errors.confirmDataProtection}
                        error="Du musst den Datenschutzbestimmungen zustimmen."
                      />
                      <p className="text-gray-500 text-sm mt-2 break-words">
                        Du erklärst Dich damit einverstanden, dass Deine Daten
                        zur Bearbeitung Deiner Anfrage verwendet werden.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Submit Button */}
                <div className="text-center pt-8">
                  <button
                    type="submit"
                    className="mx-auto flex min-h-12 items-center gap-3 rounded-xl bg-orange-700 px-8 py-3 text-lg font-bold text-white shadow-md transition-colors hover:bg-orange-800"
                  >
                    <span aria-hidden="true">📨</span>
                    <span>Quittung anfordern</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <p className="mt-4 text-sm text-gray-600">
                    Du erhältst eine Bestätigungsmail nach dem Absenden.
                  </p>
                </div>
              </form>

              {success == 1 && <FormFail recover={recover} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
