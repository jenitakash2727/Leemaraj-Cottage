from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from cottage.views import (
    RoomViewSet, RoomImageViewSet, GroupPackageViewSet, GroupPackageImageViewSet, 
    AmenityViewSet, PolicyViewSet, BookingViewSet, ContactEnquiryViewSet, 
    CheckAvailabilityView, AdminStatsView, GoogleLoginView, SupabaseLoginView
)
from gallery.views import GalleryImageViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'packages', GroupPackageViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'policies', PolicyViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'contact', ContactEnquiryViewSet)
router.register(r'gallery', GalleryImageViewSet)

# Admin specific routes that map to the same viewsets for now
admin_router = DefaultRouter()
admin_router.register(r'rooms', RoomViewSet)
admin_router.register(r'packages', GroupPackageViewSet)
admin_router.register(r'amenities', AmenityViewSet)
admin_router.register(r'policies', PolicyViewSet)
admin_router.register(r'bookings', BookingViewSet)
admin_router.register(r'enquiries', ContactEnquiryViewSet)
admin_router.register(r'gallery', GalleryImageViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/admin/', include(admin_router.urls)),
    path('api/admin/stats/', AdminStatsView.as_view()),
    path('api/check-availability/', CheckAvailabilityView.as_view()),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/google-login/', GoogleLoginView.as_view(), name='google_login'),
    path('api/auth/supabase-login/', SupabaseLoginView.as_view(), name='supabase_login'),
    
    # Custom image routes
    path('api/admin/rooms/<int:room_pk>/images/', RoomViewSet.as_view({'post': 'upload_image'})),
    path('api/admin/rooms/<int:room_pk>/images/bulk-upload/', RoomViewSet.as_view({'post': 'bulk_upload_images'})),
    path('api/admin/rooms/<int:room_pk>/images/<int:pk>/set-main/', RoomImageViewSet.as_view({'patch': 'set_main'})),
    path('api/admin/rooms/<int:room_pk>/images/<int:pk>/', RoomImageViewSet.as_view({'delete': 'destroy'})),

    path('api/admin/packages/<int:package_pk>/images/', GroupPackageViewSet.as_view({'post': 'upload_image'})),
    path('api/admin/packages/<int:package_pk>/images/bulk-upload/', GroupPackageViewSet.as_view({'post': 'bulk_upload_images'})),
    path('api/admin/packages/<int:package_pk>/images/<int:pk>/set-main/', GroupPackageImageViewSet.as_view({'patch': 'set_main'})),
    path('api/admin/packages/<int:package_pk>/images/<int:pk>/', GroupPackageImageViewSet.as_view({'delete': 'destroy'})),
]
