import OrderForm from "./components/OrderForm";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-onyx-200 py-8">
      <nav className="flex justify-center mb-8">
        <Link 
          href="/catalog"
          className="px-6 py-3 bg-onyx-800 text-white rounded-lg hover:bg-onyx-700 transition-colors"
        >
          📖 View Catalog
        </Link>
      </nav>
      <OrderForm />
    </div>
  );
}
