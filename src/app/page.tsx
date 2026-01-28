import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";

export default function Home() {
  const featuredProducts = [
    {
      name: "Protector Solar Fusion Water MAGIC SPF 50",
      category: "Solar",
      price: "$24.990",
      imageUrl: "/hero-skincare.png", // Reusing hero image for now
    },
    {
      name: "Hyaluronic Concentrate Serum",
      category: "Facial",
      price: "$32.490",
      imageUrl: "/hero-skincare.png",
    },
    {
      name: "UreaRepair PLUS Loción 10%",
      category: "Corporal",
      price: "$18.990",
      imageUrl: "/hero-skincare.png",
    },
    {
      name: "Retinal Intense Serum de Noche",
      category: "Facial",
      price: "$45.990",
      imageUrl: "/hero-skincare.png",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center bg-neutral-soft overflow-hidden">
        <div className="container mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="text-brand-red font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-4 block">
              Innovación Dermatológica
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-dark mb-6 leading-tight">
              Tu piel, nuestra <br />
              <span className="italic font-light">inspiración</span>
            </h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-md leading-relaxed">
              Descubre fórmulas avanzadas diseñadas para proteger y restaurar la salud natural de tu piel, todos los días.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop/solar"
                className="btn-premium bg-brand-red text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/20 text-center"
              >
                Descubrir productos
              </Link>
              <Link
                href="/shop/facial"
                className="btn-premium border border-neutral-dark text-neutral-dark hover:bg-neutral-dark hover:text-white text-center"
              >
                Ver rutinas
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block relative h-[600px] animate-in fade-in zoom-in duration-1000">
            <Image
              src="/hero-skincare.png"
              alt="BELLA VIDA Premium Skincare"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/40 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* Featured Lines Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-neutral-dark mb-2">Nuestras Líneas</h2>
            <p className="text-neutral-500">Encuentra el cuidado perfecto para tus necesidades.</p>
          </div>
          <Link href="/shop" className="text-neutral-dark font-medium underline underline-offset-4 hover:text-brand-red transition-colors">
            Ver todo el catálogo
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Solar", "Facial", "Corporal", "Urea"].map((line) => (
            <Link key={line} href={`/shop/${line.toLowerCase()}`} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-neutral-soft">
              <div className="absolute inset-0 bg-neutral-dark/0 group-hover:bg-neutral-dark/10 transition-colors z-10" />
              <div className="absolute bottom-6 left-6 z-20">
                <h3 className="text-xl font-bold text-neutral-dark group-hover:text-brand-red transition-colors">{line}</h3>
                <span className="text-sm text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">Explorar &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-24 bg-white border-t border-neutral-med">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-dark mb-4 tracking-tight">Recomendados para ti</h2>
            <div className="w-20 h-1 bg-brand-red mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.name} {...product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
