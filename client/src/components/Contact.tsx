import React from 'react';

import { ListingData, UserTypeWithMiddleware } from '../redux/user/types';

type ContactTypeProps = {
  listing: ListingData;
};

const Contact: React.FC<ContactTypeProps> = ({ listing }) => {
  const [landlord, setLandlord] = React.useState<UserTypeWithMiddleware | null>(null);

  React.useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/get/${listing.userRef}`);
        const data = await response.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <p>
          Contact <span>{landlord?.username}</span>
        </p>
      )}
    </>
  );
};

export default Contact;
