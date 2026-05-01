from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Appointment

class PreBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        doctor_id = request.data.get("doctor_id")
        report_id = request.data.get("report_id")

        if not doctor_id or not report_id:
            return Response({"error": "doctor_id & report_id required"}, status=400)

        appointment = Appointment.objects.create(
            user=request.user,
            doctor_id=doctor_id,
            report_id=report_id
        )

        return Response({
            "appointment_id": appointment.id,
            "status": "pending"
        })


class AppointmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.filter(user=request.user)
        return Response(list(appointments.values()))