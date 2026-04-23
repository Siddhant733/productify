import { Link, useNavigate } from "react-router-dom";
import { useMyProducts, useDeleteProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PackageIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  MessageCircleIcon,
  CalendarDaysIcon,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyProducts();
  const deleteProduct = useDeleteProduct();

  const products = Array.isArray(data) ? data : [];

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>Failed to load your products. Please refresh the page.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-base-content/60 text-sm">
            Manage your listings and keep your showcase up to date.
          </p>
        </div>

        <Link to="/create" className="btn btn-primary btn-sm gap-1">
          <PlusIcon className="size-4" />
          New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="stats bg-base-300 border border-base-200 w-full shadow-sm">
          <div className="stat">
            <div className="stat-title">Total Products</div>
            <div className="stat-value text-primary">{products.length}</div>
            <div className="stat-desc">Products you have published</div>
          </div>
        </div>

        <div className="stats bg-base-300 border border-base-200 w-full shadow-sm">
          <div className="stat">
            <div className="stat-title">Total Comments</div>
            <div className="stat-value text-secondary">
              {products.reduce(
                (sum, product) =>
                  sum + (Array.isArray(product.comments) ? product.comments.length : 0),
                0
              )}
            </div>
            <div className="stat-desc">Comments across your products</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="card bg-base-300 border border-base-200 shadow-sm">
          <div className="card-body items-center text-center py-16">
            <PackageIcon className="size-16 text-base-content/20" />
            <h3 className="card-title text-base-content/60">No products yet</h3>
            <p className="text-base-content/40 text-sm max-w-md">
              Start by creating your first product and building your public showcase.
            </p>
            <Link to="/create" className="btn btn-primary btn-sm mt-4">
              Create Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => {
            const commentsCount = Array.isArray(product.comments)
              ? product.comments.length
              : 0;

            const createdAt = product?.createdAt
              ? new Date(product.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown date";

            return (
              <div
                key={product.id}
                className="card card-side bg-base-300 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <figure className="w-32 sm:w-40 shrink-0 bg-base-200">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </figure>

                <div className="card-body p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="card-title text-base sm:text-lg line-clamp-1">
                        {product.title}
                      </h2>
                      <p className="text-sm text-base-content/60 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <span className="badge badge-outline badge-sm shrink-0">
                      Published
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/50 mt-1">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="size-3.5" />
                      <span>{createdAt}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircleIcon className="size-3.5" />
                      <span>{commentsCount} comments</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="btn btn-ghost btn-xs gap-1"
                    >
                      <EyeIcon className="size-3" />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/edit/${product.id}`)}
                      className="btn btn-ghost btn-xs gap-1"
                    >
                      <EditIcon className="size-3" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-ghost btn-xs text-error gap-1"
                      disabled={deleteProduct.isPending}
                    >
                      {deleteProduct.isPending ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <Trash2Icon className="size-3" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;