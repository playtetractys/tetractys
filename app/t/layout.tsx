import { Tetractys } from "@/components/tetractys";
import { TetractysContextProviderComponent } from "@/contexts/tetractysContext";

export default function TetractysLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TetractysContextProviderComponent>
      {children}
      <Tetractys />
    </TetractysContextProviderComponent>
  );
}
