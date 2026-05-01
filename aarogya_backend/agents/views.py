from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import DoctorVerification
from bookings.models import Appointment

class ShareView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        appointment = get_object_or_404(Appointment, id=appointment_id)

        verification = DoctorVerification.objects.create(
            report=appointment.report,
            appointment=appointment
        )

        return Response({"token": str(verification.token)})


class VerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):
        verification = get_object_or_404(DoctorVerification, token=token)

        action = request.data.get("action")

        verification.status = action
        verification.save()

        appointment = verification.appointment
        appointment.status = "confirmed" if action == "approved" else "cancelled"
        appointment.save()

        return Response({
            "status": appointment.status
        })