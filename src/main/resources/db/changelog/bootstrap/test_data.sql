-- liquibase formatted sql

-- changeset enes:insert-test-data
INSERT INTO location (id, name, country, city, location_code)
VALUES (1, 'Taksim Square', 'Turkey', 'Istanbul', 'TKSQ'),
       (2, 'Istanbul Airport', 'Turkey', 'Istanbul', 'IST'),
       (3, 'Sabiha Gokcen Airport', 'Turkey', 'Istanbul', 'SAW'),
       (4, 'London Heathrow Airport', 'England', 'London', 'LHR'),
       (5, 'Wembley Stadium', 'England', 'London', 'WS');

INSERT INTO transportation (id, origin_id, destination_id, transportation_type)
VALUES (1, 1, 2, 2),
       (2, 1, 2, 3),
       (3, 2, 4, 0),
       (4, 4, 5, 1),
       (5, 4, 5, 3),
       (6, 1, 3, 1),
       (7, 3, 5, 1);

INSERT INTO transportation_operating_day(transportation_id, operating_day)
VALUES (1, 1),
       (1, 3),
       (2, 1),
       (2, 3),
       (3, 1),
       (3, 3),
       (4, 1),
       (4, 3),
       (5, 1),
       (5, 3),
       (6, 1),
       (6, 3),
       (7, 1),
       (7, 3);