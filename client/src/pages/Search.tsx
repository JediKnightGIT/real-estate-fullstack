import React from 'react';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';

import { ListingData } from '../redux/user/types';
import ListingItem from '../components/ListingItem';

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
  const [listings, setListings] = React.useState<ListingData[] | null>(null);

  // console.log(listings);

  React.useEffect(() => {
    const urlParams = qs.parse(location.search, { ignoreQueryPrefix: true });

    const {
      searchTerm: searchTermFromUrl,
      type: typeFromUrl,
      parking: parkingFromUrl,
      furnished: furnishedFromUrl,
      offer: offerFromUrl,
      sort: sortFromUrl,
      order: orderFromUrl,
    } = urlParams;

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
        searchTerm: (searchTermFromUrl as string) || '',
        type: (typeFromUrl as string) || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: (sortFromUrl as string) || 'created_at',
        order: (orderFromUrl as string) || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = qs.stringify(urlParams);
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

    const searchQuery = qs.stringify({
      searchTerm: sidebarData.searchTerm,
      type: sidebarData.type,
      sort: sidebarData.sort,
      order: sidebarData.order,
      parking: sidebarData.parking.toString(),
      furnished: sidebarData.furnished.toString(),
      offer: sidebarData.offer.toString(),
    });
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
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b mt-5 p-3 text-slate-700">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings?.length === 0 && (
            <p className="text-slate-700 text-xl">No listings found!</p>
          )}
          {loading && <p className="text-slate-700 text-xl text-center w-full">Loading...</p>}
          {!loading && listings?.map((listing) => {
            return <ListingItem key={listing._id} listing={listing} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Search;
