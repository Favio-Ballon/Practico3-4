from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.permissions import DjangoModelPermissions


class AllowGetAnyElseAuthenticatedAndPermitted(DjangoModelPermissions):
    """
    Permite GET a cualquiera.
    Otros métodos requieren autenticación + permisos específicos.
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return super().has_permission(request, view)
