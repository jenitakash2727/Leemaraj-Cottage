from django.db import models
from cloudinary.models import CloudinaryField

class GalleryImage(models.Model):
    CATEGORY_CHOICES = (
        ('exterior', 'Exterior'),
        ('interior', 'Interior'),
        ('event', 'Event'),
        ('bedroom', 'Bedroom'),
        ('kitchen', 'Kitchen'),
        ('dining', 'Dining Area'),
        ('lounge', 'Lounge / Living'),
        ('other', 'Other'),
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    image = CloudinaryField('image', blank=True, null=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cottage_galleryimage'

    def __str__(self):
        return self.title or f"Gallery Image {self.id}"
