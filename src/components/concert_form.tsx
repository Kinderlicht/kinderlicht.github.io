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

interface Message {
  name: string;
  email: string;
  subject: string;
  text: string;
}

export default function ConcertForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Message>({ mode: "onChange" });
  let [success, setSuccess] = React.useState(-1);
  let [recover, setRecover] = React.useState("");
  const onSubmit: SubmitHandler<Message> = (data) => {
    fetch("https://api.campai.com/formSubmissions/65e62e12ca4e1a78d12014f1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        formData: {
            name: data.name,
            email: data.email,
            subject: `2024-07-14 - Konzert der Filmmusik: ${data.subject}`,
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
    {success == 0 && (<FormSuccess/>)}
    {success != 0 &&
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
                htmlFor="subject-text"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Betreff
              </label>
              <div className="mt-2">
                <input
                  {...register("subject", { required: true })}
                  type="text"
                  id="subject-text"
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
                htmlFor="subject-text"
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
