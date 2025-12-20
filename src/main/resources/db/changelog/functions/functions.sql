-- liquibase formatted sql

-- changeset enes:updated-at-function
CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS
'
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
' LANGUAGE plpgsql;