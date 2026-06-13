from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import GalleryImage
from .serializers import GalleryImageSerializer

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer

    def create(self, request, *args, **kwargs):
        images = request.FILES.getlist('images')
        single_image = request.FILES.get('image')
        
        category = request.data.get('category', 'other')
        title = request.data.get('title', '')
        
        created_images = []
        
        if images:
            for idx, img in enumerate(images):
                img_title = f"{title} {idx + 1}".strip() if title else img.name.split('.')[0]
                gallery_img = GalleryImage.objects.create(
                    image=img,
                    category=category,
                    title=img_title
                )
                created_images.append(gallery_img)
            
            serializer = self.get_serializer(created_images, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        elif single_image:
            img_title = title if title else single_image.name.split('.')[0]
            gallery_img = GalleryImage.objects.create(
                image=single_image,
                category=category,
                title=img_title
            )
            serializer = self.get_serializer(gallery_img)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response({'detail': 'No image provided.'}, status=status.HTTP_400_BAD_REQUEST)
