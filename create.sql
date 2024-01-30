-- GRANT CONNECT ON DATABASE "cccat14-taxi_online" TO augusto;

-- CREATE ROLE augusto LOGIN PASSWORD 'coloque-aqui-a-senha-do-usuario';

-- GRANT CREATE ON SCHEMA cccat14 TO augusto;

-- ALTER SCHEMA cccat14 OWNER TO augusto;

drop schema cccat14 cascade;

create schema cccat14;

create table cccat14.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
);

