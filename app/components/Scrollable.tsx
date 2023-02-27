import * as ScrollArea from "@radix-ui/react-scroll-area";

export default function Scrollable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollArea.Root className="h-full w-full flex-auto overflow-hidden">
      <ScrollArea.Viewport className="h-full">{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className="z-10 w-2 bg-transparent"
      >
        <ScrollArea.ScrollAreaThumb className="w-2 rounded-full bg-gray-500/25 backdrop-blur-md transition-colors  " />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
