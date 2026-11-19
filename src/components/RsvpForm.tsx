import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { WaxSeal } from './WaxSeal';
import { Check, Calendar, Heart, Music } from 'lucide-react';

interface RsvpFormProps {
  onSuccess?: () => void;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ onSuccess }) => {
  const [guestName, setGuestName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | null>('yes');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [cuisine, setCuisine] = useState<string>('rajasthani-pure-veg');
  const [song, setSong] = useState('');
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvp_abhishek_ishita');
      if (saved) {
        const parsed = JSON.parse(saved);
        setGuestName(parsed.guestName || '');
        setPhoneOrEmail(parsed.phoneOrEmail || '');
        setAttending(parsed.attending);
        setGuestCount(parsed.guestCount || 2);
        setCuisine(parsed.cuisine || 'rajasthani-pure-veg');
        setSong(parsed.song || '');
        setWishes(parsed.wishes || '');
        setSubmitted(true);
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSealing(true);
    sound.playWaxStamp();

    setTimeout(() => {
      sound.playCelebrationChime();
      const rsvpData = {
        guestName,
        phoneOrEmail,
        attending,
        guestCount,
        cuisine,
        song,
        wishes,
        submittedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem('wedding_rsvp_abhishek_ishita', JSON.stringify(rsvpData));
      } catch {}

      setIsSealing(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    }, 700);
  };

  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Abhishek weds Ishita Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:wedding-abhishek-ishita-2026@udaivilas.in',
      'DTSTAMP:20261128T090000Z',
      'DTSTART:20261128T053000Z',
      'DTEND:20261130T183000Z',
      'SUMMARY:Abhishek weds Ishita — Shubh Vivah Celebrations',
      'DESCRIPTION:Join us to celebrate the royal wedding of Abhishek & Ishita at The Oberoi Udaivilas, Lake Pichola, Udaipur, Rajasthan.',
      'LOCATION:The Oberoi Udaivilas, Haridas Ji Ki Magri, Mulla Talai, Udaipur, Rajasthan 313001',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Abhishek_weds_Ishita_Wedding.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-5 text-center space-y-3.5 animate-fadeIn">
        <WaxSeal size={84} />
        <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1F18] tracking-wider mt-1">
          {attending === 'yes' ? 'सादर आमंत्रण स्वीकार हुआ' : 'शुभकामनाओं के लिए हार्दिक धन्यवाद'}
        </h3>
        <p className="font-['Cormorant_Garamond'] text-base text-[#5A4A3B] italic max-w-xs leading-snug">
          {attending === 'yes'
            ? `आदरणीय ${guestName}, we are blessed and overjoyed to welcome you to Udaipur to witness our sacred vows.`
            : `आदरणीय ${guestName}, though you cannot be present in Udaipur, your heartfelt blessings are cherished by Abhishek & Ishita.`}
        </p>

        {attending === 'yes' && (
          <div className="w-full bg-[#F4EFE6]/90 border border-[#DCD3C1] p-3 rounded text-left space-y-1.5 text-xs font-['Inter_Tight'] text-[#45382B]">
            <div className="flex justify-between">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C6D2B]">Guests:</span>
              <span>{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C6D2B]">Cuisine:</span>
              <span>{cuisine === 'jain' ? 'Jain (No Onion/Garlic)' : 'Royal Rajasthani & Awadhi Pure Veg'}</span>
            </div>
            {song && (
              <div className="flex justify-between">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C6D2B]">Sangeet Song:</span>
                <span className="italic truncate max-w-[160px]">"{song}"</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
          <button
            type="button"
            onClick={handleDownloadCalendar}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-[#B89758] bg-[#F9F5EC] hover:bg-[#F2ECE0] text-[#7A5B26] text-[11px] font-['Marcellus'] uppercase tracking-wider font-semibold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Add to Calendar (.ics)
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center py-2 px-3 border border-[#C5BCAD] hover:bg-[#EAE4D8] text-[#5A4E40] text-[11px] font-['Inter_Tight'] uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Edit RSVP
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-[#2E241B] text-left">
      {/* Attendance Radio Pills */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8C6D2B] mb-1 font-['Marcellus']">
          Will you grace our celebration in Udaipur? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAttending('yes')}
            className={`py-2 px-2 text-center rounded border transition-all text-xs font-['Marcellus'] flex items-center justify-center gap-1.5 cursor-pointer ${
              attending === 'yes'
                ? 'bg-[#183D2A] text-[#FAF6ED] border-[#183D2A] font-semibold shadow-sm'
                : 'bg-white/70 text-[#4E4437] border-[#D6CBB7] hover:bg-white'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${attending === 'yes' ? 'opacity-100' : 'opacity-0'}`} />
            सादर स्वीकार (Joyfully Accepts)
          </button>
          <button
            type="button"
            onClick={() => setAttending('no')}
            className={`py-2 px-2 text-center rounded border transition-all text-xs font-['Marcellus'] flex items-center justify-center gap-1.5 cursor-pointer ${
              attending === 'no'
                ? 'bg-[#7A1E29] text-[#FAF6ED] border-[#7A1E29] font-semibold shadow-sm'
                : 'bg-white/70 text-[#4E4437] border-[#D6CBB7] hover:bg-white'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${attending === 'no' ? 'opacity-100' : 'opacity-0'}`} />
            सादर क्षमा (Regretfully Declines)
          </button>
        </div>
      </div>

      {/* Guest Name & Phone/Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
            Your Full Name(s) *
          </label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Sharma Family / Dr. Verma"
            className="w-full px-2.5 py-1.5 bg-white/75 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Cormorant_Garamond'] text-base focus:bg-white focus:outline-none focus:border-[#A6803C] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
            WhatsApp / Email *
          </label>
          <input
            type="text"
            required
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="For itinerary & boat transfers"
            className="w-full px-2.5 py-1.5 bg-white/75 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Inter_Tight'] focus:bg-white focus:outline-none focus:border-[#A6803C] transition-colors"
          />
        </div>
      </div>

      {attending === 'yes' && (
        <>
          {/* Guest Count & Food */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
                Number of Guests Attending
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white/75 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Inter_Tight'] focus:bg-white focus:outline-none focus:border-[#A6803C]"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests (Couple)</option>
                <option value={3}>3 Guests (Family)</option>
                <option value={4}>4 Guests (Family)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
                Culinary / Dietary Preference
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white/75 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Inter_Tight'] focus:bg-white focus:outline-none focus:border-[#A6803C]"
              >
                <option value="rajasthani-pure-veg">Royal Rajasthani & Multi-Cuisine Veg</option>
                <option value="jain">Jain Special (No Onion, No Garlic)</option>
                <option value="regular">All Gourmet Offerings</option>
              </select>
            </div>
          </div>

          {/* Sangeet Song Request */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
              Sangeet Dance Song Request for the DJ
            </label>
            <input
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              placeholder="e.g. Gallan Goodiyan, London Thumakda, Kesariya..."
              className="w-full px-2.5 py-1.5 bg-white/75 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Inter_Tight'] focus:bg-white focus:outline-none focus:border-[#A6803C]"
            />
          </div>
        </>
      )}

      {/* Aashirwad / Blessing */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
          Aashirwad & Message for Abhishek & Ishita
        </label>
        <textarea
          rows={2}
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder="Send your warm blessings and wishes..."
          className="w-full px-2.5 py-1.5 bg-white/75 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Cormorant_Garamond'] text-base italic focus:bg-white focus:outline-none focus:border-[#A6803C] resize-none"
        />
      </div>

      {/* Seal Button */}
      <button
        type="submit"
        disabled={isSealing}
        className="w-full mt-1.5 relative py-2.5 px-4 bg-[#7A1E29] hover:bg-[#631420] active:scale-[0.99] text-[#FAF6ED] rounded border border-[#9A3542] shadow-md transition-all font-['Marcellus'] tracking-[0.2em] uppercase text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSealing ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
            Embossing Kumkum Seal...
          </span>
        ) : (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5C158]" />
            Seal & Confirm RSVP (शुभ विवाह)
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5C158]" />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-[#8C7A65] font-['Inter_Tight'] tracking-wider">
        Kindly confirm by 15th October 2026 • The Oberoi Udaivilas, Udaipur
      </p>
    </form>
  );
};
