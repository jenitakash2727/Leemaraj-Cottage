from django.db import models
from cloudinary.models import CloudinaryField

class Room(models.Model):
    name = models.CharField(max_length=200)
    floor = models.CharField(max_length=100)
    room_type = models.CharField(max_length=100)
    area_sqft = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    suitable_guests = models.IntegerField(default=2)
    additional_guest_info = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image', blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    is_main = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.room.name} Image"

class GroupPackage(models.Model):
    title = models.CharField(max_length=200)
    guest_range = models.CharField(max_length=100)
    min_guest_count = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    no_extra_charges = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class GroupPackageImage(models.Model):
    package = models.ForeignKey(GroupPackage, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image', blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    is_main = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cottage_packageimage'

class Amenity(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Policy(models.Model):
    POLICY_TYPES = (
        ('cancellation', 'Cancellation'),
        ('checkin', 'Check-In'),
        ('terms', 'Terms'),
    )
    policy_type = models.CharField(max_length=50, choices=POLICY_TYPES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    booking_reference = models.CharField(max_length=8, unique=True, blank=True, null=True)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    package = models.ForeignKey(GroupPackage, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    
    booking_type = models.CharField(max_length=10, default='room')
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    check_in_time = models.TimeField(null=True, blank=True)
    
    number_of_guests = models.IntegerField()
    total_estimated_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    message = models.TextField(blank=True, null=True)
    payment_option = models.CharField(max_length=10, default='cash')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} - {self.full_name}"

class ContactEnquiry(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry {self.name}"
