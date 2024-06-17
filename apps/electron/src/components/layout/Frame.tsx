import { observer } from "mobx-react-lite";

const Frame: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="frame w-full min-w-[600px]">
      <div className="content">{children}</div>
    </div>
  );
};

export default observer(Frame);
