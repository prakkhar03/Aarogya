# doctors/management/commands/seed_doctors.py

from django.core.management.base import BaseCommand
from doctors.models import Doctor
import random

class Command(BaseCommand):
    help = "Seed database with doctors"

    def handle(self, *args, **kwargs):

        specializations = [
            "Endocrinologist",
            "Cardiologist",
            "Dermatologist",
            "Neurologist",
            "Orthopedic",
            "General Physician",
            "Pediatrician"
        ]

        first_names = [
            "Amit", "Rahul", "Karan", "Rohit", "Vikas",
            "Ankit", "Suresh", "Deepak", "Manoj", "Arjun",
            "Vivek", "Rajesh", "Nitin", "Harsh", "Yash"
        ]

        last_names = [
            "Sharma", "Verma", "Gupta", "Agarwal",
            "Mehta", "Jain", "Bansal", "Kapoor"
        ]

        doctors = []

        doctors.append(
            Doctor(
                name="Dr. Narendra Modi",
                specialization="General Physician",
                rating=5.0
            )
        )

        for _ in range(49):
            name = f"Dr. {random.choice(first_names)} {random.choice(last_names)}"

            doctors.append(
                Doctor(
                    name=name,
                    specialization=random.choice(specializations),
                    rating=round(random.uniform(3.5, 5.0), 1)
                )
            )

        Doctor.objects.bulk_create(doctors)

        self.stdout.write(self.style.SUCCESS("50 doctors added successfully 🚀"))