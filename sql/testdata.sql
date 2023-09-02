
INSERT INTO org (id, name, description)
VALUES 
    (0, 'TEST ORG', 'THIS IS A TEST ORG'),
    (1, 'TEST ORG1', 'Test ORG 2');

INSERT INTO event (id, org_id, name, description, date, is_recurring)
VALUES 
    (0, 0, 'TEST EVENT', 'THIS IS A TEST EVENT', '1999-01-08 04:05:06', FALSE),
    (2, 0, 'Current', 'THIS IS A TEST EVENT', '2024-01-08 04:05:06', FALSE);