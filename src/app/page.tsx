import { HeaderLanding } from '@/components/common/HeaderLanding';
import { Footer } from '@/components/common/footer';
import { Button } from '@/components/ui/button';
import Typography from '@/components/ui/typography';
import Image from 'next/image';
import Feature from './feature';
import { ArrowUpDown, Timer, Workflow } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLanding />
      <main className="flex-1 overflow-y-auto">
        <div
          className="flex flex-col md:py-36 md:px-32 pt-11 pb-24 px-8
          w-full items-center text-center gap-12"
        >
          <div className="flex flex-col gap-6 items-center">
            <Typography className="max-w-2xl" variant="h1">
              RememberWhen
            </Typography>
            <Typography className="max-w-2xl" variant="h5">
              RememberWhen is a map-based application that brings family and
              friends together. RememberWhen provides a private map where users can
              upload their videos or photos. Depending on the metadata, markers will be
              placed on the map to represent photos and memories made in that specific area.
              This is not a social media platform but more of a virtual photo album for when
              you say, remember when?
            </Typography>
            <Link href="/map">

            </Link>
            <div style={{ width: '100%', height: '400px' }}>
              <iframe
                width="100%"
                height="100%"
                src="https://api.mapbox.com/styles/v1/jovci/clxbm0ukj024301pohxdx4u98.html?title=false&access_token=pk.eyJ1Ijoiam92Y2kiLCJhIjoiY2x2dWVzNzU2MWphdDJ3bzZ0NDh6dmR5ZiJ9.T8BAscTbUkJhCBTnq1_iSQ&zoomwheel=true#0/37.0902/-95.7129"
                title="Map Preview"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
          <div className="flex flex-col md:pt-1 md:gap-11 gap-1 items-center">
            <div className="flex flex-col gap-12 items-center">
              <Typography className="max-w-2xl" variant="h1">
                Memories Done Right
              </Typography>
              <div className="flex md:flex-row flex-col gap-12">
                <Feature
                  icon={<Timer size={24} />}
                  headline="Fast Collaboration"
                  description="Upload media now"
                />
                <Feature
                  icon={<ArrowUpDown size={24} />}
                  headline="Universally Compatible"
                  description="Works with iOS, Android, Web"
                />
                <Feature
                  icon={<Workflow size={24} />}
                  headline="Secure for Your Org"
                  description="We keep your data safe by taking top security measures."
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 max-w-2xl items-center">
              <Typography className="max-w-2xl" variant="h1">
                Invite Family and Friends, Collaborate Now
              </Typography>
              <Typography className="max-w-2xl" variant="p">
                Current social media platforms fail to provide intimate, meaningful ways
                to share and relive memories, often sacrificing personal connection for
                broader social engagement.
              </Typography>
              <Image
                width={1024}
                height={632}
                alt="RememberWhen.dev hero image"
                src="/landingpage1.png"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
