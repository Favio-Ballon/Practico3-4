from django.db import models

class Compra(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    libro = models.ManyToManyField('libreria.Libro', related_name='compras')
    usuario = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='compras')
    comprobante_pago = models.ImageField(upload_to='comprobantes/', null=True, blank=True)

    def __str__(self):
        return f'Compra {self.id} - {self.libro.titulo} por {self.usuario.username}'