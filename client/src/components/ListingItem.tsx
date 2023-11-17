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
            <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
