from django.db import models
import uuid
from reports.models import Report
from bookings.models import Appointment

class DoctorVerification(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)

    token = models.UUIDField(default=uuid.uuid4, unique=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending","Pending"),
            ("approved","Approved"),
            ("rejected","Rejected")
        ],
        default="pending"
    )