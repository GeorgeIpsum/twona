import { useRef } from "react";

import { observer } from "mobx-react-lite";

import { Integration } from "../types";
import IntegrationCard from "./IntegrationCard";

interface IntegrationSignInProps {
  integration: Integration;
  csrf?: string;
}
const IntegrationSignIn: React.FC<IntegrationSignInProps> = ({
  integration,
  csrf,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  console.log(csrf);

  const submit = () => {
    const data = [...new FormData(formRef.current!).entries()];
    const encoded = data
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
      )
      .join("&");

    fetch("http://localhost:3000/auth/signin/" + integration.name, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-csrf-token": csrf!,
      },
      body: encoded,
    }).then((res) => {
      res.text().then((text) => window.open(text, "_blank"));
    });
  };

  return (
    <form
      ref={formRef}
      action={`http://localhost:3000/auth/signin/${integration.name}`}
      method="POST"
    >
      <input type="hidden" name="csrfToken" value={csrf} />
      <input type="hidden" name="callbackUrl" value={`http://localhost:3000`} />
      <IntegrationCard onClick={submit} integration={integration} />
    </form>
  );
};

export default observer(IntegrationSignIn);
