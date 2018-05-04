CREATE SCHEMA tweeter;
SET search_path TO tweeter;

CREATE TABLE Tweet_DB (
	id				SERIAL  PRIMARY KEY,
    content    varchar(700) NOT NULL,
    username        varchar(25) NOT NULL,         
    timestamp       date NOT NULL
);

CREATE TABLE Like_DB (
	id 				SERIAL PRIMARY KEY,
    post_id         integer NOT NULL REFERENCES Tweet_DB (id),
    username        varchar(25) NOT NULL,
    timestamp       date NOT NULL
);

CREATE TABLE ReTweet_DB (
    id 				SERIAL PRIMARY KEY,
	post_id         integer NOT NULL REFERENCES Tweet_DB (id),
    username        varchar(25) NOT NULL,       
    timestamp       date
);