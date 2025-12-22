-- liquibase formatted sql

-- changeset enes:transportation-operating-day-table
CREATE TABLE IF NOT EXISTS transportation_operating_day
(
    transportation_id BIGINT   NOT NULL,
    operating_day     SMALLINT NOT NULL,
    CONSTRAINT pk_transportation_operating_day PRIMARY KEY (transportation_id, operating_day),
    CONSTRAINT fk_transportation_operating_day FOREIGN KEY (transportation_id) REFERENCES transportation (id) ON DELETE CASCADE
);

-- changeset enes:transportation-operating-day-idx
CREATE INDEX idx_operating_day
    ON transportation_operating_day (operating_day);
