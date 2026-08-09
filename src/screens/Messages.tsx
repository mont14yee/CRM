import { Header } from '../components/Shared';

export function Messages() {
  return (
    <div className="flex flex-col h-full bg-canvas pb-28 overflow-y-auto no-scrollbar">
      <Header title="Messages" />
      <div className="flex-1 flex items-center justify-center text-tx-muted text-[15px]">
        No new messages
      </div>
    </div>
  );
}
