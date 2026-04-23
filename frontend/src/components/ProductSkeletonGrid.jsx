import ProductSkeleton from "./ProductSkeleton";

const ProductSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductSkeletonGrid;