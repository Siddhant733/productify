import { Link } from "react-router-dom";
import { MessageCircleIcon, CalendarDaysIcon } from "lucide-react";

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ProductCard = ({ product }) => {
  const createdAt = product?.createdAt ? new Date(product.createdAt) : null;
  const isNew = createdAt ? createdAt > oneWeekAgo : false;
  const comments = Array.isArray(product?.comments) ? product.comments : [];

  const formattedDate = createdAt
    ? createdAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  const price = product?.price
    ? `₹${Number(product.price).toFixed(2)}`
    : "₹0";

  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-300 border border-base-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
    >
      <figure className="relative h-48 overflow-hidden bg-base-200">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
          }}
        />

        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <span className="badge badge-secondary badge-sm shadow-sm">
              NEW
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="badge badge-primary badge-md font-semibold shadow-md">
            {price}
          </span>
        </div>
      </figure>

      <div className="card-body p-5 space-y-3">
        <div className="space-y-1">
          <h2 className="card-title text-base sm:text-lg leading-snug line-clamp-1">
            {product.title}
          </h2>

          <p className="text-sm text-base-content/70 line-clamp-2 min-h-10">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-base-content/50">
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="size-3.5" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircleIcon className="size-3.5" />
            <span>{comments.length}</span>
          </div>
        </div>

        <div className="divider my-0"></div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-base-content/50">Created by</p>
            <p className="text-sm font-medium">
              {product.user?.name || "Unknown user"}
            </p>
          </div>

          <span className="badge badge-outline badge-sm shrink-0">
            View
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;