from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token)}

class RegisterView(APIView):

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "username & password required"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        return Response(get_tokens(user))


class LoginView(APIView):

    def post(self, request):
        user = authenticate(
            username=request.data.get("username"),
            password=request.data.get("password")
        )

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        return Response(get_tokens(user))