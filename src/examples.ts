import { ExampleMessage } from './types';

export const EXAMPLE_MESSAGES: ExampleMessage[] = [
  {
    id: 'electricity-bill',
    title: '⚡ Electricity Bill Threat',
    badge: 'Urgent Threat',
    badgeType: 'danger',
    hint: 'Disconnection threat with personal phone number',
    text: `Dear Consumer, Your Electricity power will be disconnected tonight at 9.30 PM from the electricity office because your previous month bill was not updated. Please immediately contact our electricity power officer at 9823456781. Thank you.`,
  },
  {
    id: 'digital-arrest',
    title: '👮 Digital Arrest / Police Notice',
    badge: 'Police / CBI Threat',
    badgeType: 'danger',
    hint: 'Customs parcel seized with drugs, Skype arrest demand',
    text: `URGENT NOTICE: Mumbai Crime Branch & Narcotics Control Bureau (NCB). A FedEx parcel sent to Malaysia under your Aadhaar card containing 5 illegal passports and 140 grams of contraband has been seized. An FIR has been registered. You are placed under Digital Arrest. Immediately click here to attend video interrogation on Skype: https://mumbaipolice-customs-verification.org/case-892 or police team will arrest you at home in 2 hours.`,
  },
  {
    id: 'part-time-job',
    title: '💼 Part-Time YouTube Job',
    badge: 'Fake Job / WFH',
    badgeType: 'danger',
    hint: '₹3,000 daily for liking videos, Telegram task trap',
    text: `Greetings! Earn ₹3,000 to ₹5,000 daily working from home on your mobile phone! Simple work: Just like YouTube videos and subscribe to channels. No experience needed. Immediate daily UPI payment. Contact our hiring manager on Telegram @EarnDaily_India_HR to get ₹500 instant welcome bonus!`,
  },
  {
    id: 'real-bank-alert',
    title: '🏦 Real Bank Debit Alert',
    badge: 'Safe Example',
    badgeType: 'safe',
    hint: 'Official bank transactional SMS without fishy links',
    text: `Rs 1,499.00 debited from HDFC Bank A/c ending 3819 on 17-OCT-26 towards AMAZON INDIA. UPI Ref 429103982101. If not done by you, forward this SMS to 7738000000 or call 18002586161. Never share OTP or UPI PIN with anyone.`,
  },
];
