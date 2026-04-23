import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { PackageIcon, SparklesIcon, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import ProductSkeletonGrid from "../components/ProductSkeletonGrid";

function HomePage() {
  const { isSignedIn } = useAuth();
  const { data, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const products = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) => {
      const title = product?.title?.toLowerCase() || "";
      const description = product?.description?.toLowerCase() || "";
      const creatorName = product?.user?.name?.toLowerCase() || "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        creatorName.includes(query)
      );
    });
  }, [products, searchTerm]);


if (isLoading) return <ProductSkeletonGrid />;

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>Something went wrong. Please refresh the page.</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="hero bg-linear-to-br from-base-300 via-base-200 to-base-300 rounded-box overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10 py-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110" />
            <img
              src="/image.png"
              alt="Creator"
              className="relative h-64 lg:h-72 rounded-2xl shadow-2xl"
            />
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Share Your <span className="text-primary">Products</span>
            </h1>

            <p className="py-4 text-base-content/60 max-w-xl">
              Upload, discover, and connect with creators through a clean,
              modern product-sharing platform.
            </p>

            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button type="button" className="btn btn-primary gap-2">
                  <SparklesIcon className="size-4" />
                  Start Selling
                </button>
              </SignInButton>
            ) : (
              <Link to="/create" className="btn btn-primary gap-2">
                <SparklesIcon className="size-4" />
                Create Product
              </Link>
            )}
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PackageIcon className="size-5 text-primary" />
            All Products
            <span className="badge badge-neutral badge-sm">
              {filteredProducts.length}
            </span>
          </h2>

          <label className="input input-bordered flex items-center gap-2 bg-base-200 w-full sm:max-w-sm">
            <SearchIcon className="size-4 text-base-content/50" />
            <input
              type="text"
              className="grow"
              placeholder="Search by title, description, creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {products.length === 0 ? (
          <div className="card bg-base-300 border border-base-200">
            <div className="card-body items-center text-center py-16">
              <PackageIcon className="size-16 text-base-content/20" />
              <h3 className="card-title text-base-content/60">No products yet</h3>
              <p className="text-base-content/40 text-sm max-w-md">
                Be the first to share something and start building your public
                product showcase.
              </p>

              <Link to="/create" className="btn btn-primary btn-sm mt-3">
                Create Product
              </Link>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="card bg-base-300 border border-base-200">
            <div className="card-body items-center text-center py-14">
              <SearchIcon className="size-12 text-base-content/20" />
              <h3 className="card-title text-base-content/60">No matching products</h3>
              <p className="text-base-content/40 text-sm">
                Try a different keyword or clear the search.
              </p>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="btn btn-ghost btn-sm mt-2"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;