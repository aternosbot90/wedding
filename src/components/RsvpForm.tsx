import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { WaxSeal } from './WaxSeal';
import { Check, Calendar } from 'lucide-react';
import { HOST_DETAILS } from '../types/wedding';

interface RsvpFormProps {
  onSuccess?: () => void;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ onSuccess }) => {
  const [guestName, setGuestName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | null>('yes');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [attendingRing, setAttendingRing] = useState(true);
  const [attendingBarat, setAttendingBarat] = useState(true);
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
        setAttendingRing(parsed.attendingRing ?? true);
        setAttendingBarat(parsed.attendingBarat ?? true);
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
        attendingRing,
        attendingBarat,
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
      'UID:ring-ceremony-abhishek-ishita-2026@delhi.in',
      'DTSTAMP:20261205T053000Z',
      'DTSTART:20261205T053000Z',
      'DTEND:20261205T093000Z',
      'SUMMARY:Abhishek weds Ishita — Ring Ceremony & Preeti Bhoj',
      'DESCRIPTION:Ring Ceremony of Abhishek & Ishita. 11:00 AM Ceremony, 1:00 PM Lunch. Hosted by Shri Vedprakash & Family.',
      'LOCATION:Mannat Vatika Farm, Delhi',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:wedding-abhishek-ishita-2026@delhi.in',
      'DTSTAMP:20261212T043000Z',
      'DTSTART:20261212T043000Z',
      'DTEND:20261212T183000Z',
      'SUMMARY:Abhishek weds Ishita — Barat & Shubh Vivah',
      'DESCRIPTION:Barat & Shubh Vivah celebrations. 10:00 AM Sehra Bandi, 11:00 AM Departure of Barat. Hosted by Shri Vedprakash & Family.',
      'LOCATION:Green Lounge North Banquet, Delhi',
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
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-3 animate-fadeIn">
        <WaxSeal size={74} />
        <h3 className="font-['Marcellus'] text-lg font-bold text-[#2A1F18] tracking-wider mt-1">
          {attending === 'yes' ? 'सादर आमंत्रण स्वीकार हुआ' : 'शुभकामनाओं के लिए हार्दिक धन्यवाद'}
        </h3>
        <p className="font-['Cormorant_Garamond'] text-sm sm:text-base text-[#5A4A3B] italic max-w-xs leading-snug">
          {attending === 'yes'
            ? `आदरणीय ${guestName}, आपका आगमन हमारे लिए परम सौभाग्य एवं हर्ष का विषय है।`
            : `आदरणीय ${guestName}, आपकी मंगलकामनाएँ एवं आशीर्वाद अभिषेक एवं इशिता के लिए अनमोल हैं।`}
        </p>

        {attending === 'yes' && (
          <div className="w-full bg-[#FAF5EB]/95 border border-[#DCD3C1] p-2.5 rounded text-left space-y-1 text-xs font-['Inter_Tight'] text-[#45382B]">
            <div className="flex justify-between">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C6D2B]">Guests:</span>
              <span>{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C6D2B]">Events Attending:</span>
              <span className="font-medium text-[11px]">
                {[attendingRing && '5 Dec (Ring Ceremony)', attendingBarat && '12 Dec (Barat & Vivah)'].filter(Boolean).join(', ') || 'All Events'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#8C6D2B]">Host:</span>
              <span>{HOST_DETAILS.hostName} & Family</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
          <button
            type="button"
            onClick={handleDownloadCalendar}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-[#B89758] bg-[#F9F5EC] hover:bg-[#F2ECE0] text-[#7A5B26] text-[10.5px] font-['Marcellus'] uppercase tracking-wider font-semibold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            Add to Calendar (.ics)
          </button>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center py-2 px-3 border border-[#C5BCAD] hover:bg-[#EAE4D8] text-[#5A4E40] text-[10.5px] font-['Inter_Tight'] uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            Edit RSVP
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2.5 text-[#2E241B] text-left"
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Attendance Radio Pills */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Marcellus']">
          Will you grace our celebrations in Delhi? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAttending('yes')}
            className={`py-1.5 px-2 text-center rounded border transition-all text-xs font-['Marcellus'] flex items-center justify-center gap-1 cursor-pointer ${
              attending === 'yes'
                ? 'bg-[#183D2A] text-[#FAF6ED] border-[#183D2A] font-semibold shadow-sm'
                : 'bg-white/70 text-[#4E4437] border-[#D6CBB7] hover:bg-white'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${attending === 'yes' ? 'opacity-100' : 'opacity-0'}`} />
            सादर स्वीकार (Accepts)
          </button>
          <button
            type="button"
            onClick={() => setAttending('no')}
            className={`py-1.5 px-2 text-center rounded border transition-all text-xs font-['Marcellus'] flex items-center justify-center gap-1 cursor-pointer ${
              attending === 'no'
                ? 'bg-[#7A1E29] text-[#FAF6ED] border-[#7A1E29] font-semibold shadow-sm'
                : 'bg-white/70 text-[#4E4437] border-[#D6CBB7] hover:bg-white'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${attending === 'no' ? 'opacity-100' : 'opacity-0'}`} />
            सादर क्षमा (Declines)
          </button>
        </div>
      </div>

      {/* Guest Name & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block text-[9.5px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-0.5 font-['Inter_Tight']">
            Your Full Name(s) *
          </label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. Sharma Family"
            className="w-full px-2.5 py-1.5 bg-white/80 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Marcellus'] focus:bg-white focus:outline-none focus:border-[#A6803C]"
          />
        </div>
        <div>
          <label className="block text-[9.5px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-0.5 font-['Inter_Tight']">
            Mobile Number / WhatsApp *
          </label>
          <input
            type="text"
            required
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="+91 Mobile number"
            className="w-full px-2.5 py-1.5 bg-white/80 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Inter_Tight'] focus:bg-white focus:outline-none focus:border-[#A6803C]"
          />
        </div>
      </div>

      {attending === 'yes' && (
        <>
          {/* Ceremony Event Checkboxes */}
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-1 font-['Inter_Tight']">
              Select Ceremonies Attending
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-['Inter_Tight']">
              <label className="flex items-center gap-2 p-2 rounded bg-white/70 border border-[#D6CBB7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendingRing}
                  onChange={(e) => setAttendingRing(e.target.checked)}
                  className="accent-[#7A1522]"
                />
                <span className="text-[11px] font-medium leading-tight">
                  <strong>5 Dec</strong> • Ring Ceremony (Mannat Vatika)
                </span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded bg-white/70 border border-[#D6CBB7] cursor-pointer">
                <input
                  type="checkbox"
                  checked={attendingBarat}
                  onChange={(e) => setAttendingBarat(e.target.checked)}
                  className="accent-[#7A1522]"
                />
                <span className="text-[11px] font-medium leading-tight">
                  <strong>12 Dec</strong> • Barat & Vivah (Green Lounge)
                </span>
              </label>
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-0.5 font-['Inter_Tight']">
              Total Number of Guests Attending
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 bg-white/80 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Inter_Tight'] focus:bg-white focus:outline-none focus:border-[#A6803C]"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={5}>5+ Family Members</option>
            </select>
          </div>
        </>
      )}

      {/* Warm Wishes message */}
      <div>
        <label className="block text-[9.5px] uppercase tracking-[0.16em] font-semibold text-[#8C6D2B] mb-0.5 font-['Inter_Tight']">
          Send Your Blessings & Wishes
        </label>
        <textarea
          rows={2}
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder="आपकी मंगलकामनाएँ एवं आशीर्वाद..."
          className="w-full px-2.5 py-1.5 bg-white/80 border border-[#D1C5B0] rounded text-xs text-[#2A2117] font-['Cormorant_Garamond'] text-sm focus:bg-white focus:outline-none focus:border-[#A6803C]"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSealing}
        className="w-full py-2 px-4 rounded bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] font-['Marcellus'] text-xs font-bold tracking-widest uppercase transition-all shadow cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
      >
        <span>{isSealing ? 'Sealing RSVP...' : 'पुष्टि करें • CONFIRM RSVP'}</span>
      </button>
    </form>
  );
};
