import React from 'react';
import { Link } from 'react-router-dom';

import { ListingData, UserTypeWithMiddleware } from '../redux/user/types';

type ContactTypeProps = {
  listing: ListingData;
};

const Contact: React.FC<ContactTypeProps> = ({ listing }) => {
  const [landlord, setLandlord] = React.useState<UserTypeWithMiddleware | null>(null);
  const [message, setMessage] = React.useState<string>('');

  React.useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
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
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord?.username}</span> for{' '}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            id="message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Enter your message here..."
            rows={2}
            className="w-full border rounded-lg p-3"
          />

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center uppercase p-3 rounded-lg hover:opacity-95">
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
