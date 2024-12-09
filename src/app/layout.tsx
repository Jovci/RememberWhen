import { ThemeProvider } from '@/providers/theme-provider';
import { UserProvider } from '@/app/context/UserContext'; // Import the UserProvider
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider> {/* Wrap the entire application with UserProvider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
