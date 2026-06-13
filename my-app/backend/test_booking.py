import requests

payload = {
    "booking_type": "room",
    "room": 4,
    "package": None,
    "check_in_date": "2026-10-01",
    "check_out_date": "2026-10-03",
    "check_in_time": "14:00",
    "full_name": "Test User",
    "phone": "1234567890",
    "alternate_phone": "",
    "email": "",
    "number_of_guests": 2,
    "message": ""
}

try:
    res = requests.post('http://127.0.0.1:8001/api/bookings/', json=payload)
    print("Room Booking Status code:", res.status_code)
    print(res.text)
except Exception as e:
    print(e)

payload_group = {
    "booking_type": "group",
    "room": None,
    "package": 4,
    "check_in_date": "2026-10-01",
    "check_out_date": "2026-10-03",
    "check_in_time": "14:00",
    "full_name": "Test Group",
    "phone": "1234567890",
    "alternate_phone": "",
    "email": "",
    "number_of_guests": 40,
    "message": ""
}

try:
    res = requests.post('http://127.0.0.1:8001/api/bookings/', json=payload_group)
    print("Group Booking Status code:", res.status_code)
    print(res.text)
except Exception as e:
    print(e)
