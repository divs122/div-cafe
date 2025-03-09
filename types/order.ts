export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface DeliveryDetails {
  name: string
  hostelRoom: string
  phone: string
  instructions?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  createdAt: string
  deliveryDetails: DeliveryDetails
} 