from django.db import models


class Carrito(models.Model):
    libros = models.ManyToManyField('libreria.Libro', related_name='carritos')
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    libro = models.ManyToManyField('libreria.Libro', related_name='carritos_libro')
    usuario = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='carritos', null=True, blank=True
    )

    def __str__(self):
        return f"Carrito {self.id} - Libro: {self.libro.titulo} "