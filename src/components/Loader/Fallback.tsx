import { Loader } from "@mantine/core";

export function DefaultAsyncFallback() {
  return (
    <div className="flex-auto h-full py-20 flex justify-center items-center">
      <Loader size="sm" color="currentColor" />
    </div>
  );
}
