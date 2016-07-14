export interface IItem {
  quantity: number;
  description: string;
}

export interface IOrder {
  id: number;
  customer: string;
  items: IItem[];
}

export const fakeApiOrderData = [
  {
    'id': 123,
    'customer': 'Oasis Digital',
    'items': [
      {
        'quantity': 3,
        'description': 'Widgets'
      }, {
        'quantity': 2,
        'description': 'FooVase'
      }, {
        'quantity': 6,
        'description': 'BarMitzvah'
      }
    ]
  },
  {
    'id': 456,
    'customer': 'Paul',
    'items': [
      {
        'quantity': 1,
        'description': 'Sprockets'
      }, {
        'quantity': 26,
        'description': 'Spanners'
      }, {
        'quantity': 9,
        'description': 'Wizbangers'
      }
    ]
  }
];
