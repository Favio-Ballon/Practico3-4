from django.urls import path, include
from rest_framework import routers

from libreria.apis import LibroViewSet, CarritoViewSet, CompraViewSet, GeneroViewSet, UserViewSet, AuthViewSet

router = routers.DefaultRouter()

router.register('usuarios', UserViewSet, basename='usuarios')
router.register('libros', LibroViewSet, basename='libros')
router.register('carrito', CarritoViewSet, basename='carrito')
router.register('compras', CompraViewSet, basename='compras')
router.register('generos', GeneroViewSet, basename='generos')
router.register("auth", AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]