1. Create a database
    CREATE DATABASE imagedb;
2. Create a table
    CREATE TABLE images (
    id SERIAL PRIMARY KEY, 
    title VARCHAR (255) NOT NULL, 
    img_desc VARCHAR (100) NOT NULL, 
    file VARCHAR (100) NOT NULL, 
    no_of_like INTEGER, 
    no_of_dislike  INTEGER,
    is_active BOOLEAN DEFAULT TRUE
    );
3. If facing permission issue run the following commands in the db.
    GRANT ALL PRIVILEGES ON TABLE images TO postgres;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

4. prerequisite
    - Node should be installed in the system
    - database and tables should be created
5. Goto the project directory
6. Run **npm install**
7. Run node app.js