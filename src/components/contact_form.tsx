import React from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import FormFail from "./form_fail";

function ErrorMessage({
  field,
  error,
}: {
  field: FieldError | undefined;
  error: string;
}) {
  return <>{field && <div className="text-sm text-red-500">{error}</div>}</>;
}

interface Message {
  name: string;
  email: string;
  subject: string;
  text: string;
}

export default function MemberForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Message>({ mode: "onChange" });
  let [success, setSuccess] = React.useState(-1);
  let [recover, setRecover] = React.useState("");
  const onSubmit: SubmitHandler<Message> = (data) => {
    console.log(data);
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
    {success == 0 && (
      <div
        className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
        role="alert"
      >
        <div className="flex">
          <div className="py-1">
            <svg
              className="fill-current h-6 w-6 text-teal-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Nur noch ein Schritt...</p>
            <p className="text-sm">
              Vielen Dank für dein Interesse! Du solltest eine E-Mail erhalten
              haben, die du bestätigen musst. Bitte überprüfe auch deinen
              SPAM-Ordner.
            </p>
          </div>
        </div>
      </div>
    )}
    {success == -1 &&
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Kompletter Name
              </label>
              <div className="mt-2">
                <input
                  {...register("name", { required: true })}
                  type="text"
                  id="name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  field={errors.name}
                  error="Name wird benötigt"
                ></ErrorMessage>
              </div>
            </div>

            <div className="col-span-full">
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


            <div className="col-span-full">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Betreff
              </label>
              <div className="mt-2">
                <input
                  {...register("subject", { required: true })}
                  type="text"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  field={errors.subject}
                  error="Bitte gib einen Betreff ein."
                ></ErrorMessage>
              </div>
            </div>


            <div className="col-span-full">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Deine Nachricht an uns.
              </label>
              <div className="mt-2">
                <textarea
                  {...register("text", { required: true })}
                  id="text"
                  autoComplete="family-name"
                  className="block w-full h-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <ErrorMessage
                  field={errors.text}
                  error="Bitte gib einen Text ein."
                ></ErrorMessage>
              </div>
            </div>

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
    </form>}
    {success == 1 && (<FormFail recover={recover}/>)}
    </>
  );
}
