import { supabase } from './supabase'

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('id')

  if (error) throw error
  return data
}

export async function upsertClient({ tg_id, name, username }) {
  const { data, error } = await supabase
    .from('clients')
    .upsert({ tg_id, name, username }, { onConflict: 'tg_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getClientBookings(clientId) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      booking_services (
        service_id,
        services ( id, name, category, price, duration, image_url )
      )
    `)
    .eq('client_id', clientId)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

export async function createBooking({ clientId, serviceIds, date, timeSlot, total }) {
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({ client_id: clientId, date, time_slot: timeSlot, total })
    .select()
    .single()

  if (bookingError) throw bookingError

  const links = serviceIds.map((sid) => ({
    booking_id: booking.id,
    service_id: sid,
  }))

  const { error: linkError } = await supabase
    .from('booking_services')
    .insert(links)

  if (linkError) throw linkError

  return booking
}

export async function cancelBooking(bookingId) {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)

  if (error) throw error
}

export async function getBookedSlots(date) {
  const { data, error } = await supabase
    .from('bookings')
    .select('time_slot')
    .eq('date', date)
    .neq('status', 'cancelled')

  if (error) throw error
  return data.map((booking) => booking.time_slot.slice(0, 5))
}
