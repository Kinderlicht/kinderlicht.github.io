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
  return <>{field && <div className="text-red-500 text-xs mt-1.5 flex items-center gap-1">⚠️ {error}</div>}</>;
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
  <div className="flex items-center gap-3 mb-6">
    {emoji && (
      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
        <span className="text-xl">{emoji}</span>
      </div>
    )}
    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
      {title}
    </h2>
  </div>
);

// Common styling classes
const inputClasses =
  "mt-1 w-full rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 p-3 transition-all duration-300 bg-white hover:border-gray-300 hover:shadow-sm focus:shadow-md outline-none text-gray-700 placeholder-gray-400";

const labelClasses = "block text-sm font-medium text-gray-600 mb-1";

const checkboxClasses =
  "h-5 w-5 rounded-lg border-2 border-gray-300 cursor-pointer accent-orange-500 transition-all duration-200 hover:border-orange-400";

export default function ContactForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<Message>({ mode: "onChange" });
  let [success, setSuccess] = React.useState(-1);
  let [recover, setRecover] = React.useState("");

  const [hint, setHint] = React.useState("");

  const subjectValue = watch("subject") || "";
  const textValue = watch("text") || "";

  React.useEffect(() => {
    const keywords = ["spendenquittung", "quittung", "spendenbeleg"];
    const content = (subjectValue + " " + textValue).toLowerCase();

    const containsKeyword = keywords.some((keyword) =>
      content.includes(keyword)
    );

    if (containsKeyword) {
      setHint(
        "Für eine Spendenquittung kannst du auch direkt den Pfad https://www.kinderlicht-wallersdorf.de/quittung/ verwenden oder oben auf Quittung anfordern klicken."
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
        confirmationMail: data.email
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
      {success == 0 && <FormSuccess />}
      {success != 0 && (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-8 px-4 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-200 rounded-full filter blur-3xl opacity-30 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>
          
          <div className="max-w-2xl mx-auto relative z-10">
            {/* Header Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-full mb-6 shadow-xl ring-4 ring-orange-100">
                  <span className="text-5xl">💬</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
                  Kontakt aufnehmen
                </h1>
                <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
                  Hast du Fragen oder möchtest uns etwas mitteilen? Wir freuen uns von dir zu hören!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl px-4 py-2 border border-orange-100 flex items-center gap-2">
                    <span>📧</span>
                    <span className="text-gray-600 text-sm">Schnelle Antwort</span>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl px-4 py-2 border border-orange-100 flex items-center gap-2">
                    <span>🤝</span>
                    <span className="text-gray-600 text-sm">Persönlich & Freundlich</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border border-white/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Deine Nachricht */}
                <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SectionHeader title="Deine Nachricht" emoji="✉️" />
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="name" className={labelClasses}>Dein Name</label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        id="name"
                        placeholder="Max Mustermann"
                        autoComplete="name"
                        className={inputClasses}
                      />
                      <ErrorMessage field={errors.name} error="Name wird benötigt" />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClasses}>E-Mail</label>
                      <input
                        {...register("email", {
                          required: true,
                          pattern: /^\S+@\S+$/i,
                        })}
                        id="email"
                        type="email"
                        placeholder="max@beispiel.de"
                        autoComplete="email"
                        className={inputClasses}
                      />
                      <ErrorMessage
                        field={errors.email}
                        error={
                          errors.email?.ref?.value
                            ? errors.email.ref.value.toString() + " ist keine gültige E-Mail"
                            : "E-Mail wird benötigt"
                        }
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className={labelClasses}>Betreff</label>
                      <input
                        {...register("subject", { required: true })}
                        type="text"
                        id="subject"
                        placeholder="Worum geht es?"
                        className={inputClasses}
                      />
                      <ErrorMessage field={errors.subject} error="Bitte gib einen Betreff ein." />
                    </div>

                    <div>
                      <label htmlFor="text" className={labelClasses}>Deine Nachricht an uns</label>
                      <textarea
                        {...register("text", { required: true })}
                        id="text"
                        placeholder="Schreib uns hier deine Nachricht..."
                        rows={8}
                        className={`${inputClasses} resize-none`}
                      />
                      <ErrorMessage field={errors.text} error="Bitte gib einen Text ein." />
                    </div>
                  </div>
                </section>

                {/* Datenschutz */}
                <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SectionHeader title="Datenschutz" emoji="🔒" />
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Die angegebenen Daten werden unter Berücksichtigung des
                      BundesDatenschutz-Gesetzes (BDSG) erhoben und ausschließlich
                      für Zwecke der Spendenverwaltung gespeichert und genutzt. Die
                      Bestimmungen findest du{" "}
                      <a className="text-orange-600 hover:text-orange-700 font-medium" href="/rechtliches" target="_blank">
                        hier
                      </a>
                      . Du erklärst dich damit einverstanden, dass alle Inhalte im 
                      Formular an unsere Vereinsverwaltungssoftware Campai übermittelt werden.
                      Die Datenschutzbestimmungen von Campai findest du{" "}
                      <a className="text-orange-600 hover:text-orange-700 font-medium" href="https://www.campai.com/datenschutz" target="_blank">
                        hier
                      </a>
                      .
                    </p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-200 overflow-hidden">
                    <input
                      {...register("confirmDataProtection", { required: true })}
                      id="data-yes"
                      type="checkbox"
                      className={`${checkboxClasses} flex-shrink-0`}
                    />
                    
                    <div className="flex-1 min-w-0 break-words">
                      <label htmlFor="data-yes" className="font-medium text-gray-800 cursor-pointer">
                        Ich habe die Datenschutzbestimmungen gelesen, verstanden und akzeptiert.
                      </label>
                      <ErrorMessage
                        field={errors.confirmDataProtection}
                        error="Du musst den Datenschutzbestimmungen zustimmen."
                      />
                      <p className="text-gray-500 text-sm mt-2">
                        Du erklärst Dich damit einverstanden, dass Deine
                        Daten zur Bearbeitung Deiner Anfrage verwendet werden.
                      </p>
                    </div>
                  </div>
                </section>

                {hint && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 shadow-sm flex items-start gap-3">
                      <span className="text-xl">💡</span>
                      <p className="text-sm leading-relaxed">{hint}</p>
                    </div>
                  )
                }

                {/* Submit Button */}
                <div className="text-center pt-8">
                  <button
                    type="submit"
                    className="group px-14 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-xl font-bold flex items-center gap-4 mx-auto transform hover:-translate-y-1"
                  >
                    <span className="group-hover:animate-bounce">📨</span>
                    <span>Nachricht senden</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </button>
                  <p className="text-gray-400 text-sm mt-4">Du erhältst eine Bestätigungsmail nach dem Absenden.</p>
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
