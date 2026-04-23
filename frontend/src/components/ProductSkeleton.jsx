const ProductSkeleton = () => {
  return (
    <div className="card bg-base-300 border border-base-200 animate-pulse">
      <div className="h-48 bg-base-200 rounded-t-xl"></div>

      <div className="card-body space-y-3">
        <div className="h-4 bg-base-200 rounded w-3/4"></div>
        <div className="h-4 bg-base-200 rounded w-1/2"></div>

        <div className="h-3 bg-base-200 rounded w-full"></div>
        <div className="h-3 bg-base-200 rounded w-5/6"></div>

        <div className="flex items-center gap-2 mt-3">
          <div className="w-6 h-6 bg-base-200 rounded-full"></div>
          <div className="h-3 bg-base-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;