from django.db import models

class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    rating = models.FloatField(default=4.5)

    def __str__(self):
        return self.name