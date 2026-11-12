export type Event = {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  time: string;
  about: string;
  moreInfo: string;
  price: 'Free' | 'Paid';
  age: 'All ages' | '18+' | '21+';
  perk: string;
};
