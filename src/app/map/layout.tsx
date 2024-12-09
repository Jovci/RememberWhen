import { Footer } from '@/components/common/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Only include footer here */}
      <main className="flex-1 overflow-hidden">{children}</main>
      <Footer />
    </div>
  );
}
