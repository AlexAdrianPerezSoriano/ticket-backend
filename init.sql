-- Creamos la tabla de eventos
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    place VARCHAR(255) NOT NULL,
    total_tickets INT NOT NULL,
    available_tickets INT NOT NULL
);

-- Creamos la tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insertamos datos de ejemplo (para que no esté vacío al inicio)
INSERT INTO events (name, date, place, total_tickets, available_tickets) VALUES
('Concierto de Rock', '2026-10-15', 'Guayaquil', 100, 100),
('Obra de Teatro', '2026-10-20', 'Quito', 50, 50),
('Festival de Cine', '2026-11-01', 'Guayaquil', 200, 200);
