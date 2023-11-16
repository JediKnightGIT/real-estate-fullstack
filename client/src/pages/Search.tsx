import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingData } from '../redux/user/types';

type SidebarData = {
  searchTerm: string;
  type: string;
  parking: boolean;
  furnished: boolean;
  offer: boolean;
  sort: string;
  order: string;
};

const Search = () => {
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = React.useState<SidebarData>({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = React.useState(false);
  const [listings, setListings] = React.useState<ListingData | null>(null);

  console.log(listings);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await response.json();
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          (e.target as HTMLInputElement).checked ||
          (e.target as HTMLInputElement).checked.toString() === 'true'
            ? true
            : false,
      });
    }

    if (e.target.id === 'sortOrder') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    urlParams.set('parking', sidebarData.parking.toString());
    urlParams.set('furnished', sidebarData.furnished.toString());
    urlParams.set('offer', sidebarData.offer.toString());
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row md:min-h-screen">
      <div className="p-7 border-b-2 md:border-r-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              onChange={handleChange}
              value={sidebarData.searchTerm}
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebarData.type === 'all'}
                id="all"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebarData.type === 'rent'}
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebarData.type === 'sale'}
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebarData.offer}
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebarData.parking}
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebarData.furnished}
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id="sortOrder"
              className="border rounded-lg p-3">
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 rounded-lg uppercase text-white p-3 hover:opacity-95">
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b mt-5 p-3 text-slate-700">
          Listing results:
        </h1>
      </div>
    </div>
  );
};

export default Search;
