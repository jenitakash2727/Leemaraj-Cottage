from rest_framework import viewsets, status, views, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from decouple import config
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Room, RoomImage, GroupPackage, GroupPackageImage, Amenity, Policy, Booking, ContactEnquiry
from .serializers import RoomSerializer, RoomImageSerializer, GroupPackageSerializer, GroupPackageImageSerializer, AmenitySerializer, PolicySerializer, BookingSerializer, ContactEnquirySerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    @action(detail=True, methods=['post'], url_path='images/bulk-upload')
    def bulk_upload_images(self, request, pk=None):
        room = self.get_object()
        images = request.FILES.getlist('images')
        
        if not images:
            return Response({"error": "No images uploaded."}, status=status.HTTP_400_BAD_REQUEST)
            
        main_index_str = request.data.get('main_index', None)
        selected_main_index = -1
        if main_index_str is not None:
            try:
                selected_main_index = int(main_index_str)
                if selected_main_index < 0 or selected_main_index >= len(images):
                    selected_main_index = 0
            except ValueError:
                selected_main_index = 0
                
        has_existing_main = room.images.filter(is_main=True).exists()
        
        if selected_main_index >= 0 and has_existing_main:
            room.images.update(is_main=False)
            
        uploaded_images = []
        try:
            for idx, img in enumerate(images):
                is_main = False
                if selected_main_index == idx:
                    is_main = True
                elif not has_existing_main and selected_main_index == -1 and idx == 0:
                    is_main = True
                    has_existing_main = True # prevent subsequent images from becoming main
                    
                display_order = room.images.count() + 1
                
                room_img = RoomImage.objects.create(
                    room=room,
                    image=img,
                    title=img.name,
                    display_order=display_order,
                    is_main=is_main
                )
                uploaded_images.append(room_img)
        except Exception as e:
            return Response({"error": f"Cloudinary upload failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = RoomImageSerializer(uploaded_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='images')
    def upload_image(self, request, pk=None):
        room = self.get_object()
        image = request.FILES.get('image')
        RoomImage.objects.create(room=room, image=image)
        return Response({'status': 'image uploaded'}, status=status.HTTP_201_CREATED)

class RoomImageViewSet(viewsets.ModelViewSet):
    queryset = RoomImage.objects.all()
    serializer_class = RoomImageSerializer

    @action(detail=True, methods=['patch'], url_path='set-main')
    def set_main(self, request, pk=None):
        img = self.get_object()
        RoomImage.objects.filter(room=img.room).update(is_main=False)
        img.is_main = True
        img.save()
        return Response({'status': 'main image set'})

class GroupPackageViewSet(viewsets.ModelViewSet):
    queryset = GroupPackage.objects.all()
    serializer_class = GroupPackageSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        return Response({"error": "Creating new group bookings is not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({"error": "Deleting group bookings is not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['post'], url_path='images/bulk-upload')
    def bulk_upload_images(self, request, pk=None):
        package = self.get_object()
        images = request.FILES.getlist('images')
        
        if not images:
            return Response({"error": "No images uploaded."}, status=status.HTTP_400_BAD_REQUEST)
            
        main_index_str = request.data.get('main_index', None)
        selected_main_index = -1
        if main_index_str is not None:
            try:
                selected_main_index = int(main_index_str)
                if selected_main_index < 0 or selected_main_index >= len(images):
                    selected_main_index = 0
            except ValueError:
                selected_main_index = 0
                
        has_existing_main = package.images.filter(is_main=True).exists()
        
        if selected_main_index >= 0 and has_existing_main:
            package.images.update(is_main=False)
            
        uploaded_images = []
        try:
            for idx, img in enumerate(images):
                is_main = False
                if selected_main_index == idx:
                    is_main = True
                elif not has_existing_main and selected_main_index == -1 and idx == 0:
                    is_main = True
                    has_existing_main = True
                    
                display_order = package.images.count() + 1
                
                pkg_img = GroupPackageImage.objects.create(
                    package=package,
                    image=img,
                    title=img.name,
                    display_order=display_order,
                    is_main=is_main
                )
                uploaded_images.append(pkg_img)
        except Exception as e:
            return Response({"error": f"Cloudinary upload failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            
        serializer = GroupPackageImageSerializer(uploaded_images, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='images')
    def upload_image(self, request, pk=None):
        package = self.get_object()
        image = request.FILES.get('image')
        GroupPackageImage.objects.create(package=package, image=image)
        return Response({'status': 'image uploaded'}, status=status.HTTP_201_CREATED)

class GroupPackageImageViewSet(viewsets.ModelViewSet):
    queryset = GroupPackageImage.objects.all()
    serializer_class = GroupPackageImageSerializer

    @action(detail=True, methods=['patch'], url_path='set-main')
    def set_main(self, request, pk=None):
        img = self.get_object()
        GroupPackageImage.objects.filter(package=img.package).update(is_main=False)
        img.is_main = True
        img.save()
        return Response({'status': 'main image set'})

class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status__iexact=status_param)
        return queryset

    def check_booking_conflict(self, booking_type, room_id, check_in_date, check_out_date, exclude_booking_id=None):
        from django.db.models import Q
        
        overlap_q = Q(check_in_date__lt=check_out_date) & Q(check_out_date__gt=check_in_date)
        status_q = Q(status__in=['pending', 'confirmed'])
        base_qs = Booking.objects.filter(overlap_q, status_q)
        if exclude_booking_id:
            base_qs = base_qs.exclude(id=exclude_booking_id)

        if booking_type == 'room':
            if base_qs.filter(booking_type='group').exists():
                return False, "The whole cottage is already booked or pending for the selected dates."
            if base_qs.filter(booking_type='room', room_id=room_id).exists():
                return False, "This room is already booked or pending for the selected dates."
        elif booking_type == 'group':
            if base_qs.filter(booking_type='group').exists():
                return False, "The whole cottage is already booked or pending for the selected dates."
            if base_qs.filter(booking_type='room').exists():
                return False, "Group booking is not available because a room is already booked or pending for the selected dates."
        
        return True, "Available"

    def create(self, request, *args, **kwargs):
        import string
        import random
        from datetime import datetime

        data = request.data.copy()
        booking_type = data.get('booking_type', 'room')

        # Fix email if empty
        if 'email' in data and not data['email']:
            data['email'] = 'no-email@example.com'

        # Fix number_of_guests if empty
        if not data.get('number_of_guests'):
            data['number_of_guests'] = 1

        # Check required fields
        if booking_type == 'room':
            if not data.get('room'):
                return Response({'room': ['Room is required for room booking.']}, status=status.HTTP_400_BAD_REQUEST)
        elif booking_type == 'group':
            if not data.get('package'):
                return Response({'package': ['Package is required for group booking.']}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Conflict check
        try:
            check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
            check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
            is_available, conflict_msg = self.check_booking_conflict(booking_type, data.get('room'), check_in, check_out)
            if not is_available:
                return Response({'error': conflict_msg}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            pass # Invalid dates handled by serializer


        # Calculate estimated amount
        try:
            check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
            check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
            days = (check_out - check_in).days
            if days < 1:
                days = 1
        except Exception:
            days = 1

        total_amount = 0
        if booking_type == 'room':
            room_id = data.get('room')
            room = Room.objects.get(id=room_id)
            total_amount = days * room.price_per_day
        elif booking_type == 'group':
            package_id = data.get('package')
            package = GroupPackage.objects.get(id=package_id)
            guests = int(data.get('number_of_guests', 1))
            if guests <= package.min_guest_count:
                return Response({'number_of_guests': [f'Guest count must be greater than {package.min_guest_count} for this package.']}, status=status.HTTP_400_BAD_REQUEST)
            total_amount = days * package.price

        # Generate unique reference
        ref = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        # Ensure optional string fields are empty strings instead of None
        # This prevents "Column '...' cannot be null" 500 errors in Aiven MySQL
        save_kwargs = {
            'booking_reference': ref,
            'total_estimated_amount': total_amount,
        }
        if data.get('admin_notes') is None:
            save_kwargs['admin_notes'] = ''
        if data.get('message') is None:
            save_kwargs['message'] = ''
        if data.get('alternate_phone') is None:
            save_kwargs['alternate_phone'] = ''
            
        # Save
        try:
            booking = serializer.save(**save_kwargs)
            return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        from datetime import datetime
        instance = self.get_object()
        data = request.data
        new_status = data.get('status')
        
        if new_status in ['pending', 'confirmed'] and instance.status not in ['pending', 'confirmed']:
            is_available, conflict_msg = self.check_booking_conflict(
                instance.booking_type, 
                instance.room_id, 
                instance.check_in_date, 
                instance.check_out_date,
                exclude_booking_id=instance.id
            )
            if not is_available:
                return Response({'error': "Cannot confirm because another booking conflicts with these dates."}, status=status.HTTP_400_BAD_REQUEST)
                
        elif new_status == 'confirmed' and instance.status == 'pending':
            is_available, conflict_msg = self.check_booking_conflict(
                instance.booking_type, 
                instance.room_id, 
                instance.check_in_date, 
                instance.check_out_date,
                exclude_booking_id=instance.id
            )
            if not is_available:
                return Response({'error': "Cannot confirm because another booking conflicts with these dates."}, status=status.HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)

class ContactEnquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactEnquiry.objects.all()
    serializer_class = ContactEnquirySerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        if not data.get('email'):
            data['email'] = 'no-email@example.com'
            
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            enquiry = serializer.save()
            
            # Send Email Notification
            try:
                subject = f"New Enquiry from {enquiry.name}"
                body = f"Name: {enquiry.name}\nPhone: {enquiry.phone}\nEmail: {enquiry.email}\nMessage:\n{enquiry.message}"
                # Assuming DEFAULT_FROM_EMAIL is set or fallback
                send_mail(
                    subject,
                    body,
                    'no-reply@example.com', # from email
                    ['admin@festivalpetrothel.com'], # to email (example)
                    fail_silently=False,
                )
            except Exception as e:
                print("Email notification failed:", e)
                
            return Response({
                "success": True,
                "message": "Your enquiry has been sent successfully."
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckAvailabilityView(views.APIView):
    def post(self, request):
        from datetime import datetime
        data = request.data
        booking_type = data.get('booking_type', 'room')
        room_id = data.get('room')
        try:
            check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
            check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
            
            # Reusing the same logic from BookingViewSet
            bv = BookingViewSet()
            is_available, msg = bv.check_booking_conflict(booking_type, room_id, check_in, check_out)
            return Response({'available': is_available, 'message': msg})
        except Exception as e:
            return Response({'available': False, 'message': 'Invalid dates'})

from django.db.models import Sum, Count
from django.utils import timezone

class AdminStatsView(views.APIView):
    def get(self, request):
        today = timezone.now().date()
        this_month = today.replace(day=1)
        
        bookings = Booking.objects.all()
        
        pending = bookings.filter(status='pending').count()
        confirmed = bookings.filter(status='confirmed').count()
        cancelled = bookings.filter(status='cancelled').count()
        completed = bookings.filter(status='completed').count()
        
        today_bookings = bookings.filter(created_at__date=today).count()
        this_month_bookings = bookings.filter(created_at__date__gte=this_month).count()
        total_bookings = bookings.count()
        
        revenue_estimate = bookings.filter(status__in=['confirmed', 'completed']).aggregate(total=Sum('total_estimated_amount'))['total'] or 0
        
        popular_room_obj = Room.objects.annotate(booking_count=Count('bookings')).order_by('-booking_count').first()
        popular_package_obj = GroupPackage.objects.annotate(booking_count=Count('bookings')).order_by('-booking_count').first()
        
        popular_room = popular_room_obj.name if popular_room_obj else 'N/A'
        popular_package = popular_package_obj.title if popular_package_obj else 'N/A'
        
        unresolved = ContactEnquiry.objects.count()
        recent_bookings = BookingSerializer(bookings.order_by('-created_at')[:5], many=True).data

        return Response({
            'bookings': {
                'pending': pending,
                'confirmed': confirmed,
                'cancelled': cancelled,
                'completed': completed,
                'today': today_bookings,
                'this_month': this_month_bookings,
                'total': total_bookings
            },
            'analytics': {
                'revenue_estimate': revenue_estimate,
                'popular_room': popular_room,
                'popular_package': popular_package
            },
            'enquiries': {
                'unresolved': unresolved
            },
            'recent_bookings': recent_bookings
        })

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class GoogleLoginView(views.APIView):
    def post(self, request):
        token = request.data.get('credential')
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), config('GOOGLE_CLIENT_ID', default=''))
            email = idinfo.get('email')
            user, created = User.objects.get_or_create(username=email, defaults={'email': email})
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {'email': user.email, 'is_staff': user.is_staff}
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

import requests

class SupabaseLoginView(views.APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        
        if not access_token:
            return Response({'error': 'Missing access_token'}, status=status.HTTP_400_BAD_REQUEST)
            
        supabase_url = config('SUPABASE_URL', default='')
        supabase_anon_key = config('SUPABASE_ANON_KEY', default='')
        
        if not supabase_url or not supabase_anon_key:
            return Response({'error': 'Supabase not configured on backend'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        headers = {
            'apikey': supabase_anon_key,
            'Authorization': f'Bearer {access_token}'
        }
        
        # Securely verify token by fetching user from Supabase
        res = requests.get(f'{supabase_url}/auth/v1/user', headers=headers)
        
        if res.status_code != 200:
            return Response({'error': 'Invalid or expired Supabase token'}, status=status.HTTP_401_UNAUTHORIZED)
            
        user_data = res.json()
        email = user_data.get('email')
        
        if not email:
            return Response({'error': 'No email found in Supabase user profile'}, status=status.HTTP_400_BAD_REQUEST)
            
        admin_emails_str = config('ADMIN_GOOGLE_EMAILS', default='')
        admin_emails = [e.strip() for e in admin_emails_str.split(',') if e.strip()]
        
        is_admin = email in admin_emails
        
        user, created = User.objects.get_or_create(username=email, defaults={'email': email})
        
        # Enforce admin status from list
        if is_admin and not user.is_staff:
            user.is_staff = True
            user.is_superuser = True
            user.save()
        elif not is_admin and user.is_staff:
            user.is_staff = False
            user.is_superuser = False
            user.save()
            
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': 'admin' if is_admin else 'customer',
            'user': {'email': user.email, 'name': user_data.get('user_metadata', {}).get('full_name', '')}
        })
