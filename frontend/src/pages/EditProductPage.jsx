import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProductForm from "../components/EditProductForm";
import toast from "react-hot-toast";

function EditProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProduct(id);
  const updateProduct = useUpdateProduct();

  if (!id) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Invalid product ID</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error || !product || product.userId !== userId) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">
            {!product
              ? "Product not found"
              : product.userId !== userId
              ? "Access denied"
              : "Something went wrong"}
          </h2>

          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditProductForm
      product={product}
      isPending={updateProduct.isPending}
      isError={updateProduct.isError}
      onSubmit={(formData) => {
        updateProduct.mutate(
          { id, ...formData },
          {
            onSuccess: () => {
              toast.success("Product updated successfully!");
              navigate(`/product/${id}`);
            },
            onError: (error) => {
              toast.error(
                error?.response?.data?.error ||
                  "Failed to update product. Try again."
              );
            },
          }
        );
      }}
    />
  );
}

export default EditProductPage;