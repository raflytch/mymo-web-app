import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyMo - AI Habit Tracker",
  description: "Pelacak kebiasaan dengan AI coach personal",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
