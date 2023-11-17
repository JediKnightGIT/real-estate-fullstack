import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

import { ContactTypeProps } from './Contact';

const ListingItem: React.FC<ContactTypeProps> = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg rounded-lg transition-shadow overflow-hidden w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name + ' cover'}
          className="h-[320px] object-cover w-full sm:h-[220px] hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 w-full truncate">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
          <p className="text-slate-500 font-semibold mt-2">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          <div className="flex gap-4 text-slate-700">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : '1 bed'}
            </div>
            <div className="font-bold text-xs">
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : '1 bath'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
