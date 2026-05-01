from django.urls import path
from .views import ShareView, VerifyView

urlpatterns = [
    path("share/<int:appointment_id>/", ShareView.as_view()),
    path("verify/<uuid:token>/", VerifyView.as_view()),
]