import type { Event } from '../types/event';

export const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Live Music at Deep Dive',
    category: 'Music',
    location: 'Deep Dive, Ithaca NY',
    date: 'Tonight',
    time: '8:00 PM - 11:00 PM',
    about:
      'Join us for an authentic night of live indie and jazz performances right along the water.',
    moreInfo: 'Age 21+. Free entry before 9:00 PM.',
  },
  {
    id: '2',
    name: 'Gallery After Hours',
    category: 'Arts',
    location: 'Ithaca Commons',
    date: 'Tomorrow',
    time: '6:00 PM - 9:00 PM',
    about:
      'Explore local artwork, pop-up studios, and interactive digital art exhibits.',
    moreInfo: 'Complimentary beverages provided for students with valid ID.',
  },
  {
    id: '3',
    name: 'Trivia Night at The Bear',
    category: 'Community',
    location: 'Collegetown',
    date: 'Friday',
    time: '7:30 PM',
    about: 'Weekly team trivia night covering pop culture, history, and science.',
    moreInfo: 'Max 6 people per team.',
  },
];
