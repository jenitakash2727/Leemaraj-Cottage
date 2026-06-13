from rest_framework import serializers
from .models import GalleryImage

class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='uploaded_at', read_only=True)

    class Meta:
        model = GalleryImage
        fields = ['id', 'category', 'image', 'image_url', 'title', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            try:
                url = obj.image.url
            except AttributeError:
                url = str(obj.image)
            
            if url:
                if url.startswith('http'):
                    return url
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(url)
                return url
        return None
