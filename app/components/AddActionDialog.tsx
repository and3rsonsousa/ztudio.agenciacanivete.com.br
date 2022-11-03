import { Form, useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Button from "./Forms/Button";
import Field from "./Forms/Field";

export default function AddActionDialog({ date }: { date: Date }) {
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
      <h4 className="mb-4">Nova Ação</h4>
      <Form method="post" ref={formRef}>
        <Field name="name" title="Nome" />

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
