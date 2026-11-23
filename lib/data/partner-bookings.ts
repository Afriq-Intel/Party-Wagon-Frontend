/**
 * MOCK DATA — Partner Bookings visual development only.
 * Not live booking records. Replace with confirmed partner booking APIs later.
 *
 * Seed includes dashboard activity #PW-1048 (Garden Wedding) for Glow Events.
 */
import type {
  PartnerBooking,
  PartnerBookingStatus,
} from "@/types/partner-bookings";

export const PARTNER_BOOKINGS_PAGE_SIZE = 8;

export const PARTNER_BOOKINGS_STORAGE_KEY = "party-wagon-partner-bookings-v1";

export function partnerBookingStatusLabel(
  status: PartnerBookingStatus,
): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "declined":
      return "Declined";
    case "cancelled":
      return "Cancelled";
  }
}

export function partnerBookingStatusHint(
  status: PartnerBookingStatus,
): string {
  switch (status) {
    case "pending":
      return "Awaiting your confirmation so the host can finalise plans.";
    case "confirmed":
      return "You’ve accepted this booking — show up ready to deliver.";
    case "completed":
      return "Service delivered successfully.";
    case "declined":
      return "You declined this request. The host has been notified in mock UI only.";
    case "cancelled":
      return "This booking was cancelled and is no longer active.";
  }
}

export function formatPartnerBookingPrice(priceGhs: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(priceGhs);
}

export function formatPartnerBookingEventDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatPartnerBookingUpdatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function clonePartnerBooking(booking: PartnerBooking): PartnerBooking {
  return {
    ...booking,
    customer: { ...booking.customer },
  };
}

/**
 * Seed bookings for mock service-provider partners.
 * Coastal Mobile Bar (PW-PRT-COAST1) and Glow Events Catering (PW-PRT-GLOW1).
 */
export function createMockPartnerBookings(): PartnerBooking[] {
  return [
    {
      id: "booking-pw-1048",
      reference: "PW-1048",
      partnerId: "PW-PRT-GLOW1",
      customer: {
        name: "Abena Owusu",
        email: "abena.owusu@email.gh",
        phone: "+233 24 110 8842",
      },
      serviceId: "svc-glow-wedding-spread",
      serviceName: "Garden Wedding Spread",
      packageName: "Premium live stations",
      eventType: "Garden Wedding",
      eventDate: "2026-11-18",
      eventTime: "2:00 PM",
      location: "Private garden · East Legon, Accra",
      guestCount: 80,
      priceGhs: 10800,
      specialRequests:
        "Include vegetarian live station and soft-drink pairing for the toast table.",
      status: "confirmed",
      createdAt: "2026-11-10T09:15:00.000Z",
      updatedAt: "2026-11-12T16:40:00.000Z",
    },
    {
      id: "booking-pw-1051",
      reference: "PW-1051",
      partnerId: "PW-PRT-GLOW1",
      customer: {
        name: "Kwame Boateng",
        email: "kwame.b@email.gh",
        phone: "+233 20 441 2290",
      },
      serviceId: "svc-glow-private-chef",
      serviceName: "Private Chef Experience",
      packageName: "Up to 40 guests",
      eventType: "Birthday Dinner",
      eventDate: "2026-11-22",
      eventTime: "6:30 PM",
      location: "Home kitchen · Tema Community 4",
      guestCount: 36,
      priceGhs: 3600,
      specialRequests: "Nut-free dessert option for two guests.",
      status: "pending",
      createdAt: "2026-11-19T11:05:00.000Z",
      updatedAt: "2026-11-19T11:05:00.000Z",
    },
    {
      id: "booking-pw-1039",
      reference: "PW-1039",
      partnerId: "PW-PRT-GLOW1",
      customer: {
        name: "Serwaa Mensah",
        email: "serwaa.m@email.gh",
        phone: "+233 27 660 1188",
      },
      serviceId: "svc-glow-private-chef",
      serviceName: "Private Chef Experience",
      packageName: "Up to 20 guests",
      eventType: "Family Reunion",
      eventDate: "2026-11-08",
      eventTime: "1:00 PM",
      location: "Compound house · Ashaiman",
      guestCount: 18,
      priceGhs: 2200,
      specialRequests: "",
      status: "completed",
      createdAt: "2026-10-28T14:20:00.000Z",
      updatedAt: "2026-11-08T18:10:00.000Z",
    },
    {
      id: "booking-pw-1042",
      reference: "PW-1042",
      partnerId: "PW-PRT-GLOW1",
      customer: {
        name: "Nana Adjei",
        email: "nana.adjei@email.gh",
        phone: "+233 55 902 4411",
      },
      serviceId: "svc-glow-private-chef",
      serviceName: "Private Chef Experience",
      packageName: "Up to 20 guests",
      eventType: "Private Dinner",
      eventDate: "2026-11-05",
      eventTime: "7:00 PM",
      location: "Apartment · Airport Residential",
      guestCount: 12,
      priceGhs: 2200,
      specialRequests: "Quiet plating — surprise anniversary dinner.",
      status: "completed",
      createdAt: "2026-10-30T08:45:00.000Z",
      updatedAt: "2026-11-05T22:00:00.000Z",
    },
    {
      id: "booking-pw-1054",
      reference: "PW-1054",
      partnerId: "PW-PRT-COAST1",
      customer: {
        name: "Linda Quaye",
        email: "linda.quaye@email.gh",
        phone: "+233 24 778 3301",
      },
      serviceId: "svc-coast-signature-bar",
      serviceName: "Signature Mobile Cocktail Bar",
      packageName: "Classic bar setup",
      eventType: "Beach Wedding",
      eventDate: "2026-11-29",
      eventTime: "4:00 PM",
      location: "Elmina beach pavilion",
      guestCount: 60,
      priceGhs: 2800,
      specialRequests: "Extra ice and non-alcoholic welcome punch.",
      status: "pending",
      createdAt: "2026-11-18T10:30:00.000Z",
      updatedAt: "2026-11-18T10:30:00.000Z",
    },
    {
      id: "booking-pw-1045",
      reference: "PW-1045",
      partnerId: "PW-PRT-COAST1",
      customer: {
        name: "Yaw Asante",
        email: "yaw.asante@email.gh",
        phone: "+233 26 115 7780",
      },
      serviceId: "svc-coast-sunset-sips",
      serviceName: "Sunset Sips Experience",
      packageName: "Sunset package",
      eventType: "Engagement Party",
      eventDate: "2026-11-15",
      eventTime: "5:30 PM",
      location: "Rooftop · Cape Coast Castle area",
      guestCount: 28,
      priceGhs: 1600,
      specialRequests: "",
      status: "confirmed",
      createdAt: "2026-11-06T13:00:00.000Z",
      updatedAt: "2026-11-07T09:20:00.000Z",
    },
    {
      id: "booking-pw-1033",
      reference: "PW-1033",
      partnerId: "PW-PRT-COAST1",
      customer: {
        name: "Efua Darko",
        email: "efua.darko@email.gh",
        phone: "+233 50 221 9944",
      },
      serviceId: "svc-coast-signature-bar",
      serviceName: "Signature Mobile Cocktail Bar",
      packageName: "Premium celebration bar",
      eventType: "Corporate Mixer",
      eventDate: "2026-10-25",
      eventTime: "6:00 PM",
      location: "Hotel courtyard · Cape Coast",
      guestCount: 90,
      priceGhs: 4200,
      specialRequests: "Branded napkin stubs if available.",
      status: "declined",
      createdAt: "2026-10-12T16:10:00.000Z",
      updatedAt: "2026-10-13T11:45:00.000Z",
    },
    {
      id: "booking-pw-1028",
      reference: "PW-1028",
      partnerId: "PW-PRT-COAST1",
      customer: {
        name: "Kojo Ampofo",
        email: "kojo.ampofo@email.gh",
        phone: "+233 27 334 5510",
      },
      serviceId: "svc-coast-sunset-sips",
      serviceName: "Sunset Sips Experience",
      packageName: "Sunset package",
      eventType: "Birthday Party",
      eventDate: "2026-10-18",
      eventTime: "3:00 PM",
      location: "Private villa · Elmina",
      guestCount: 40,
      priceGhs: 1600,
      specialRequests: "Host cancelled after venue change.",
      status: "cancelled",
      createdAt: "2026-10-02T09:00:00.000Z",
      updatedAt: "2026-10-10T14:25:00.000Z",
    },
  ];
}
