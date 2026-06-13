from rest_framework import serializers
from .models import Room, RoomImage, GroupPackage, GroupPackageImage, Amenity, Policy, Booking, ContactEnquiry

class RoomImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'image_url', 'title', 'is_main', 'display_order', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except AttributeError:
                return str(obj.image)
        return None

class RoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    main_image_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'name', 'floor', 'room_type', 'area_sqft', 'description', 'price_per_day', 'suitable_guests', 'additional_guest_info', 'image_url', 'main_image_url', 'images', 'is_available', 'display_order', 'created_at', 'updated_at']

    def validate(self, attrs):
        if 'area_sqft' in attrs and attrs['area_sqft'] == '':
            attrs['area_sqft'] = 0
        if 'description' not in attrs or attrs['description'] is None:
            attrs['description'] = ''
        if 'additional_guest_info' not in attrs or attrs['additional_guest_info'] is None:
            attrs['additional_guest_info'] = ''
        return super().validate(attrs)

    def get_image_url(self, obj):
        if obj.image:
            return str(obj.image)
        return None

    def get_main_image_url(self, obj):
        main_img = obj.images.filter(is_main=True).first()
        if main_img and main_img.image:
            try:
                return main_img.image.url
            except AttributeError:
                return str(main_img.image)
        first_img = obj.images.first()
        if first_img and first_img.image:
            try:
                return first_img.image.url
            except AttributeError:
                return str(first_img.image)
        return self.get_image_url(obj)

class GroupPackageImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GroupPackageImage
        fields = ['id', 'image', 'image_url', 'title', 'is_main', 'display_order', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except AttributeError:
                return str(obj.image)
        return None

class GroupPackageSerializer(serializers.ModelSerializer):
    images = GroupPackageImageSerializer(many=True, read_only=True)
    main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = GroupPackage
        fields = ['id', 'title', 'guest_range', 'min_guest_count', 'price', 'duration', 'description', 'no_extra_charges', 'images', 'main_image_url', 'is_available', 'created_at', 'updated_at']

    def get_main_image_url(self, obj):
        main_img = obj.images.filter(is_main=True).first()
        if main_img and main_img.image:
            try:
                return main_img.image.url
            except AttributeError:
                return str(main_img.image)
        first_img = obj.images.first()
        if first_img and first_img.image:
            try:
                return first_img.image.url
            except AttributeError:
                return str(first_img.image)
        return None

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'description', 'icon', 'is_active']

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = ['id', 'policy_type', 'title', 'content', 'updated_at']

class BookingSerializer(serializers.ModelSerializer):
    room_details = RoomSerializer(source='room', read_only=True)
    package_details = GroupPackageSerializer(source='package', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = '__all__'
