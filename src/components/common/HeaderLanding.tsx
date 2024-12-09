import Link from 'next/link';
import Typography from '@/components/ui/typography';

export function HeaderLanding({ className }: { className?: string }) {
  return (
    <div
      className={`flex md:h-12 h-14 items-center justify-center w-full border-b px-4 ${className}`}
    >
      <div className="w-full max-w-[1280px] md:px-8 px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-8">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="mr-3" />
              <Typography className="!text-white !text-base font-medium">
                RememberWhen
              </Typography>
            </Link>
          </div>
          <div className="flex items-center gap-x-8">
            <Link href="/login">
              <Typography variant="p">Login</Typography>
            </Link>
            <Link href="/signup">
              <button className="p-2 bg-blue-500 text-white rounded">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
