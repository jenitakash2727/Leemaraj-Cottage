import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from cottage.models import Booking, Room, GroupPackage
from datetime import date
import urllib.request
import json

# Setup
room = Room.objects.first()
pkg = GroupPackage.objects.first()

print(f"Using Room: {room.id}, Package: {pkg.id}")

def check_avail(btype, start, end, rid=None, pid=None):
    data = {'booking_type': btype, 'check_in_date': start, 'check_out_date': end}
    if rid: data['room'] = rid
    if pid: data['package'] = pid
    req = urllib.request.Request('http://127.0.0.1:8001/api/check-availability/', data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    res = urllib.request.urlopen(req)
    return json.loads(res.read().decode('utf-8'))

def book(btype, start, end, rid=None, pid=None, status='pending'):
    data = {'booking_type': btype, 'check_in_date': start, 'check_out_date': end, 'status': status, 'full_name': 'Test', 'email': 'a@b.c', 'phone': '12', 'number_of_guests': 10}
    if rid: data['room'] = rid
    if pid: data['package'] = pid
    try:
        req = urllib.request.Request('http://127.0.0.1:8001/api/bookings/', data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
        res = urllib.request.urlopen(req)
        return json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {'error': e.read().decode('utf-8')}

# Test A
print("Test A: Book room")
resA = book('room', '2026-06-14', '2026-06-19', rid=room.id)
print(resA)

# Test B
print("Test B: Group booking over same dates")
resB = book('group', '2026-06-14', '2026-06-18', pid=pkg.id)
print(resB)

# Delete to cleanup
if 'id' in resA:
    Booking.objects.get(id=resA['id']).delete()
