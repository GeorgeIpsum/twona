import { observer } from "mobx-react-lite";

import { Integration } from "../types";

interface IntegrationCardProps {
  integration: Integration;
  onClick?: () => void;
}
const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onClick,
}) => {
  return (
    <div
      key={integration.id}
      onClick={onClick}
      className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded border-2 border-violet-950/20 bg-violet-950/10 p-2 shadow-none shadow-slate-400/40 transition-all duration-200 ease-in-out hover:border-slate-200/20 hover:bg-slate-950/80 hover:shadow-sm"
    >
      {integration.imageUrl && (
        <img height="60" width="60" src={integration.imageUrl} />
      )}
      <span className="text-white">{integration.name}</span>
    </div>
  );
};

export default observer(IntegrationCard);
