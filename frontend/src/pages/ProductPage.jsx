import {
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  CalendarIcon,
  UserIcon,
  ShoppingCartIcon,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "@clerk/clerk-react";
import { useProduct, useDeleteProduct } from "../hooks/useProducts";
import { useParams, Link, useNavigate } from "react-router-dom";
import { createRazorpayOrder } from "../lib/api";
import toast from "react-hot-toast";

function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();

  const handleDelete = () => {
    if (!id) return;

    const confirmed = window.confirm("Delete this product permanently?");
    if (!confirmed) return;

    deleteProduct.mutate(id, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        navigate("/");
      },
      onError: () => {
        toast.error("Failed to delete product");
      },
    });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuy = async () => {
    try {
      const loaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!loaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const data = await createRazorpayOrder({ productId: id });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Productify",
        description: data.product.title,
        image: data.product.imageUrl,
        order_id: data.orderId,

        handler: function () {
          toast.success("Payment successful 🎉");
          navigate("/");
        },

        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
          },
        },

        prefill: {
          name: "User",
        },

        theme: {
          color: "#6366f1",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function () {
        toast.error("Payment failed");
      });

      paymentObject.open();
    } catch (err) {
      console.error("ORDER ERROR:", err);
      toast.error("Unable to start payment");
    }
  };

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

  if (error || !product) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = userId === product.userId;

  const price = product?.price
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(product.price))
    : "₹0";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>

        {isOwner && (
          <div className="flex gap-2">
            <Link
              to={`/edit/${product.id}`}
              className="btn btn-ghost btn-sm gap-1"
            >
              <EditIcon className="size-4" />
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-error btn-sm gap-1"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card bg-base-300 border border-base-200">
          <figure className="p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="rounded-xl w-full h-100 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </figure>
        </div>

        <div className="card bg-base-300 border border-base-200">
          <div className="card-body space-y-4">
            <h1 className="text-3xl font-bold">{product.title}</h1>

            <div className="text-3xl font-bold text-primary">{price}</div>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </div>

              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {product.user?.name || "Unknown"}
              </div>
            </div>

            <div className="divider"></div>

            <p className="text-base-content/80">{product.description}</p>

            {!isOwner && (
              <button
                type="button"
                onClick={handleBuy}
                className="btn btn-primary btn-lg w-full gap-2"
              >
                <ShoppingCartIcon className="size-5" />
                Buy Now
              </button>
            )}

            {product.user && (
              <div className="flex items-center gap-3 pt-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={product.user.imageUrl}
                      alt={product.user.name || "Creator"}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{product.user.name}</p>
                  <p className="text-xs text-base-content/50">Creator</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-base-300 border border-base-200">
        <div className="card-body">
          <CommentsSection
            productId={id}
            comments={Array.isArray(product.comments) ? product.comments : []}
            currentUserId={userId}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;