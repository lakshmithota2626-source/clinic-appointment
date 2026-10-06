# Quick API checks

## Health
GET http://localhost:8080/api/health

## Register
POST http://localhost:8080/api/users/register
Content-Type: application/json

{
  "name": "Demo Patient",
  "email": "patient@example.com",
  "password": "1234",
  "role": "PATIENT"
}

## Login
POST http://localhost:8080/api/users/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "1234"
}

## Doctors
GET http://localhost:8080/api/doctors

## All appointments
GET http://localhost:8080/api/appointments
