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
          className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
          role="alert"
        >
          <span aria-hidden="true">⚠️</span> {error}
        </div>
      )}
    </>
  );
}

interface Message {
  name: string;
  email: string;
  subject: string;
  text: string;
  confirmDataProtection: boolean;
}

// Reusable section header with icon and gradient underline
const SectionHeader = ({ title, emoji }: { title: string; emoji?: string }) => (
  <div className="site-form-heading">
    {emoji && (
      <div className="site-form-heading-icon">
        <span aria-hidden="true" className="text-xl">
          {emoji}
        </span>
      </div>
    )}
    <h3 className="site-form-heading-title">{title}</h3>
  </div>
);

// Common styling classes
const inputClasses = "site-field";

const labelClasses = "site-label";

const checkboxClasses = "site-checkbox";

export default function ContactForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Message>({ mode: "onChange" });
  const [success, setSuccess] = React.useState(-1);
  const [recover, setRecover] = React.useState("");

  const [hint, setHint] = React.useState("");

  const subjectValue = watch("subject") || "";
  const textValue = watch("text") || "";

  React.useEffect(() => {
    const keywords = ["spendenquittung", "quittung", "spendenbeleg"];
    const content = (subjectValue + " " + textValue).toLowerCase();

    const containsKeyword = keywords.some((keyword) =>
      content.includes(keyword),
    );

    if (containsKeyword) {
      setHint(
        'Für eine Spendenquittung nutze bitte den Link "Quittung anfordern" oben.',
      );
    } else {
      setHint("");
    }
  }, [subjectValue, textValue]);

  const onSubmit: SubmitHandler<Message> = (data) => {
    fetch("https://api.campai.com/formSubmissions/65228c088027e5517c174547", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        formData: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          text: data.text,
        },
        confirmationMail: data.email,
      }),
    })
      .then((res) => {
        console.log(res);
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
      {success == 0 && (
        <div className="mx-auto max-w-2xl">
          <FormSuccess />
        </div>
      )}
      {success != 0 && (
        <div className="site-form-card mx-auto max-w-2xl">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Deine Nachricht */}
            <section className="site-form-section">
              <SectionHeader title="Deine Nachricht" emoji="✉️" />
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Dein Name
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    id="name"
                    placeholder="Kim Muster"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClasses}
                  />
                  <ErrorMessage
                    id="name-error"
                    field={errors.name}
                    error="Name wird benötigt"
                  />
                </div>

                <div>
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
                    placeholder="kim@beispiel.de"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
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
                  <label htmlFor="subject" className={labelClasses}>
                    Betreff
                  </label>
                  <input
                    {...register("subject", { required: true })}
                    type="text"
                    id="subject"
                    placeholder="Worum geht es?"
                    required
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                      errors.subject ? "subject-error" : undefined
                    }
                    className={inputClasses}
                  />
                  <ErrorMessage
                    id="subject-error"
                    field={errors.subject}
                    error="Bitte gib einen Betreff ein."
                  />
                </div>

                <div>
                  <label htmlFor="text" className={labelClasses}>
                    Deine Nachricht an uns
                  </label>
                  <textarea
                    {...register("text", { required: true })}
                    id="text"
                    placeholder="Schreib uns hier deine Nachricht..."
                    rows={8}
                    required
                    aria-invalid={Boolean(errors.text)}
                    aria-describedby={errors.text ? "text-error" : undefined}
                    className={`${inputClasses} resize-none`}
                  />
                  <ErrorMessage
                    id="text-error"
                    field={errors.text}
                    error="Bitte gib einen Text ein."
                  />
                </div>
              </div>
            </section>

            {/* Datenschutz */}
            <section className="site-form-section">
              <SectionHeader title="Datenschutz" emoji="🔒" />
              <div className="site-note mb-5 border-slate-200 bg-white">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Deine Angaben werden ausschließlich zur Bearbeitung deiner
                  Nachricht gespeichert und genutzt. Unsere Mehr dazu steht in
                  unserer{" "}
                  <a
                    className="font-medium text-orange-700 underline decoration-orange-300 underline-offset-2 hover:text-orange-800"
                    href="/rechtliches"
                  >
                    Datenschutzerklärung
                  </a>
                  . Du erklärst dich damit einverstanden, dass alle Inhalte im
                  Formular an unsere Vereinsverwaltungssoftware Campai
                  übermittelt werden. Informationen dazu findest du in der{" "}
                  <a
                    className="font-medium text-orange-700 underline decoration-orange-300 underline-offset-2 hover:text-orange-800"
                    href="https://www.campai.com/datenschutz"
                  >
                    Datenschutzerklärung von Campai
                  </a>
                  .
                </p>
              </div>

              <div className="flex items-start gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4">
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

                <div className="flex-1 min-w-0 break-words">
                  <label
                    htmlFor="data-yes"
                    className="font-medium text-gray-800 cursor-pointer"
                  >
                    Ich habe die Datenschutzbestimmungen gelesen, verstanden und
                    akzeptiert.
                  </label>
                  <ErrorMessage
                    id="data-error"
                    field={errors.confirmDataProtection}
                    error="Du musst den Datenschutzbestimmungen zustimmen."
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Du erklärst Dich damit einverstanden, dass Deine Daten zur
                    Bearbeitung Deiner Anfrage verwendet werden.
                  </p>
                </div>
              </div>
            </section>

            {hint && (
              <div
                className="site-note mb-6 flex items-start gap-3"
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true" className="text-xl">
                  💡
                </span>
                <p className="text-sm leading-relaxed">{hint}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                className="site-button-primary mx-auto min-h-12 w-full px-8 py-3 sm:w-auto"
              >
                <span>Nachricht senden</span>
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </button>
              <p className="mt-4 text-sm text-gray-600">
                Du erhältst eine Bestätigungsmail nach dem Absenden.
              </p>
            </div>
          </form>

          {success == 1 && <FormFail recover={recover} />}
        </div>
      )}
    </>
  );
}
