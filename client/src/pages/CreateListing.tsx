import React from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import { app } from '../firebase';
import { ListingData, ListingDataWithMiddleware } from '../redux/user/types';
import { RootState } from '../redux/store';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';

// export interface IListing {
//   _id?: string;
//   _doc?: any;
//   __v?: number;
// }

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  const [files, setFiles] = React.useState<File[]>();
  const [formData, setFormData] = React.useState<ListingData>({
    _id: '',
    name: '',
    description: '',
    address: '',
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = React.useState<string>('');
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  console.log(formData);
  console.log(currentUser?._id);

  const handleImagesSubmit = async () => {
    if (files && files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploadError('');
      setUploading(true);
      const promises: Promise<string>[] = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      try {
        const urls = await Promise.all(promises);
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError('');
        setUploading(false);
      } catch (error) {
        setImageUploadError('Image upload failed (2 MB max per image)');
        setUploading(false);
      }
    } else {
      setImageUploadError('You can only upload up to 6 images');
      setUploading(false);
    }
  };

  const storeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({ ...formData, [e.target.id]: (e.target as HTMLInputElement).checked });
    }

    if (e.target.type === 'text' || e.target.type === 'textarea') {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    if (e.target.type === 'number') {
      setFormData({ ...formData, [e.target.id]: +e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError('You must upload at least one image');
      }
      if (formData.regularPrice < formData.discountPrice) {
        return setError('Discount price must be less than regular price');
      }
      setLoading(true);
      setError(null);

      const response = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser?._id,
          _id: currentUser?._id,
        }),
      });

      const data: ListingDataWithMiddleware = await response.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError((error as Record<string, string>).message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            onChange={handleChange}
            value={formData.name}
            minLength={10}
            maxLength={62}
            placeholder="Name"
            className="border p-3 rounded-lg"
            required
          />
          <textarea
            id="description"
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            id="address"
            onChange={handleChange}
            value={formData.address}
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={formData.type === 'sale'}
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === 'rent'}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
                className="w-5"
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                min={50}
                max={10000000}
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  min={0}
                  max={10000000}
                  className="p-3 border border-gray-300 rounded-lg"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold ">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be a cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => e.target.files && setFiles([...e.target.files])}
              type="file"
              id="images"
              accept="image/*"
              className="p-3 border border-gray-300 rounded w-full"
              multiple
            />
            <button
              onClick={handleImagesSubmit}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity:80"
              disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div key={url} className="flex justify-between items-center p-3 border">
                <img
                  src={url}
                  alt={'Listing image ' + i + 1}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(i)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">
                  Delete
                </button>
              </div>
            ))}
          <button
            type="submit"
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
