import Link from "next/link";
import { getCampsites, getTrails } from "@/lib/data";
import { CampsiteCard } from "@/components/CampsiteCard";
import { TrailCard } from "@/components/TrailCard";
import { StayingDryBlock } from "@/components/StayingDryBlock";

export default function Home() {
  const featuredCampsites = getCampsites().slice(0, 3);
  const featuredTrails = getTrails().slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-center text-white bg-slate-900">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Replace with a real hero image eventually */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url(/images/hero-loch-ness.png)' }}
        />

        <div className="relative z-20 container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Loch Ness Camping & Trails
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-100 max-w-2xl mx-auto">
            Your independent guide to campsites, glamping spots, and hiking trails around Scotland&apos;s most famous loch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/campsites"
              className="px-8 py-3 bg-brand-green hover:bg-green-600 text-white font-bold rounded-lg transition-colors w-full sm:w-auto"
            >
              Find a Campsite
            </Link>
            <Link
              href="/trails"
              className="px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-colors w-full sm:w-auto"
            >
              Explore Trails
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Campsites */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Campsites</h2>
              <p className="text-slate-600">Top spots to pitch a tent or park your van.</p>
            </div>
            <Link href="/campsites" className="text-brand-green font-semibold hover:underline hidden md:block">
              View all places to stay &rarr;
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampsites.map(site => (
              <CampsiteCard key={site.id} campsite={site} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/campsites" className="text-brand-green font-semibold hover:underline">
              View all places to stay &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Intro / Value Prop */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Wild, Wonderful, and Waiting for You</h2>
              <p className="text-slate-700 mb-4 text-lg">
                Loch Ness is more than just a monster legend. It&apos;s a gateway to the Highlands, offering some of the best hiking, paddling, and camping in the UK.
              </p>
              <p className="text-slate-700 mb-6">
                Whether you&apos;re looking for a family-friendly holiday park with full facilities or a quiet wild camping spot near the water, our independent directory helps you find the perfect base.
              </p>
              <StayingDryBlock />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Popular Trails</h3>
              <div className="space-y-4">
                {featuredTrails.map(trail => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>
              <Link href="/trails" className="inline-block text-brand-green font-semibold hover:underline mt-2">
                Discover more hiking routes &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
