import { Link, useNavigate } from "react-router-dom";
import { useCreateProduct } from "../hooks/useProducts";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  FileTextIcon,
  ImageIcon,
  SparklesIcon,
  TypeIcon,
} from "lucide-react";

function CreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, price } = formData;

    if (!title.trim() || !description.trim() || !price) {
      toast.error("All fields are required");
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setUploading(true);

      const cloudData = new FormData();
      cloudData.append("file", imageFile);
      cloudData.append("upload_preset", "offvztut");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvexgj9oq/image/upload",
        cloudData
      );

      const imageUrl = res.data.secure_url;

      createProduct.mutate(
        {
          title: title.trim(),
          description: description.trim(),
          imageUrl,
          price: price.toString(),
        },
        {
          onSuccess: () => {
            toast.success("Product created!");
            navigate("/");
          },
          onError: () => {
            toast.error("Failed to create product");
          },
        }
      );
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" />
        Back
      </Link>

      <div className="card bg-base-300 border border-base-200 shadow-sm">
        <div className="card-body">
          <h1 className="card-title">
            <SparklesIcon className="size-5 text-primary" />
            New Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* TITLE */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Product title"
                className="grow"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </label>

            {/* PRICE */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              💰
              <input
                type="number"
                placeholder="Price (₹)"
                className="grow"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </label>

            {/* IMAGE */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <ImageIcon className="size-4 text-base-content/50" />
              <input
                type="file"
                accept="image/*"
                className="grow"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
            </label>

            {preview && (
              <div className="rounded-box overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="form-control">
              <div className="flex items-start gap-2 p-3 rounded-box bg-base-200 border border-base-300">
                <FileTextIcon className="size-4 text-base-content/50 mt-1" />
                <textarea
                  placeholder="Description"
                  className="grow bg-transparent resize-none focus:outline-none min-h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={uploading || createProduct.isPending}
            >
              {uploading ? (
                <span className="loading loading-spinner" />
              ) : (
                "Create Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;