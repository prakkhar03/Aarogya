class VerifyView(APIView):

    def post(self, request, token):
        verification = DoctorVerification.objects.get(token=token)

        action = request.data.get("action")

        verification.status = action
        verification.save()

        appointment = verification.appointment

        if action == "approved":
            appointment.status = "confirmed"
        else:
            appointment.status = "cancelled"

        appointment.save()

        return Response({
            "appointment_status": appointment.status
        })