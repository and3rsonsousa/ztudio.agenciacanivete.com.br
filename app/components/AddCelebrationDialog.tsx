import { Form, useTransition } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import Button from "./Forms/Button";
import Checkbox from "./Forms/Checkbox";
import Field from "./Forms/Field";

export default function AddCelebrationDialog({
  date,
  handleClose,
}: {
  date: Date;
  handleClose?: () => void;
}) {
  const transition = useTransition();
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("action") === "create-celebration";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <>
      <h4 className="mb-4">Nova Data Comemorativa</h4>
      {/* {actionData ? (
        <Exclamation type={actionData.error ? "error" : "success"} icon>
          {actionData.error
            ? actionData.error.message
            : `"${actionData.data.name}" criado com sucesso!`}
        </Exclamation>
      ) : null} */}

      <Form method="post" ref={formRef}>
        <input type="hidden" name="action" value="create-celebration" />
        <Field name="name" title="Nome" />
        <Field
          name="date"
          title="Data"
          pattern="[0-9]{2}/[0-9]{2}"
          value={format(date, "dd/MM")}
          placeholder="dd/mm"
        />
        <Checkbox title="Feriado" name="is_holiday" />
        <div className="flex items-center justify-end border-t pt-4 lg:pt-8">
          {/* <Checkbox
            name="close"
            title="Manter aberta"
            checked={keepOpened}
            onChange={() => setKeepOpened(!keepOpened)}
          /> */}
          <Button primary type="submit">
            Adicionar
          </Button>
        </div>
      </Form>
    </>
  );
}
