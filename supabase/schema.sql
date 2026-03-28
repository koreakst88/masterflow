-- Клиенты (Telegram пользователи)
create table if not exists clients (
  id         bigserial primary key,
  tg_id      bigint unique not null,
  name       text,
  username   text,
  created_at timestamptz default now()
);

-- Услуги
create table if not exists services (
  id         bigserial primary key,
  name       text not null,
  category   text not null,
  price      integer not null,
  duration   integer not null,
  image_url  text,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- Рабочие часы мастера
create table if not exists working_hours (
  id          bigserial primary key,
  day_of_week integer not null,
  start_time  time not null default '09:00',
  end_time    time not null default '18:00',
  is_active   boolean default true
);

-- Записи
create table if not exists bookings (
  id         bigserial primary key,
  client_id  bigint references clients(id),
  date       date not null,
  time_slot  time not null,
  status     text default 'upcoming',
  total      integer not null,
  created_at timestamptz default now()
);

-- Связка записи и услуг
create table if not exists booking_services (
  id         bigserial primary key,
  booking_id bigint references bookings(id) on delete cascade,
  service_id bigint references services(id)
);

insert into services (name, category, price, duration, image_url) values
  ('Маникюр + гель', 'Маникюр', 8000, 60, '/images/manicure.jpg'),
  ('Педикюр классический', 'Педикюр', 6000, 45, '/images/pedicure.jpg'),
  ('Оформление бровей', 'Брови', 4000, 30, '/images/brows.jpg'),
  ('Наращивание ресниц', 'Ресницы', 12000, 90, '/images/lashes.jpg')
on conflict do nothing;

insert into working_hours (day_of_week, start_time, end_time) values
  (1, '09:00', '18:00'),
  (2, '09:00', '18:00'),
  (3, '09:00', '18:00'),
  (4, '09:00', '18:00'),
  (5, '09:00', '18:00'),
  (6, '10:00', '16:00')
on conflict do nothing;

alter table clients enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
alter table booking_services enable row level security;
alter table working_hours enable row level security;

create policy "services_read_all"
  on services for select using (true);

create policy "working_hours_read_all"
  on working_hours for select using (true);

create policy "clients_insert"
  on clients for insert with check (true);

create policy "clients_read_own"
  on clients for select using (true);

create policy "bookings_insert"
  on bookings for insert with check (true);

create policy "bookings_read_all"
  on bookings for select using (true);

create policy "bookings_update"
  on bookings for update using (true);

create policy "booking_services_insert"
  on booking_services for insert with check (true);

create policy "booking_services_read"
  on booking_services for select using (true);
