import { observer } from "mobx-react-lite";

import { signIn } from "~/services/auth";

import { Integration } from "../types";
import IntegrationCard from "./IntegrationCard";

interface IntegrationSignInProps {
  integration: Integration;
}
const IntegrationSignIn: React.FC<IntegrationSignInProps> = ({
  integration,
}) => {
  const submit = () => signIn(integration.name);

  return <IntegrationCard onClick={submit} integration={integration} />;
};

export default observer(IntegrationSignIn);
