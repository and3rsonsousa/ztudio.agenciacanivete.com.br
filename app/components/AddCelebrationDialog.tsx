import { Form, useActionData } from "@remix-run/react";
import { format } from "date-fns";
import Button from "./Forms/Button";
import Checkbox from "./Forms/Checkbox";
import Field from "./Forms/Field";

export default function AddCelebrationDialog({ date }: { date: Date }) {
  const actionData = useActionData();

  return (
    <>
      <h4 className="mb-4">Nova Data Comemorativa</h4>

      <pre>{JSON.stringify(actionData, undefined, 2)}</pre>

      <Form method="post">
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
        <div className="text-right">
          <Button primary type="submit">
            Adicionar
          </Button>
        </div>
      </Form>
    </>
  );
}
