import Image from "next/image";
import { Plus } from "lucide-react";

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  imageUrl: string;
}

export default function ProductCard({ name, category, price, imageUrl }: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-neutral-800 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-dark/5 dark:hover:shadow-black/30 border border-transparent hover:border-neutral-med dark:hover:border-neutral-700">
      {/* Product Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4" style={{ backgroundImage: 'var(--product-bg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute bottom-3 right-3 bg-brand-green text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Plus size={20} />
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
          {category}
        </span>
        <h3 className="text-sm font-bold text-neutral-dark dark:text-white line-clamp-2 min-h-[40px] group-hover:text-brand-green transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-heading font-bold text-neutral-dark dark:text-white" suppressHydrationWarning>
            {price}
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
            IVA Incluido
          </span>
        </div>
      </div>
    </div>
  );
}
