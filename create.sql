-- GRANT CONNECT ON DATABASE "cccat14-taxi_online" TO augusto;

-- CREATE ROLE augusto LOGIN PASSWORD 'coloque-aqui-a-senha-do-usuario';

-- GRANT CREATE ON SCHEMA cccat14 TO augusto;


drop schema cccat14 cascade;

create schema cccat14;

ALTER SCHEMA cccat14 OWNER TO augusto;

create table cccat14.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
);

create table cccat14.ride (
  ride_id uuid primary key,
  passenger_id uuid,
  driver_id uuid,
  fare numeric,
  distance numeric,
  status text,
  from_lat numeric,
  from_long numeric,
  to_lat numeric,
  to_long numeric,
  date timestamp
);
