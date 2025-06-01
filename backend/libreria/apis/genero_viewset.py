from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions

from libreria.apis.permisos import AllowGetAnyElseAuthenticatedAndPermitted
from libreria.models import Genero


class GeneroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genero
        fields = '__all__'


class GeneroViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowGetAnyElseAuthenticatedAndPermitted]
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer
